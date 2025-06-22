"use client";
import Admin_Axios from "@/admin/Admin_Axios";
import Button from "@/components/forms/Button";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ClearWithdrawHistory = () => {
  const [loading, setLoading] = useState(false);
  const [clicks, setClick] = useState(0);

  const handleClick = async () => {
    if (clicks === 0) {
      setClick(1);
    } else {
      setLoading(true);
      try {
        await Admin_Axios.delete("/withdraw-history");
        toast.success("ისტორია წაიშალა");
      } catch {
        toast.error("ისტორია ვერ წაიშალა");
      } finally {
        setLoading(false);
        setClick(0);
      }
    }
  };

  return (
    <div className="mt-10 max-w-[320px]">
      <Button loading={loading} onClick={handleClick} className="!bg-red-600 !text-white">
        {clicks === 0 ? "გატანის ისტორიის გასუფთავება" : "დარწმუნებული ხარ?"}
      </Button>
    </div>
  );
};

export default ClearWithdrawHistory;
