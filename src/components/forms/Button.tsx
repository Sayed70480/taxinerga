import { useLocale, useTranslations } from "next-intl";
import { ButtonHTMLAttributes, ReactNode } from "react";
import localFont from "next/font/local";

const uppercaseFirago = localFont({ src: "../../assets/FiraGOUPP-Medium.ttf" });

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({ loading, children, className, ...props }) => {
  const locale = useLocale();
  const t = useTranslations("global");
  return (
    <button className={`mt-2 block w-full ${locale === "ka" && uppercaseFirago.className} rounded-lg bg-blue-500 py-2 text-lg text-white ${loading ? "cursor-not-allowed opacity-50" : ""} ${className}`} disabled={loading} {...props}>
      {loading ? t("loading") : children}
    </button>
  );
};

export default Button;
