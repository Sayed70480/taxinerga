"use client";
import Admin_Axios from "@/admin/Admin_Axios";
import Button from "@/components/forms/Button";
import Input from "@/components/forms/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

interface Data {
  percentage: number;
  minWithdrawAmount: number;
}

const formSchema = yup
  .object({
    percentage: yup.number().required(),
    minWithdrawAmount: yup.number().required(),
  })
  .required();

const EditReferalParamsForm = ({ percentage, minWithdrawAmount }: Data) => {
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Data>({
    resolver: yupResolver(formSchema),
    defaultValues: { minWithdrawAmount, percentage },
  });

  const submit = async (data: Data) => {
    setLoading(true);
    try {
      await Admin_Axios.put("/referal", data);
      toast.success("განახლდა");
    } catch (error: any) {
      toast.error(error.response.data.message || "შეცდომა");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-6" onSubmit={handleSubmit(submit)}>
      <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(180px,220px))] gap-6">
        <Input step={0.01} type="number" label="რეფერალის %" error={errors.percentage?.message} {...register("percentage")} />
        <Input type="number" label="მინ. გასატანი თანხა" error={errors.minWithdrawAmount?.message} {...register("minWithdrawAmount")} />
      </div>
      <Button className="max-w-[200px]" loading={loading}>
        შენახვა
      </Button>
    </form>
  );
};

export default EditReferalParamsForm;
