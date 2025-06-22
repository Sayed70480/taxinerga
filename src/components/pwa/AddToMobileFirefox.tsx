import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FaTimes } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { ImArrowDownRight } from "react-icons/im";
import ffIcon from "@/assets/firefox-install.png";
import LangSwitch from "@/components/functional/LangSwitch";
import Button from "../forms/Button";

interface Props {
  closePrompt: () => void;
  doNotShowAgain: () => void;
}

export default function AddToMobileFirefox(props: Props) {
  const { closePrompt, doNotShowAgain } = props;
  const t = useTranslations();
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] h-[100dvh] bg-darkGray px-4 pb-12 text-white">
      <div className="bg-primary relative flex h-full flex-col items-center gap-4 rounded-xl p-4 pt-14 text-center">
        <LangSwitch className="!absolute !left-3 !top-14 scale-125" />
        <button className="absolute left-0 top-0 p-3" onClick={closePrompt}>
          <FaTimes size={32} />
        </button>
        <p className="!mt-10 text-lg">{t("pwa.mainText")}</p>
        <div className="flex items-center gap-2 text-lg">
          <p>{t("pwa.click")}</p>
          <HiDotsVertical className="text-4xl" />
          <p>{t("pwa.icon")}</p>
        </div>
        <div className="flex w-full flex-col items-center gap-2 px-4 text-lg">
          <p>{t("pwa.scrollDownAndClick")}</p>
          <div className="flex w-full items-center justify-around rounded-lg bg-zinc-50 px-4 py-2 text-zinc-900">
            <div className="flex items-center gap-6">
              <Image src={ffIcon} alt="Firefox install icon" width={32} height={32} />
              <p>Install</p>
            </div>
          </div>
        </div>
        <Button onClick={doNotShowAgain}>{t("pwa.dontShowAgain")}</Button>
        <ImArrowDownRight className="absolute -bottom-[50px] right-1 z-10 animate-bounce text-4xl text-[#FFFFFF]" />
      </div>
    </div>
  );
}
