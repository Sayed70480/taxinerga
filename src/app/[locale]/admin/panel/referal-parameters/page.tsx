import connectMongo from "@/services/mongodb/connectMongo";
import ReferalParametersModel from "@/services/mongodb/models/ReferalParametersModel";
import React from "react";
import EditReferalParamsForm from "./EditReferalParamsForm";
import ManualReferal from "./ManualReferal";
import ReferalsTable from "./ReferalsTable";

const AdminReferal = async () => {
  await connectMongo();
  let referalParams = await ReferalParametersModel.findOne({});
  if (!referalParams) {
    const newReferalParameters = {
      percentage: 1,
      minWithdrawAmount: 10,
    };
    await ReferalParametersModel.create(newReferalParameters);
    referalParams = await ReferalParametersModel.findOne({});
  }
  if (!referalParams) {
    return <div>CONTACT DEVELOPER</div>;
  }
 
  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <EditReferalParamsForm percentage={referalParams.percentage} minWithdrawAmount={referalParams.minWithdrawAmount} />
        <ManualReferal />
      </div>
      <div>
        <ReferalsTable />
      </div>
    </div>
  );
};

export default AdminReferal;
