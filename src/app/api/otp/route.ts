import { Locale } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import connectMongo from "@/services/mongodb/connectMongo";
import Yandex_GetDriverByPhone from "@/services/yandex/Yandex_GetDriverByPhone";
import { Ubill_SendSMS } from "@/services/ubill/Ubill_SendSMS";
import OtpModel from "@/services/mongodb/models/OtpModel";
import { headers } from "next/headers";
interface OtpRequestBody {
  phone: string;
}

export async function POST(request: Request): Promise<Response> {
  // ✅ Get locale and translations
  const headerList = headers();
  const locale = headerList.get("locale") as Locale;
  const t = await getTranslations({ locale });

  try {
    const { phone }: OtpRequestBody = await request.json();
    if (!phone || !/^\+9955\d{8}$/.test(phone)) {
      return Response.json({ message: t("signIn.phoneInvalid") }, { status: 400 });
    }

    // ✅ Connect to MongoDB
    await connectMongo();

    // ✅ Fetch from Yandex if driver is not in local DB
    const yandexDriver = await Yandex_GetDriverByPhone(phone);

    if (!yandexDriver) {
      return Response.json({ message: t("signIn.driverNotFound") }, { status: 404 });
    }

    // ✅ Generate random 4-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000)
      .toString()
      .padStart(6, "0");

    await OtpModel.create({ phone, otp });

    // ✅ Send OTP via SMS
    const smsResponse = await Ubill_SendSMS({
      numbers: [`${phone}`],
      text: `${t("signIn.otpMessage")}: ${otp}`,
    });

    if (!smsResponse) {
      return Response.json({ message: t("signIn.otpError") }, { status: 400 });
    }

    return Response.json({ message: t("signIn.otpSent") });
  } catch (error: any) {
    if (error.message) {
      return Response.json({ message: error?.message }, { status: 400 });
    }
    console.error("Error handling OTP request:", error);
    return Response.json({ message: t("global.serverError") }, { status: 500 });
  }
}
