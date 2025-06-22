import { Locale } from "@/i18n/routing";
import { UserProtection } from "@/services/auth/UserProtection";
import connectMongo from "@/services/mongodb/connectMongo";
import { Ubill_SendSMS } from "@/services/ubill/Ubill_SendSMS";
import BOG_CreateDocument from "@/services/bog/BOG_CreateDocument";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import IE_BOG_CreateDocument from "@/services/bog/ie/IE_BOG_CreateDocument";
import ReferalBalanceModel from "@/services/mongodb/models/ReferalBalanceModel";
import ReferalParametersModel from "@/services/mongodb/models/ReferalParametersModel";
import ReferalWithdrawModel from "@/services/mongodb/models/ReferalWithdrawModel";
import WithdrawStructModel from "@/services/mongodb/models/WithdrawStructModel";

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
    const referalParams = await ReferalParametersModel.findOne();

    if (!referalParams) {
      return new Response(JSON.stringify({ message: t("withdraw.withdrawRuleNotFound") }), { status: 400 });
    }

    const { amount, bank, iban } = await req.json();

    if (amount < referalParams.minWithdrawAmount) {
      return new Response(JSON.stringify({ message: t("withdraw.minWithdrawAmount").replace("^", referalParams.minWithdrawAmount.toString()) }), { status: 400 });
    }

    if (!isBogIban(iban)) {
      return new Response(JSON.stringify({ message: t("withdraw.notBOG") }), { status: 400 });
    }

    // ✅ 1. Check balance first
    const balance = await ReferalBalanceModel.findOne({ driverId: user.driver_profile.id });

    if (!balance || balance.amount < amount) {
      return new Response(JSON.stringify({ message: t("withdraw.insufficientBalance") }), { status: 400 });
    }

    if (withdrawStruct.bog_account === "ltd") {
      // ✅ 2. Create BOG Document
      const { documentNumber, uniqueKey, uniqueId } = await BOG_CreateDocument({
        amount: amount,
        iban,
        firstName: user.driver_profile.first_name,
        lastName: user.driver_profile.last_name,
      });

      // ✅ 4. Store Withdrawal in MongoDB
      await new ReferalWithdrawModel({
        amount,
        bank,
        iban,
        documentNumber,
        bank_account: "ltd",
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
          text: `მძღოლმა: ${user.driver_profile.first_name} ${user.driver_profile.last_name}, გამოაგზავნა რეფერალური ბონუსის გატანის მოთხოვნა შ.პ.ს ნერგა-ს საქ. ბანკში. რაოდენობა: ${amount} ₾.`,
        });
      }
    } else {
      const { documentNumber, uniqueKey, uniqueId } = await IE_BOG_CreateDocument({
        amount,
        iban,
        firstName: user.driver_profile.first_name,
        lastName: user.driver_profile.last_name,
      });

      // ✅ 4. Store Withdrawal in MongoDB
      await new ReferalWithdrawModel({
        amount,
        bank,
        iban,
        documentNumber,
        bank_account: "ie",
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
          text: `მძღოლმა: ${user.driver_profile.first_name} ${user.driver_profile.last_name}, გამოაგზავნა რეფერალური ბონუსის გატანის მოთხოვნა ი/მ გიორგი ასაბაშვილის-ს საქ. ბანკში. რაოდენობა: ${amount} ₾. `,
        });
      }
    }

    balance.amount -= Number(amount.toFixed(2));
    await balance.save();

    return new Response(JSON.stringify({ message: t("withdraw.success") }), { status: 200 });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ message: error?.message || t("global.serverError") }), { status: 500 });
  }
}
