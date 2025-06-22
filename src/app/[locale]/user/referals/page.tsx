import { auth } from "@/auth";
import connectMongo from "@/services/mongodb/connectMongo";
import ReferalBalanceModel from "@/services/mongodb/models/ReferalBalanceModel";
import ReferalModel, { IReferal } from "@/services/mongodb/models/ReferalModel";
import React from "react";
import Referals from "./Referals";
import ReferalParametersModel from "@/services/mongodb/models/ReferalParametersModel";
import { raw } from "../../layout";
import ReferalWithdrawModel from "@/services/mongodb/models/ReferalWithdrawModel";
import WithdrawModel from "@/services/mongodb/models/WithdrawModel";

const UserReferals = async () => {
  await connectMongo();
  const session = await auth();
  if (!session || !session.user) {
    return null;
  }
  const inviterDriverId = session.user.driver_profile.id;
  const referals = await ReferalModel.find<IReferal>({ inviterDriverId });
  let balance = await ReferalBalanceModel.findOne({ driverId: inviterDriverId });
  const referalParams = await ReferalParametersModel.findOne();
  if (!balance) {
    balance = await ReferalBalanceModel.create({ driverId: inviterDriverId, balance: 0 });
  }
  if (!referalParams) {
    return null;
  }
  let bankP: "bog" | "tbc" = "bog";
  let ibanP = "";
  const referalWithdrawn = await ReferalWithdrawModel.findOne({ driverId: inviterDriverId })
    .sort({
      createdAt: -1,
    })
    .limit(1);
  if (referalWithdrawn) {
    ibanP = referalWithdrawn.iban;
    bankP = referalWithdrawn.bank;
  } else {
    const withdrawn = await WithdrawModel.findOne({ driverId: inviterDriverId })
      .sort({
        createdAt: -1,
      })
      .limit(1);
    if (withdrawn) {
      ibanP = withdrawn.iban;
      bankP = withdrawn.bank;
    }
  }
  return <Referals ibanP={ibanP} bankP={bankP} baseUrl={process.env.AUTH_URL || "Error "} referalParams={raw(referalParams)} balance={balance.amount} referals={raw(referals)} driverId={inviterDriverId} />;
};

export default UserReferals;
