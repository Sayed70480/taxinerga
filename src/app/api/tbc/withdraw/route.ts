import { Locale } from "@/i18n/routing";
import { UserProtection } from "@/services/auth/UserProtection";
import connectMongo from "@/services/mongodb/connectMongo";
import WithdrawModel from "@/services/mongodb/models/WithdrawModel";
import { Ubill_SendSMS } from "@/services/ubill/Ubill_SendSMS";
import Yandex_DriverWithdraw from "@/services/yandex/Yandex_DriverWithdraw";
import Yandex_GetDriverBalance from "@/services/yandex/Yandex_GetDriverBalance";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import TBCPasswordModel from "@/services/mongodb/models/TBCPasswordModel";
import Yandex_DriverRefund from "@/services/yandex/Yandex_DriverRefund";
import WithdrawStructModel from "@/services/mongodb/models/WithdrawStructModel";
import { calculateCommission } from "../../admin/helper_functions/calculateCommission";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function POST(req: Request) {
  const headerList = headers();
  const locale = headerList.get("locale") as Locale;
  const t = await getTranslations({ locale });

  await connectMongo();

  try {
    const user = await UserProtection();
    if (!user) {
      return new Response(JSON.stringify({ message: "UNAUTHORIZED" }), { status: 401 });
    }

    const withdrawStruct = await WithdrawStructModel.findOne();
    if (!withdrawStruct) {
      return new Response(JSON.stringify({ message: t("withdraw.withdrawRuleNotFound") }), { status: 400 });
    }

    const { commissionApply, commissionAmount } = await calculateCommission({
      driverId: user.driver_profile.id,
      withdrawStruct,
    });


    const lastWithdraw = await WithdrawModel.findOne({
      driverId: user.driver_profile.id,
    }).sort({ createdAt: -1 });

    if (lastWithdraw) {
      const lastWithdrawTime = dayjs.utc(lastWithdraw.createdAt).tz("Asia/Tbilisi"); // Convert to UTC+4
      const now = dayjs().tz("Asia/Tbilisi");

      if (now.diff(lastWithdrawTime, "minute") < 10) {
        return new Response(JSON.stringify({ message: t("withdraw.tooSoon", { minutes: 10 - now.diff(lastWithdrawTime, "minute") }) }), { status: 400 });
      }
    }

    const { amount, iban, balanceState } = await req.json();

    if(amount < 5){
      return new Response(JSON.stringify({ message: t("withdraw.minAmount") }), { status: 400 });
    }

    if (!isTbcIban(iban)) {
      return new Response(JSON.stringify({ message: t("withdraw.notTBC") }), { status: 400 });
    }

    // ✅ Check balance first
    const balance = await Yandex_GetDriverBalance(user.driver_profile.phones[0]);
    if (!balance || balance < amount || balanceState < amount) {
      return new Response(JSON.stringify({ message: t("withdraw.insufficientBalance") }), { status: 400 });
    }

    // ✅ Deduct balance before sending request
    const deducted = await Yandex_DriverWithdraw(user.driver_profile.id, parseInt(amount));
    if (!deducted) {
      return new Response(JSON.stringify({ message: t("withdraw.mistake") }), { status: 400 });
    }

    const tbcPassword = await TBCPasswordModel.findOne({});

    try {
      // ✅ Send SOAP request to local proxy server
      const response = await axios.post(process.env.TBC_SERVICE + "/tbc-payment", {
        amount: commissionApply ? amount - commissionAmount : amount,
        iban,
        firstName: user.driver_profile.first_name,
        lastName: user.driver_profile.last_name,
        reqPassword: process.env.REQUEST_PASSWORD,
        tbcPassword: tbcPassword?.password,
      });

      const paymentId = response.data.transactionId;

      // ✅ Store in MongoDB
      await new WithdrawModel({
        amount,
        bank: "tbc",
        iban,
        documentNumber: paymentId,
        uniqueKey: paymentId,
        uniqueId: paymentId,
        bank_account: "ltd",
        commission: commissionApply ? commissionAmount : 0,
        driverId: user.driver_profile.id,
        phone: user.driver_profile.phones[0],
        firstName: user.driver_profile.first_name,
        lastName: user.driver_profile.last_name,
        status: "pending",
        createdAt: new Date(),
      }).save();

      // ✅ Send SMS Notification
      if (withdrawStruct.notificationPhonesTBC && withdrawStruct.notificationPhonesTBC.length > 0) {
        await Ubill_SendSMS({
          numbers: withdrawStruct.notificationPhonesTBC,
          text: `მძღოლმა: ${user.driver_profile.first_name} ${user.driver_profile.last_name}, გამოაგზავნა გატანის მოთხოვნა TBC ბანკში. რაოდენობა: ${amount} ₾. ${commissionApply ? "საკომისიო: " + commissionAmount + " ₾" : ""}`,
        });
      }

      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch {
      await Yandex_DriverRefund(user.driver_profile.id, parseInt(amount));
      return new Response(JSON.stringify({ message: "TBC Service Problem" }), { status: 500 });
    }
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ message: error?.message || t("global.serverError") }), { status: 500 });
  }
}

// ✅ Function to check if the IBAN is from TBC Bank
function isTbcIban(iban: string): boolean {
  return iban.startsWith("GE") && iban.substring(4, 6) === "TB";
}
