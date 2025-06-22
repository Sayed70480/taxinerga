import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { FaTimes } from "react-icons/fa";
import LangSwitch from "@/components/functional/LangSwitch";
import Button from "../forms/Button";

interface Props {
  closePrompt: () => void;
  doNotShowAgain: () => void;
}

export default function AddToOtherBrowser(props: Props) {
  const { closePrompt, doNotShowAgain } = props;
  const searchUrl = `https://www.google.com/search?q=add+to+home+screen+for+common-mobile-browsers`;
  const t = useTranslations();
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] flex h-[100dvh] flex-col items-center justify-around bg-darkGray px-4 pb-12 text-white">
      <div className="bg-primary relative flex h-full flex-col items-center gap-8 rounded-xl p-4 pt-20 text-center">
        <LangSwitch className="!absolute !left-3 !top-14 scale-125" />
        <button className="absolute left-0 top-0 p-3" onClick={closePrompt}>
          <FaTimes size={32} />
        </button>
        <p style={{ marginTop: "80px" }} className="!mt-10 text-lg">
          {t("pwa.mainText")}
        </p>
        <div className="flex flex-col items-center gap-4 text-lg">
          <p>{t("pwa.cantDetectBrowser")}</p>
          <Link className="text-blue-300" href={searchUrl} target="_blank">
            {t("pwa.tryThisSearch")}
          </Link>
        </div>
        <Button onClick={doNotShowAgain}>{t("pwa.dontShowAgain")}</Button>
      </div>
    </div>
  );
}
