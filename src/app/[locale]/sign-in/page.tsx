import { SignInForm } from "@/components/forms/SignInForm";
import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Routes from "@/config/Routes";
import { BsFillInfoCircleFill } from "react-icons/bs";
import FormTitle from "@/components/custom_ui/FormTitle";

const SingInPage = () => {
  const t = useTranslations("signIn");
  return (
    <main className="flex flex-col items-center px-4">
      <div className="max-w-[400px] w-full rounded-xl bg-slate-300 p-4">
        <FormTitle>{t("auth")}</FormTitle>
        <p className="text-semibold mt-2 text-center text-sm text-black">{t("description")}</p>
        <SignInForm />
      </div>
      <Link href={Routes.registration.path}>
        <p className="mt-2 text-sm">
          {t("notSignUp")} <span className="cursor-pointer text-blue-500">{t("signUp")}</span>
        </p>
      </Link>
      <div className="mt-4 w-full max-w-[400px] rounded-lg border border-blue-400 bg-blue-400 bg-opacity-30 p-4 text-sm text-black">
        <BsFillInfoCircleFill className="float-left mr-2 mt-1 text-blue-400" />
        {t.raw("info").split('\n').map((line:any, idx:any) => (
        <span key={idx}>
          {line}
          <br />
        </span>
      ))}
      </div>
    </main>
  );
};

export default SingInPage;
