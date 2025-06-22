import React from "react";

import { FaTimes } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { MdAddToHomeScreen } from "react-icons/md";
import { ImArrowUp } from "react-icons/im";
import { useTranslations } from "next-intl";
import LangSwitch from "@/components/functional/LangSwitch";
import Button from "../forms/Button";

interface Props {
  closePrompt: () => void;
  doNotShowAgain: () => void;
}

export default function AddToMobileChrome(props: Props) {
  const { closePrompt, doNotShowAgain } = props;
  const t = useTranslations();
  return (
    <div className="fixed left-0 right-0 top-0 z-[999] h-[80%] bg-darkGray px-4  text-white">
      <ImArrowUp className="absolute right-[10px] top-[10px] z-10 animate-bounce text-4xl text-[#FFFFFF]" />
      <div className="bg-primary relative flex h-full flex-col items-center gap-8 rounded-xl p-4 pt-20 text-center">
        <LangSwitch className="!absolute !left-3 !top-14 scale-125" />
        <button className="absolute left-0 top-0 p-3" onClick={closePrompt}>
          <FaTimes size={32} />
        </button>
        <p style={{ marginTop: "80px" }} className="!mt-10 text-lg">
          {t("pwa.mainText")}
        </p>
        <div className="flex items-center gap-2 text-lg">
          <p>{t("pwa.click")}</p>
          <HiDotsVertical className="text-4xl" />
          <p>{t("pwa.icon")}</p>
        </div>
        <div className="flex w-full flex-col items-center gap-2 px-4 text-lg">
          <p>{t("pwa.scrollDownAndClick")}</p>
          <div className="flex w-full items-center justify-between rounded-lg bg-zinc-50 px-4 py-2 text-zinc-900">
            <MdAddToHomeScreen className="text-2xl" />
            <p>Add to Home Screen</p>
          </div>
        </div>
        <Button onClick={doNotShowAgain}>{t("pwa.dontShowAgain")}</Button>
      </div>
    </div>
  );
}
