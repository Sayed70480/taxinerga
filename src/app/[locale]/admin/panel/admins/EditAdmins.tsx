"use client";

import { I_Admin } from "@/services/mongodb/models/AdminModel";
import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Admin_Axios from "@/admin/Admin_Axios";
import { toast } from "react-toastify";
import { useState } from "react";
import Button from "@/components/forms/Button";
import Input from "@/components/forms/Input";

interface Props {
  admins: I_Admin[];
}


const schema = yup.object({
  admins: yup
    .array()
    .of(
      yup.object().shape({
        _id: yup.string().notRequired(),
        username: yup.string().required("Username is required"),
        password: yup.string().notRequired(),
      }),
    )
    .required(),
});

const EditAdmins = ({ admins }: Props) => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      admins: admins.map((admin) => ({
        _id: admin._id as string,
        username: admin.username,
        password: "",
      })),
    },
    reValidateMode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({ control, name: "admins" });
  const [loading, setLoading] = useState(false);
  const finishUpdate = async (data: any) => {
    setLoading(true);
    try {
      await Admin_Axios.put("/admins", { admins: data.admins });
      toast.success("Admins updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteAdmin = async (id: string | null, index: number) => {
    if (id) {
      try {
        await Admin_Axios.delete(`/admins/${id}`);
        toast.success("Admin deleted successfully");
        remove(index);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Delete failed");
      } finally {
        setLoading(false);
      }
    } else {
      remove(index);
    }
  };

  return (
    <form className="mt-6" onSubmit={handleSubmit(finishUpdate)}>
      <div className="flex flex-wrap gap-6">
        {fields.map((admin, index) => (
          <div key={admin.id} className="w-80 rounded-lg border p-4">
            <h3 className="font-semibold">ადმინი {index + 1}</h3>
            <Input label="Username" {...register(`admins.${index}.username`)} error={errors.admins?.[index]?.username?.message} />
            <Input label="New Password" type="password" {...register(`admins.${index}.password`)} error={errors.admins?.[index]?.password?.message} />
            <Button type="button" className="mt-2 bg-red-500" onClick={() => deleteAdmin(admin._id || null, index)}>
              წაშლა
            </Button>
          </div>
        ))}
      </div>
      <div>
        <Button type="button" className="mt-4 max-w-[300px] bg-green-500" onClick={() => append({ username: "", password: "" })}>
          დამატება
        </Button>
        <Button loading={loading} className="mt-4 max-w-[300px]">
          ცვლილებების შენახვა
        </Button>
      </div>
    </form>
  );
};

export default EditAdmins;
