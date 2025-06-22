"use client";
import Admin_Axios from "@/admin/Admin_Axios";
import Button from "@/components/forms/Button";
import React, { useState } from "react";
import { toast } from "react-toastify";
import RichText from "@/components/forms/RichText";
import Input from "@/components/forms/Input";

const EditCarRent = ({ defaultValue, defaultChecked }: { defaultValue?: { ka: string; ru: string; tk: string }; defaultChecked: boolean }) => {
  const [values, setValues] = useState({
    ka: defaultValue?.ka || "",
    ru: defaultValue?.ru || "",
    tk: defaultValue?.tk || "",
  });
  const [checked, setChecked] = useState(defaultChecked);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await Admin_Axios.put("/car-rent", {
        content: {
          ka: values.ka.toString(),
          ru: values.ru.toString(),
          tk: values.tk.toString(),
        },
        visible: checked,
      });
      toast.success("შენახულია");
    } catch {
      toast.error("ვერ შეინახა");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex max-w-[500px] flex-col items-start gap-5">
      <Input className="ml-6 mt-8 scale-[3]" defaultChecked={checked} onChange={(e) => setChecked(e.target.checked)} type="checkbox" label="ჩართული" />
      <div>
        <h3 className="mb-2 text-white">ქართული</h3>
        <RichText value={values.ka} setValue={(newValue: any) => setValues((prev) => ({ ...prev, ka: newValue }))} />
      </div>

      <div>
        <h3 className="mb-2 text-white">რუსული</h3>
        <RichText value={values.ru} setValue={(newValue: any) => setValues((prev) => ({ ...prev, ru: newValue }))} />
      </div>

      <div>
        <h3 className="mb-2 text-white">თურქმენული</h3>
        <RichText value={values.tk} setValue={(newValue: any) => setValues((prev) => ({ ...prev, tk: newValue }))} />
      </div>

      <Button className="mx-0 mt-5" loading={loading} onClick={handleSubmit}>
        შენახვა
      </Button>
    </div>
  );
};

export default EditCarRent;
