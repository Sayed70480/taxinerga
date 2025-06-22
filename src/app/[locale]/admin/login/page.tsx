"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Input from "@/components/forms/Input";
import Button from "@/components/forms/Button";
import { useLocale } from "next-intl";
import Routes from "@/config/Routes";
import Admin_Axios from "@/admin/Admin_Axios";
import { useAtom } from "jotai";
import { adminAtom } from "@/jotai/adminAtom";

const loginSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const AdminLoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const locale = useLocale();
  const [, setAdmin] = useAtom(adminAtom);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    reValidateMode: "onBlur",
  });

  const onSubmit = async (data: { username: string; password: string }) => {
    try {
      setLoading(true);
      const response = await Admin_Axios.post("/login", data, {
        headers: {
          locale,
        },
      });
      const { token, username, role } = response.data;
      localStorage.setItem("admin_token", token);
      Admin_Axios.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      });
      setAdmin({ username, role });
      toast.success("შეხვედით ადმინში");
      router.push(Routes.admin.subPages?.adminPanel?.path || "");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "შესვლა წარუმატებელია");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100dvh-64px)] w-full items-center justify-center">
      <div className="mx-auto w-full max-w-md rounded-xl bg-gray p-4 shadow-lg">
        <h1 className="mb-4 text-center text-2xl font-bold text-white">ადმინისტრატორი</h1>
        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <Input label="ადმინისტრატორი" {...register("username")} error={errors.username?.message} />
          <Input type="password" label="პაროლი" {...register("password")} error={errors.password?.message} />
          <Button type="submit" loading={loading}>
            შესვლა
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
