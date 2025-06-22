import { Locale } from "@/i18n/routing";
import { UserProtection } from "@/services/auth/UserProtection";
import connectMongo from "@/services/mongodb/connectMongo";
import WithdrawModel from "@/services/mongodb/models/WithdrawModel";
import { Ubill_SendSMS } from "@/services/ubill/Ubill_SendSMS";
import Yandex_DriverWithdraw from "@/services/yandex/Yandex_DriverWithdraw";
import Yandex_GetDriverBalance from "@/services/yandex/Yandex_GetDriverBalance";
import BOG_CreateDocument from "@/services/bog/BOG_CreateDocument";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import BOG_DeleteDocument from "@/services/bog/BOG_DeleteDocument";
import IE_BOG_CreateDocument from "@/services/bog/ie/IE_BOG_CreateDocument";
import IE_BOG_DeleteDocument from "@/services/bog/ie/IE_BOG_DeleteDocument";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import WithdrawStructModel from "@/services/mongodb/models/WithdrawStructModel";
import { calculateCommission } from "../../admin/helper_functions/calculateCommission";

// Enable timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export interface WithdrawReques {
  amount: number;
  bank: "bog";
  iban: string;
}

// Function to check if the IBAN is from Bank of Georgia
function isBogIban(iban: string): boolean {
  return iban.startsWith("GE") && iban.substring(4, 6) === "BG";
}

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

    const { amount, bank, iban, balanceState } = await req.json();

    if (amount < 5) {
      return new Response(JSON.stringify({ message: t("withdraw.minAmount") }), { status: 400 });
    }

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

    if (!isBogIban(iban)) {
      return new Response(JSON.stringify({ message: t("withdraw.notBOG") }), { status: 400 });
    }

    // ✅ 1. Check balance first
    const balance = await Yandex_GetDriverBalance(user.driver_profile.phones[0]);

    if (!balance || balance < amount || balanceState < amount) {
      return new Response(JSON.stringify({ message: t("withdraw.insufficientBalance") }), { status: 400 });
    }

    if (!withdrawStruct) {
      return new Response(JSON.stringify({ message: t("withdraw.withdrawRuleNotFound") }), { status: 400 });
    }

    if (withdrawStruct.bog_account === "ltd") {
      // ✅ 2. Create BOG Document
      const { documentNumber, uniqueKey, uniqueId } = await BOG_CreateDocument({
        amount: commissionApply ? amount - commissionAmount : amount,
        iban,
        firstName: user.driver_profile.first_name,
        lastName: user.driver_profile.last_name,
      });

      // ✅ 3. Deduct balance before withdrawal request
      const deducted = await Yandex_DriverWithdraw(user.driver_profile.id, parseInt(amount));
      if (!deducted) {
        await WithdrawModel.deleteOne({ documentNumber });
        await BOG_DeleteDocument(uniqueKey);
        return new Response(JSON.stringify({ message: t("withdraw.mistake") }), { status: 400 });
      }

      // ✅ 4. Store Withdrawal in MongoDB
      await new WithdrawModel({
        amount,
        bank,
        iban,
        documentNumber,
        bank_account: "ltd",
        commission: commissionApply ? commissionAmount : 0,
        uniqueKey,
        uniqueId,
        driverId: user.driver_profile.id,
        phone: user.driver_profile.phones[0],
        firstName: user.driver_profile.first_name,
        lastName: user.driver_profile.last_name,
      }).save();

      if (withdrawStruct.notificationPhones && withdrawStruct.notificationPhones.length > 0) {
        await Ubill_SendSMS({
          numbers: withdrawStruct.notificationPhones,
          text: `მძღოლმა: ${user.driver_profile.first_name} ${user.driver_profile.last_name}, გამოაგზავნა გატანის მოთხოვნა შ.პ.ს ნერგა-ს საქ. ბანკში. რაოდენობა: ${amount} ₾. ${commissionApply ? "საკომისიო: " + commissionAmount + " ₾" : ""}`,
        });
      }
    } else {
      const { documentNumber, uniqueKey, uniqueId } = await IE_BOG_CreateDocument({
        amount: commissionApply ? amount - commissionAmount : amount,
        iban,
        firstName: user.driver_profile.first_name,
        lastName: user.driver_profile.last_name,
      });

      // ✅ 3. Deduct balance before withdrawal request
      const deducted = await Yandex_DriverWithdraw(user.driver_profile.id, parseInt(amount));
      if (!deducted) {
        await WithdrawModel.deleteOne({ documentNumber });
        await IE_BOG_DeleteDocument(uniqueKey);
        return new Response(JSON.stringify({ message: t("withdraw.mistake") }), { status: 400 });
      }

      // ✅ 4. Store Withdrawal in MongoDB
      await new WithdrawModel({
        amount,
        bank,
        iban,
        documentNumber,
        bank_account: "ie",
        commission: commissionApply ? commissionAmount : 0,
        uniqueKey,
        uniqueId,
        driverId: user.driver_profile.id,
        phone: user.driver_profile.phones[0],
        firstName: user.driver_profile.first_name,
        lastName: user.driver_profile.last_name,
      }).save();

      if (withdrawStruct.notificationPhones && withdrawStruct.notificationPhones.length > 0) {
        await Ubill_SendSMS({
          numbers: withdrawStruct.notificationPhones,
          text: `მძღოლმა: ${user.driver_profile.first_name} ${user.driver_profile.last_name}, გამოაგზავნა გატანის მოთხოვნა ი/მ გიორგი ასაბაშვილის-ს საქ. ბანკში. რაოდენობა: ${amount} ₾. ${commissionApply ? "საკომისიო: " + commissionAmount + " ₾" : ""}`,
        });
      }
    }

    return new Response(JSON.stringify({ message: t("withdraw.success") }), { status: 200 });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ message: error?.message || t("global.serverError") }), { status: 500 });
  }
}
