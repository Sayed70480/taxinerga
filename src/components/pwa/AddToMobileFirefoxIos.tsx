import React from "react";
import { useTranslations } from "next-intl";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { FaTimes, FaBars } from "react-icons/fa";
import { ImArrowDown } from "react-icons/im";
import { FiShare } from "react-icons/fi";
import LangSwitch from "@/components/functional/LangSwitch";
import Button from "../forms/Button";

interface Props {
  closePrompt: () => void;
  doNotShowAgain: () => void;
}

export default function AddToMobileFirefoxIos(props: Props) {
  const { closePrompt, doNotShowAgain } = props;
  const t = useTranslations();
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] h-[100dvh] bg-darkGray px-4 pb-12 text-white">
      <div className="bg-primary relative flex h-full flex-col items-center gap-4 rounded-xl p-4 pt-20 text-center">
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
          <div className="flex w-full items-center justify-between rounded-lg bg-zinc-800 px-8 py-2">
            <p>Share</p>
            <FiShare className="text-2xl" />
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-2 px-4 text-lg">
          <p>{t("pwa.thenClick")}</p>
          <div className="flex w-full items-center justify-between rounded-lg bg-zinc-800 px-8 py-2">
            <p>Add to Home Screen</p>
            <AiOutlinePlusSquare className="text-2xl" />
          </div>
        </div>
        <Button onClick={doNotShowAgain}>{t("pwa.dontShowAgain")}</Button>
        <ImArrowDown className="absolute -bottom-[50px] right-[5px] z-10 animate-bounce text-4xl text-[#FFFFFF]" />
      </div>
    </div>
  );
}
