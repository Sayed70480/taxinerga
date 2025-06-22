"use client";
import Admin_Axios from "@/admin/Admin_Axios";
import FormTitle from "@/components/custom_ui/FormTitle";
import Button from "@/components/forms/Button";
import Input from "@/components/forms/Input";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ManualReferal = () => {
  const [inviterPhone, setInviterPhone] = useState("+995");
  const [invitedPhone, setInvitedPhone] = useState("+995");
  const [delInvitedPhone, setDelInvitedPhone] = useState("+995");

  const [loading, setLoading] = useState(false);

  const handleAttach = async () => {
    setLoading(true);
    try {
      await Admin_Axios.post("/referal", {
        inviterPhone,
        invitedPhone,
      });
      toast.success("წარმატებით დაემატა");
      setInviterPhone("+995");
      setInvitedPhone("+995");
      setLoading(false);
    } catch (error: any) {
      toast.error(error.response.data.message || "შეცდომა");
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      await Admin_Axios.delete("/referal/" + delInvitedPhone);
      toast.success("წარმატებით წაიშალა");
      setDelInvitedPhone("+995");
      setLoading(false);
    } catch (error: any) {
      toast.error(error.response.data.message || "შეცდომა");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-6 max-w-[400px]">
        <FormTitle className="mb-3">რეფერალის მიბმა</FormTitle>
        <Input
          value={inviterPhone}
          onChange={(e) => {
            setInviterPhone(e.target.value);
          }}
          label="რეფერალის მფლობელის ნომერი"
        />
        <Input
          value={invitedPhone}
          onChange={(e) => {
            setInvitedPhone(e.target.value);
          }}
          label="მოწვეული მძღოლის ნომერი"
        />
        <Button loading={loading} onClick={handleAttach}>
          მიმაგრება
        </Button>
      </div>

      <div className="mt-6 max-w-[400px]">
        <FormTitle className="mb-3">რეფერალის წაშლა</FormTitle>

        <Input
          value={delInvitedPhone}
          onChange={(e) => {
            setDelInvitedPhone(e.target.value);
          }}
          label="მოწვეული მძღოლის ნომერი"
        />
        <Button loading={loading} onClick={handleRemove}>
          წაშლა
        </Button>
      </div>
    </>
  );
};

export default ManualReferal;
