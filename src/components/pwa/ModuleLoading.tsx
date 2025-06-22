import LangSwitch from "@/components/functional/LangSwitch";
import { useTranslations } from "next-intl";
const ModuleLoading = () => {
  const t = useTranslations();
  return (
    <>
      <LangSwitch className="fixed top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <p className="animate-bounce text-white font-bold fixed w-[100vw] text-center top-1/2 -translate-y-1/2">{t("pwa.detectingBrtowser")}</p>
    </>
  );
};
export default ModuleLoading;
