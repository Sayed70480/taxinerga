import React from "react";
import { FaTimes, FaBars } from "react-icons/fa";
import { ImArrowDown } from "react-icons/im";
import { TfiPlus } from "react-icons/tfi";
import { useTranslations } from "next-intl";
import LangSwitch from "@/components/functional/LangSwitch";
import Button from "../forms/Button";

interface Props {
  closePrompt: () => void;
  doNotShowAgain: () => void;
}

export default function AddToSamsung(props: Props) {
  const { closePrompt, doNotShowAgain } = props;
  const t = useTranslations();
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] h-[100dvh] bg-darkGray px-4 pb-12 text-white">
      <div className="bg-primary relative flex h-full flex-col items-center gap-8 rounded-xl p-4 pt-20  text-center">
        <LangSwitch className="!absolute !left-3 !top-14 scale-125" />
        <button className="absolute left-0 top-0 p-3" onClick={closePrompt}>
          <FaTimes size={32} />
        </button>
        <p style={{ marginTop: "80px" }} className="!mt-10 text-lg">
          {t("pwa.mainText")}
        </p>
        <div className="flex items-center gap-2 text-lg">
          <p>{t("pwa.click")}</p>
          <FaBars className="text-4xl" />
          <p>{t("pwa.icon")}</p>
        </div>
        <div className="flex w-full flex-col items-center gap-2 px-4 text-lg">
          <p>{t("pwa.scrollDownAndClick")}</p>
          <div className="flex flex-col items-center gap-2 rounded-lg bg-white p-4 text-zinc-800">
            <TfiPlus className="text-2xl" />
            <p>Add page to</p>
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-2 px-4 text-lg">
          <p>{t("pwa.thenClick")}</p>
          <div className="flex flex-col items-center gap-2 rounded-lg bg-white px-4 py-2 text-zinc-800">
            <p>Home screen</p>
          </div>
        </div>
        <Button onClick={doNotShowAgain}>{t("pwa.dontShowAgain")}</Button>
        <ImArrowDown className="absolute -bottom-[50px] right-[-3px] z-10 animate-bounce text-4xl text-[#FFFFFF]" />
      </div>
    </div>
  );
}
