import { Locale } from "@/i18n/routing";
import { UserProtection } from "@/services/auth/UserProtection";
import connectMongo from "@/services/mongodb/connectMongo";
import { Ubill_SendSMS } from "@/services/ubill/Ubill_SendSMS";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import ReferalBalanceModel from "@/services/mongodb/models/ReferalBalanceModel";
import ReferalParametersModel from "@/services/mongodb/models/ReferalParametersModel";
import ReferalWithdrawModel from "@/services/mongodb/models/ReferalWithdrawModel";
import TBCPasswordModel from "@/services/mongodb/models/TBCPasswordModel";
import axios from "axios";
import WithdrawStructModel from "@/services/mongodb/models/WithdrawStructModel";

export interface WithdrawReques {
  amount: number;
  bank: "tbc";
  iban: string;
}

// Function to check if the IBAN is from Bank of Georgia
function isTbcIban(iban: string): boolean {
  return iban.startsWith("GE") && iban.substring(4, 6) === "TB";
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

    const referalParams = await ReferalParametersModel.findOne();

    if (!referalParams) {
      return new Response(JSON.stringify({ message: t("withdraw.withdrawRuleNotFound") }), { status: 400 });
    }

    const { amount, iban } = await req.json();

    if (amount < referalParams.minWithdrawAmount) {
      return new Response(JSON.stringify({ message: t("withdraw.minWithdrawAmount").replace("^", referalParams.minWithdrawAmount.toString()) }), { status: 400 });
    }

    if (!isTbcIban(iban)) {
      return new Response(JSON.stringify({ message: t("withdraw.notTBC") }), { status: 400 });
    }

    // ✅ 1. Check balance first
    const balance = await ReferalBalanceModel.findOne({ driverId: user.driver_profile.id });

    if (!balance || balance.amount < amount) {
      return new Response(JSON.stringify({ message: t("withdraw.insufficientBalance") }), { status: 400 });
    }

    const tbcPassword = await TBCPasswordModel.findOne({});

    const response = await axios.post(process.env.TBC_SERVICE + "/tbc-payment", {
      amount: amount,
      iban,
      firstName: user.driver_profile.first_name,
      lastName: user.driver_profile.last_name,
      reqPassword: process.env.REQUEST_PASSWORD,
      tbcPassword: tbcPassword?.password,
    });

    const paymentId = response.data.transactionId;

    // ✅ Store in MongoDB
    await new ReferalWithdrawModel({
      amount,
      bank: "tbc",
      iban,
      documentNumber: paymentId,
      uniqueKey: paymentId,
      uniqueId: paymentId,
      bank_account: "ltd",
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
        text: `მძღოლმა: ${user.driver_profile.first_name} ${user.driver_profile.last_name}, გამოაგზავნა რეფერალური ბონუსის გატანის მოთხოვნა TBC ბანკში. რაოდენობა: ${amount} ₾. `,
      });
    }

    balance.amount -= Number(amount.toFixed(2));
    await balance.save();

    return new Response(JSON.stringify({ message: t("withdraw.success") }), { status: 200 });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ message: error?.message || t("global.serverError") }), { status: 500 });
  }
}
