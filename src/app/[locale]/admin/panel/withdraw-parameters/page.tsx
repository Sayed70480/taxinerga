import React from "react";
import connectMongo from "@/services/mongodb/connectMongo";
import EditWithdrawRuleForm from "@/components/admin/forms/EditWithdrawRuleForm";
import ClearWithdrawHistory from "@/components/admin/forms/ClearWithdrawHistory";
import WithdrawStructModel from "@/services/mongodb/models/WithdrawStructModel";

const AdminWithdrawRules = async () => {
  await connectMongo();

  let withdrawStruct = await WithdrawStructModel.findOne();

  if (!withdrawStruct) {
    withdrawStruct = await WithdrawStructModel.create({
      bog_account: "ltd",
      fixed_commission: 0.5,
      firstFreeWithdraw: true,
      notificationPhones: [],
      notificationPhonesTBC: [],
      timeCommissionRules: [
        { from: "00:00", to: "08:00", commission: 0.5 },
        { from: "08:00", to: "11:00", commission: 1 },
        { from: "11:00", to: "20:00", commission: 2 },
        { from: "20:00", to: "00:00", commission: 0.5 },
      ],
    });
  }

  return (
    <div>
      <p className="text-lg font-semibold text-white">გატანის წესების შეცვლა</p>
      <EditWithdrawRuleForm defaultValues={JSON.parse(JSON.stringify(withdrawStruct))} />
      <ClearWithdrawHistory />
    </div>
  );
};

export default AdminWithdrawRules;
