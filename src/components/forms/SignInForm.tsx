"use client";
import { useRouter } from "@/i18n/routing";
import { SignIn } from "@/services/auth/SignIn";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useLocale, useTranslations } from "use-intl";
import Input from "./Input";
import Button from "./Button";
import Routes from "@/config/Routes";

export function SignInForm() {
  const locale = useLocale();
  const t = useTranslations("signIn");
  const router = useRouter();

  const [phone, setPhone] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [getOtpLoading, setGetOtpLoading] = useState<boolean>(false);
  const [signInLoading, setSignInLoading] = useState<boolean>(false);

  // ✅ Handle sending OTP
  const handleSendOtp = async () => {
    setGetOtpLoading(true);
    setPhoneError(null);

    if (!phone.match(/^\d{9}$/)) {
      setPhoneError(t("phoneInvalid"));
      setGetOtpLoading(false);
      return;
    }

    try {
      await axios.post(
        "/api/otp",
        { phone: `+995${phone}` },
        {
          headers: {
            locale,
          },
        }
      );
      setOtpSent(true);
      toast.success(t("otpSent"), { autoClose: 1000 });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t("otpError"));
    } finally {
      setGetOtpLoading(false);
    }
  };

  // ✅ Handle signing in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInLoading(true);
    setOtpError(null);

    if (!otp.match(/^\d{6}$/)) {
      setOtpError(t("otpInvalid"));
      setSignInLoading(false);
      return;
    }

    try {
      await SignIn({ phone: `+995${phone}`, otp });
      toast.success(t("signInSuccess"));
      router.push(Routes.home.path);
    } catch (error: any) {
      toast.error(error.message.split(".")[0]);
    } finally {
      setSignInLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="mt-8">
      {/* ✅ Phone Input */}
      <Input
        label={t("phone")}
        required
        placeholder={t("phone")}
        type="text"
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value);
          setOtp("");
          setOtpSent(false);
        }}
        name="phone"
        maxLength={9}
        prefix="+995"
        error={phoneError}
      />

      {/* ✅ Send OTP Button */}
      {!otpSent ? (
        <Button type="button" onClick={handleSendOtp} loading={getOtpLoading}>
          {t("sendOtp")}
        </Button>
      ) : (
        <>
          {/* ✅ OTP Input */}
          <Input label={t("otp")} required placeholder={t("otp")} type="text" value={otp} onChange={(e) => setOtp(e.target.value)} name="otp" maxLength={6} error={otpError} />

          {/* ✅ Sign In Button */}
          <Button type="submit" loading={signInLoading}>
            {t("signIn")}
          </Button>
        </>
      )}
    </form>
  );
}
