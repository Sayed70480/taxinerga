'use client'
import Button from "@/components/forms/Button";
import { useTranslations } from "next-intl";
import { useState } from "react";

const Copy = ({ content }: { content: string }) => {
  const t = useTranslations("global")
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div onClick={copyToClipboard}>
      {/* <p className="w-fit mb-2 cursor-pointer select-text rounded-md bg-darkGray p-2 text-sm text-yellow">{content}</p> */}
      <Button>{t("copy")} {copied && "✔"}</Button>
    </div>
  );
};

export default Copy;
