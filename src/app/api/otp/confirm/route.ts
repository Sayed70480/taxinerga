import OtpModel from "@/services/mongodb/models/OtpModel";
import { Locale } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import connectMongo from "@/services/mongodb/connectMongo";
import Yandex_GetDriverByPhone from "@/services/yandex/Yandex_GetDriverByPhone";
import { headers } from "next/headers";

interface OtpConfirmBody {
  phone: string;
  otp: string;
}

export async function POST(request: Request): Promise<Response> {
  const headerList = headers();
    const locale = headerList.get("locale") as Locale;
    const t = await getTranslations({ locale });

  try {
    // ✅ Get locale and translations
    const { phone, otp }: OtpConfirmBody = await request.json();

    await connectMongo();

    // ✅ Find OTP entry by both phone and OTP
    const otpEntry = await OtpModel.findOne({ phone, otp });

    if (!otpEntry) {
      return Response.json(
        { message: t("signIn.otpInvalid") }, // Handles both invalid and expired OTPs
        { status: 401 }
      );
    }

    const driver = await Yandex_GetDriverByPhone(otpEntry.phone);
    if (!driver) {
      return Response.json(
        { message: t("signIn.otpInvalid") }, // Handles both invalid and expired OTPs
        { status: 401 }
      );
    }
    // ✅ Delete OTP after successful authentication
    await OtpModel.deleteMany({ phone });
    return Response.json({ success: true, driver });
  } catch (error: any) {
    if (error.message) {
      return Response.json({ message: error?.message }, { status: 400 });
    }
    console.error("Error handling OTP confirmation:", error);
    return Response.json({ message: t("global.serverError") }, { status: 500 });
  }
}
