import { Locale } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import connectMongo from "@/services/mongodb/connectMongo";
import { Ubill_SendSMS } from "@/services/ubill/Ubill_SendSMS";
import OtpModel from "@/services/mongodb/models/OtpModel";
import { headers } from "next/headers";

interface OtpRequestBody {
  phone: string;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const headerList = headers();
      const locale = headerList.get("locale") as Locale;
      const t = await getTranslations({ locale });

    const { phone }: OtpRequestBody = await request.json();
    if (!isValidGeorgianPhone(phone)) {
      return Response.json({ message: t("registration.phoneInvalid") }, { status: 400 });
    }

    await connectMongo();

    // ✅ Generate and store OTP
    const otp = Math.floor(100000 + Math.random() * 900000)
      .toString()
      .padStart(6, "0");
    await OtpModel.create({ phone, otp });

    // ✅ Send OTP via SMS
    const smsSuccess = await Ubill_SendSMS({
      numbers: [phone],
      text: `${t("registration.otpMessage")}: ${otp}`,
    });

    if (!smsSuccess) {
      return Response.json({ message: t("registration.otpError") }, { status: 500 });
    }

    return Response.json({ message: t("registration.otpSent") });
  } catch (error:any) {
    console.error("❌ Error in OTP request:", error);
    if (error.message) {
      return Response.json({ message: error?.message }, { status: 400 });
    }
    return Response.json({ message: "Server error, please try again." }, { status: 500 });
  }
}

function isValidGeorgianPhone(phone: string): boolean {
  return /^\+9955\d{8}$/.test(phone);
}


