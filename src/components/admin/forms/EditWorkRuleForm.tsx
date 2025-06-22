"use client";
import * as yup from "yup";
import { I_RegistrationRule } from "@/services/mongodb/models/RegistrationRuleModel";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { YandexWorkRule } from "@/services/yandex/Yandex_GetWorkRules";
import SelectAdvanced from "@/components/forms/SelectAdvanced";
import Button from "@/components/forms/Button";
import { useState } from "react";
import MultiInput from "@/components/forms/MultiInput";
import Admin_Axios from "@/admin/Admin_Axios";
import { toast } from "react-toastify";

interface Props {
  defaultValues: I_RegistrationRule;
  yandexWorkRules: YandexWorkRule[];
}

interface Body_UpdateRegistrationRule {
  work_rule_id: string;
  notificationPhones: string[];
}

const EditRegistrationRuleForm = ({ defaultValues, yandexWorkRules }: Props) => {
  const workRuleOptions = yandexWorkRules.filter((rule) => rule.is_enabled).map((rule) => ({ label: rule.name, value: rule.id }));

  const formSchema = yup.object({
    work_rule_id: yup.string().required("სავალდებულოა"),
    notificationPhones: yup
      .array()
      .required()
      .of(
        yup
          .string()
          .required("სავალდებულოა")
          .matches(/^\+9955\d{8}$/, "ფორმატი: +9955xxxxxxxx"),
      ),
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Body_UpdateRegistrationRule>({
    resolver: yupResolver(formSchema),
    defaultValues,
    reValidateMode: "onBlur",
  });

  const [loading, setLoading] = useState(false);

  const finishUpdate = async (data: Body_UpdateRegistrationRule) => {
    setLoading(true);
    try {
      await Admin_Axios.put("/registration-rule", data);
      toast.success("წარმატებით განახლდა");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-6" onSubmit={handleSubmit(finishUpdate)}>
      <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(180px,220px))] gap-6">
        <SelectAdvanced label="საკომისიო წესი" options={workRuleOptions} error={errors.work_rule_id?.message} value={watch("work_rule_id")} onChange={(val) => setValue("work_rule_id", val)} />
        <MultiInput label="ადმინის SMS შტყობინება" onChange={(val) => setValue("notificationPhones", val)} values={watch("notificationPhones")} errors={errors.notificationPhones} />
      </div>
      <Button className="max-w-[200px]" loading={loading}>შენახვა</Button>
    </form>
  );
};

export default EditRegistrationRuleForm;
