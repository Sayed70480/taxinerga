"use client";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SelectAdvanced from "@/components/forms/SelectAdvanced";
import Button from "@/components/forms/Button";
import { useState } from "react";
import Admin_Axios from "@/admin/Admin_Axios";
import { toast } from "react-toastify";
import Input from "@/components/forms/Input";
import MultiInput from "@/components/forms/MultiInput";
import { I_WithdrawStruct } from "@/services/mongodb/models/WithdrawStructModel";

interface Props {
  defaultValues: I_WithdrawStruct;
}

interface Body_UpdateWithdrawRule {
  bog_account: "ltd" | "individualEntrepreneur";
  fixed_commission: number;
  notificationPhones: string[];
  notificationPhonesTBC: string[];
  firstFreeWithdraw: boolean;
  timeCommissionRules: {
    from: string; // HH:mm
    to: string;
    commission: number;
  }[];
}

const EditWithdrawRuleForm = ({ defaultValues }: Props) => {
  const accountOptions = [
    { label: "შ.პ.ს ნერგა", value: "ltd" },
    { label: "ი/მ გიორგი ასაბაშვილი", value: "individualEntrepreneur" },
  ];

  const formSchema = yup.object({
    bog_account: yup.string().oneOf(["ltd", "individualEntrepreneur"]).required("Required"),
    fixed_commission: yup.number().required("Required").min(0, "Must be 0 or higher"),
    firstFreeWithdraw: yup.boolean().required("Required"),
    notificationPhones: yup
      .array()
      .required()
      .of(
        yup
          .string()
          .required()
          .matches(/^\+9955\d{8}$/, "ფორმატი: +9955xxxxxxxx"),
      ),
    notificationPhonesTBC: yup
      .array()
      .required()
      .of(
        yup
          .string()
          .required()
          .matches(/^\+9955\d{8}$/, "ფორმატი: +9955xxxxxxxx"),
      ),
    timeCommissionRules: yup
      .array()
      .of(
        yup.object({
          from: yup.string().required("Required"),
          to: yup.string().required("Required"),
          commission: yup.number().required("Required").min(0),
        }),
      )
      .required(),
  });

  const tbcPassChange = yup.object({
    oldPassword: yup.string().required("Required"),
    newPassword: yup
      .string()
      .required("Required")
      .min(8, "მინ. 8 სიმბოლო")
      .matches(/[A-Z]/, "ერთი დიდი ასო მაინც")
      .matches(/[a-z]/, "ერთი პატარა ასო მაინც")
      .matches(/\d/, "ერთი ციფრი მაინც")
      .matches(/[^A-Za-z0-9]/, "ერთი სიმბოლო ( ასოს და ციფრისგან განსხვავებული )")
      .notOneOf(["&", "<"], "პაროლი არ უნდა შეიცავდეს '&' ან '<'")
      .notOneOf([yup.ref("oldPassword")], "ახალი პაროლი არ უნდა ემთხვეოდეს ძველს"),
    nonce: yup.string().required("Required").length(9, "9 სიმბოლო"),
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Body_UpdateWithdrawRule>({
    resolver: yupResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    handleSubmit: handleSubmitPassChange,
    formState: { errors: errorsPassChange },
    watch: watchPassChange,
    setValue: setValuePassChange,
  } = useForm({
    resolver: yupResolver(tbcPassChange),
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);

  const finishUpdate = async (data: Body_UpdateWithdrawRule) => {
    setLoading(true);
    try {
      await Admin_Axios.put("/withdraw-rule", data);
      toast.success("განახლდა");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "შეცდომა");
    } finally {
      setLoading(false);
    }
  };

  const handlePassChange = async (data: any) => {
    setLoading(true);

    try {
      await Admin_Axios.post("/tbc/change-password", data);
      toast.success("განახლდა");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "შეცდომა");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="mt-6" onSubmit={handleSubmit(finishUpdate)}>
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(180px,250px))] gap-6">
          <SelectAdvanced label="საქ. ბანკის ანგარიში" options={accountOptions} error={errors.bog_account?.message} value={watch("bog_account")} onChange={(val) => setValue("bog_account", val)} />
          <Input className="mt-4 scale-[2]" error={errors.firstFreeWithdraw?.message} checked={watch("firstFreeWithdraw")} type="checkbox" label="პირველი გატანა უფასოდ" onChange={(e) => setValue("firstFreeWithdraw", e.target.checked)} />
          <Input label="ფიქსირებული საკომისიო (₾)" type="number" error={errors.fixed_commission?.message} value={watch("fixed_commission")} onChange={(e) => setValue("fixed_commission", parseFloat(e.target.value))} />
          <MultiInput label="ადმინის SMS შტყობინება BOG" onChange={(val) => setValue("notificationPhones", val)} values={watch("notificationPhones")} errors={errors.notificationPhones} />
          <MultiInput label="ადმინის SMS შტყობინება TBC" onChange={(val) => setValue("notificationPhonesTBC", val)} values={watch("notificationPhonesTBC")} errors={errors.notificationPhonesTBC} />
          <div className="col-span-full">
            <h2 className="mb-2 text-lg font-semibold">საკომისიო დროების მიხედვით</h2>
            {watch("timeCommissionRules").map((rule, index) => (
              <div key={index} className="mb-4 flex items-center gap-4">
                <Input
                  label="დან (HH:mm)"
                  value={rule.from}
                  onChange={(e) => {
                    const updated = [...watch("timeCommissionRules")];
                    updated[index].from = e.target.value;
                    setValue("timeCommissionRules", updated);
                  }}
                  error={errors.timeCommissionRules?.[index]?.from?.message}
                />
                <Input
                  label="მდე (HH:mm)"
                  value={rule.to}
                  onChange={(e) => {
                    const updated = [...watch("timeCommissionRules")];
                    updated[index].to = e.target.value;
                    setValue("timeCommissionRules", updated);
                  }}
                  error={errors.timeCommissionRules?.[index]?.to?.message}
                />
                <Input
                  label="კომისია"
                  type="number"
                  value={rule.commission}
                  onChange={(e) => {
                    const updated = [...watch("timeCommissionRules")];
                    updated[index].commission = parseFloat(e.target.value);
                    setValue("timeCommissionRules", updated);
                  }}
                  error={errors.timeCommissionRules?.[index]?.commission?.message}
                />
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => {
                    const updated = [...watch("timeCommissionRules")];
                    updated.splice(index, 1);
                    setValue("timeCommissionRules", updated);
                  }}
                >
                  წაშლა
                </button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => {
                const updated = [...watch("timeCommissionRules")];
                updated.push({ from: "", to: "", commission: 0 });
                setValue("timeCommissionRules", updated);
              }}
              className="mt-2 max-w-[400px]"
            >
              + დამატება
            </Button>
          </div>
        </div>
        <Button className="max-w-[200px]" loading={loading}>
          შენახვა
        </Button>
      </form>
      <h1 className="mt-10 text-2xl">TBC პაროლის განახლება</h1>
      <form className="mt-6" onSubmit={handleSubmitPassChange(handlePassChange)}>
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(180px,250px))] gap-6">
          <Input label="ძველი პაროლი" type="text" error={errorsPassChange.oldPassword?.message} value={watchPassChange("oldPassword")} onChange={(e) => setValuePassChange("oldPassword", e.target.value)} />
          <Input label="ახალი პაროლი" type="text" error={errorsPassChange.newPassword?.message} value={watchPassChange("newPassword")} onChange={(e) => setValuePassChange("newPassword", e.target.value)} />
          <Input label="დიჯიპასის 9 ნიშნა კოდი" type="text" error={errorsPassChange.nonce?.message} value={watchPassChange("nonce")} onChange={(e) => setValuePassChange("nonce", e.target.value)} />
        </div>
        <Button className="max-w-[200px]" loading={loading}>
          განახლება
        </Button>
      </form>
    </>
  );
};

export default EditWithdrawRuleForm;
