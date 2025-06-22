import { Locale } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import connectMongo from "@/services/mongodb/connectMongo";
import Yandex_GetDriverByPhone from "@/services/yandex/Yandex_GetDriverByPhone";
import OtpModel from "@/services/mongodb/models/OtpModel";
import { headers } from "next/headers";

interface VerifyOtpRequestBody {
  phone: string;
  otp: string;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const headerList = headers();
    const locale = headerList.get("locale") as Locale;
    const t = await getTranslations({ locale });

    const { phone, otp }: VerifyOtpRequestBody = await request.json();
    if (!phone || !otp || !/^(\+9955\d{8})$/.test(phone) || otp.length !== 6) {
      return Response.json({ message: t("registration.invalidOtp") }, { status: 400 });
    }

    await connectMongo();

    const otpRecord = await OtpModel.findOne({ phone, otp });
    if (!otpRecord) {
      return Response.json({ message: t("registration.invalidOtp") }, { status: 400 });
    }

    const driverExists = await Yandex_GetDriverByPhone(phone);
    if (driverExists) {
      return Response.json({ message: "Driver Exists", phone }, { status: 400 });
    }

    await OtpModel.deleteMany({ phone });
    return Response.json({ message: t("registration.otpVerified") });
  } catch (error: any) {
    console.error("Failed to verify OTP", error);
    if (error.message) {
      return Response.json({ message: error?.message }, { status: 400 });
    }
    return Response.json({ message: "Server error, please try again." }, { status: 500 });
  }
}
