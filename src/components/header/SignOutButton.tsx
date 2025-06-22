"use client";
import { SignOut } from "@/services/auth/SignOut";
import { useTranslations } from "next-intl";
import { PiSignOutBold } from "react-icons/pi";

const SignOutButton = ({ close }: { close: any }) => {
  const t = useTranslations("routes");
  return (
    <button
      onClick={() => {
        close();
        SignOut();
      }}
      className="flex items-center gap-2 text-xl text-red-600"
    >
      <PiSignOutBold size={32} />
      <p>{t("signOut")}</p>
    </button>
  );
};

export default SignOutButton;
