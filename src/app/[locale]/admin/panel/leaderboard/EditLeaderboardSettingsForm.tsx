"use client";

import Admin_Axios from "@/admin/Admin_Axios";
import Button from "@/components/forms/Button";
import RichText from "@/components/forms/RichText";
import { useRouter } from "@/i18n/routing";
import { ILeaderboardSettings, LeaderboardStatus } from "@/services/mongodb/models/LeaderboardSettingsModel";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface Props {
  settings: ILeaderboardSettings;
}

const EditLeaderboardSettingsForm = ({  settings }: Props) => {
  const [status, setStatus] = useState<LeaderboardStatus>(settings.status);
  const router = useRouter();
  const [values, setValues] = useState({
    ka: settings.content?.ka || "",
    ru: settings.content?.ru || "",
    tk: settings.content?.tk || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await Admin_Axios.put("/leaderboard/settings", {
        status,
        content: values
      });
      toast.success("განახლდა");
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "დაფიქსირდა შეცდომა");
    }
    setLoading(false);
  };


  return (
    <form className="flex  flex-col gap-6 lg:w-1/2">
      <p>გათამაშების სტატუსი</p>
      <select defaultValue={status} onChange={(e) => setStatus(e.target.value as LeaderboardStatus)} className="mb-5 mt-2 w-full rounded-md bg-[#1E1E2F] p-2 text-white">
        <option value="started">დაწყებული</option>
        <option value="paused">დაპაუზებული</option>
        <option value="finished">დასრულებული</option>
      </select>
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
    </form>
  );
};

export default EditLeaderboardSettingsForm;
