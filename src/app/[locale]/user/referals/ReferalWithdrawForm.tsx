"use client";
import { useState } from "react";
import { useTranslations } from "use-intl";
import { toast } from "react-toastify";
import axios from "axios";
import { useLocale } from "next-intl";
import BOG from "@/assets/bog.svg";
import TBC from "@/assets/tbc.svg";
import Image from "next/image";
import FormTitle from "@/components/custom_ui/FormTitle";
import SelectAdvanced from "@/components/forms/SelectAdvanced";
import Input from "@/components/forms/Input";
import Button from "@/components/forms/Button";
import { useRouter } from "@/i18n/routing";

interface Props {
  ibanP: string;
  bankP: "bog" | "tbc";
}

function ReferalWithdrawForm({ ibanP, bankP }: Props) {
  const t = useTranslations("withdraw");
  const locale = useLocale();
  const router = useRouter();

  const bankOptions = [
    { value: "bog", label: t("bog"), icon: BOG },
    { value: "tbc", label: t("tbc"), icon: TBC },
  ];

  const [iban, setIban] = useState<string>(ibanP);
  const [bank, setBank] = useState<"bog" | "tbc">(bankP);
  const [amount, setAmount] = useState<string>("");

  const [ibanError, setIbanError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIbanError(null);
    setAmountError(null);

    if (!iban.match(/^GE\d{2}[A-Z0-9]{16,28}$/)) {
      setIbanError(t("ibanInvalid"));
      setLoading(false);
      return;
    }

    if (!/^[1-9]\d*$/.test(amount)) {
      setAmountError(t("amountInvalid"));
      setLoading(false);
      return;
    }

    if (bank === "bog") {
      try {
        // ✅ Simulate API request
        await axios.post(
          "/api/bog/referal-withdraw",
          { amount: parseInt(amount), bank, iban },
          {
            headers: {
              locale,
            },
          },
        );
        toast.success(t("withdrawSuccess"));
        router.refresh();
      } catch (error: any) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    } else if (bank === "tbc") {
      try {
        // ✅ Simulate API request
        await axios.post(
          "/api/tbc/referal-withdraw",
          { amount: parseInt(amount), bank, iban },
          {
            headers: {
              locale,
            },
          },
        );
        toast.success(t("withdrawSuccess"));
        router.refresh();
      } catch (error: any) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleWithdraw} className="w-full bg-gray p-4 rounded-md mx-auto lg:w-[400px]">
      <FormTitle>{t("withdrawTitle")}</FormTitle>

      <SelectAdvanced
        options={bankOptions}
        value={bankOptions.find((option) => option.value === bank)?.value}
        onChange={(selectedOption) => setBank(selectedOption)}
        formatOptionLabel={(option) => (
          <div className="flex items-center">
            <Image width={option.value === "bog" ? 39 : 24} height={option.value === "bog" ? 24 : 24} src={option.icon.src} alt={option.label} className="mr-2 h-6 w-6" />
            {option.label}
          </div>
        )}
        label={t("bank")}
      />

      {/* ✅ IBAN Input */}
      <Input label={t("iban")} required placeholder={bank === "bog" ? "GE00BG0000000000000000" : "GE00TB0000000000000000"} type="text" value={iban} onChange={(e) => setIban(e.target.value)} name="iban" error={ibanError} />

      {/* ✅ Amount Input */}
      <Input
        label={t("amount")}
        required
        placeholder={"0"}
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} // Allow only numbers
        name="amount"
        error={amountError}
      />

      {/* ✅ Submit Button */}
      <Button type="submit" loading={loading}>
        {t("withdraw")}
      </Button>
    </form>
  );
}

export default ReferalWithdrawForm;
