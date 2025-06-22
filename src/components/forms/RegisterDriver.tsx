"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocale, useTranslations } from "next-intl";
import axios from "axios";
import Input from "./Input";
import Button from "./Button";
import { toast } from "react-toastify";
import CountrySelect from "./CountrySelect";
import { SignIn } from "@/services/auth/SignIn";
import { Link, useRouter } from "@/i18n/routing";
import Routes from "@/config/Routes";
import InputDate from "./InputDate";
import FormTitle from "../custom_ui/FormTitle";

const RegisterDriver = ({ setDriverId, referal }: { setDriverId: any; referal: string | null }) => {
  const t = useTranslations("registration");
  const router = useRouter();
  const locale = useLocale();
  const [step, setStep] = useState(1);
  const [phoneSent, setPhoneSent] = useState(false);
  const [driverData, setDriverData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const phoneSchema = yup.object({
    phone: yup
      .string()
      .matches(/^\+9955\d{8}$/, t("phoneInvalid"))
      .required(t("phoneRequired")),
    otp: yup.string().when("phone", {
      is: () => phoneSent,
      then: (schema) => schema.length(6, t("otpLength")).required(t("otpRequired")),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const driverSchema = yup.object({
    first_name: yup.string().required(t("firstNameRequired")),
    last_name: yup.string().required(t("lastNameRequired")),
  });

  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/; // dd/MM/yyyy format

  const licenseSchema = yup.object({
    country: yup.string().required(t("countryRequired")),
    expiry_date: yup
      .string()
      .matches(dateRegex, t("invalidDateFormat")) // Ensures format dd/MM/yyyy
      .required(t("expiryDateRequired")),
    issue_date: yup
      .string()
      .matches(dateRegex, t("invalidDateFormat")) // Ensures format dd/MM/yyyy
      .required(t("issueDateRequired")),
    number: yup.string().required(t("licenseNumberRequired")),
  });

  const {
    register: registerPhone,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneErrors },
  } = useForm({ resolver: yupResolver(phoneSchema), defaultValues: { phone: "+995" } });

  const {
    register: registerDriver,
    handleSubmit: handleDriverSubmit,
    formState: { errors: driverErrors },
  } = useForm({ resolver: yupResolver(driverSchema) });

  const {
    register: registerLicense,
    handleSubmit: handleLicenseSubmit,
    formState: { errors: licenseErrors },
    watch: watchLicense,
    setValue: setLicenseValue,
  } = useForm({ resolver: yupResolver(licenseSchema), defaultValues: { country: "geo" } });

  const requestOtp = async (data: any) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/registration/send-otp",
        { phone: data.phone },
        {
          headers: {
            locale,
          },
        },
      );
      setDriverData({ ...driverData, phone: data.phone });
      setPhoneSent(true);
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (data: any) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/registration/verify-otp",
        { phone: driverData.phone, otp: data.otp },
        {
          headers: {
            locale,
          },
        },
      );
      toast.success(response.data.message);
      setStep(2);
    } catch (error: any) {
      if (error.response.data.message === "Driver Exists") {
        await SignIn({ id: error.response.data.phone });
        router.push(Routes.home.path);
      } else {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDriverDetailsSubmission = (data: any) => {
    setDriverData((prev: any) => ({ ...prev, ...data }));
    setStep(3);
  };

  const submitDriverRegistration = async (data: any) => {
    const convertToISODate = (dateString: string): string | null => {
      const dateParts = dateString.split("/");

      if (dateParts.length !== 3) return null; // Ensure valid format

      const [day, month, year] = dateParts;

      if (day.length !== 2 || month.length !== 2 || year.length !== 4) return null; // Ensure correct lengths

      return `${year}-${month}-${day}`; // Convert to ISO format
    };

    setLoading(true);
    setDriverData((prev: any) => ({ ...prev, ...data }));
    const dataToSubmit = { ...driverData, ...data, expiry_date: convertToISODate(data.expiry_date), issue_date: convertToISODate(data.issue_date) };

    if(referal){
      dataToSubmit.referal = referal;
    }

    try {
      const response = await axios.post("/api/registration/create-driver", dataToSubmit, {
        headers: {
          locale,
        },
      });
      const id = response.data.id;
      setDriverId(id);
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto mb-4 w-full max-w-[400px] rounded-lg bg-gray p-6 pt-4">
        {step === 1 && (
          <form onSubmit={handlePhoneSubmit(phoneSent ? verifyOtp : requestOtp)}>
            <FormTitle className="mb-4">{t("registration")}</FormTitle>
            <Input disabled={phoneSent} maxLength={13} label={t("phoneLabel")} {...registerPhone("phone")} error={phoneErrors.phone?.message} />
            {phoneSent && <Input label={t("otpLabel")} {...registerPhone("otp")} error={phoneErrors.otp?.message} />}
            <Button loading={loading} type="submit">
              {phoneSent ? t("verifyOtp") : t("sendOtp")}
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleDriverSubmit(handleDriverDetailsSubmission)}>
            <FormTitle className="mb-4">{t("personalData")}</FormTitle>
            <Input label={t("firstNameLabel")} {...registerDriver("first_name")} error={driverErrors.first_name?.message} />
            <Input label={t("lastNameLabel")} {...registerDriver("last_name")} error={driverErrors.last_name?.message} />
            <Button type="submit">{t("continue")}</Button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleLicenseSubmit(submitDriverRegistration)}>
            <FormTitle className="mb-4">{t("licenseData")}</FormTitle>
            {/* Country Select Handling with react-hook-form */}
            <CountrySelect
              locale={locale}
              label={t("countryLabel")}
              value={watchLicense("country") || "geo"} // Get current value from react-hook-form
              onChange={(value) => setLicenseValue("country", value, { shouldValidate: true })} // Update form value
              error={licenseErrors.country?.message}
            />
            <InputDate placeholder={t("datePlaceholder")} label={t("issueDateLabel")} {...registerLicense("issue_date")} error={licenseErrors.issue_date?.message} />
            <InputDate placeholder={t("datePlaceholder")} label={t("expiryDateLabel")} {...registerLicense("expiry_date")} error={licenseErrors.expiry_date?.message} />

            <Input label={t("licenseNumberLabel")} {...registerLicense("number")} error={licenseErrors.number?.message} />

            <div className="flex w-full flex-col lg:flex-row lg:gap-4">
              <Button type="button" onClick={() => setStep(2)}>
                {t("goBack")}
              </Button>
              <Button loading={loading} type="submit">
                {t("submitDriver")}
              </Button>
            </div>
          </form>
        )}
      </div>
      {step === 1 && (
        <Link className="mx-auto block w-fit" href={Routes.home.path}>
          <p className="mt-2 text-sm">
            {t("haveAnAccount")} <span className="cursor-pointer text-yellow">{t("signIn")}</span>
          </p>
        </Link>
      )}
    </>
  );
};

export default RegisterDriver;
