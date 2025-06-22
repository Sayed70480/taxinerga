export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import connectMongo from "@/services/mongodb/connectMongo";
import axios from "axios";
import TBCPasswordModel from "@/services/mongodb/models/TBCPasswordModel";
import ReferalWithdrawModel, { I_ReferalWithdraw } from "@/services/mongodb/models/ReferalWithdrawModel";
import ReferalBalanceModel from "@/services/mongodb/models/ReferalBalanceModel";

async function processTbcWithdrawals(withdrawals: I_ReferalWithdraw[], tbcPassword:string) {
  const batchSize = 10;
  for (let i = 0; i < withdrawals.length; i += batchSize) {
    const batch = withdrawals.slice(i, i + batchSize);
    const uniqueKeys = batch.map((withdraw) => withdraw.uniqueKey);

    const statuses = await Promise.all(
      uniqueKeys.map(async (singlePaymentId) => {
        try {
          const response = await axios.post(process.env.TBC_SERVICE + "/tbc-payment-status", { singlePaymentId, reqPassword: process.env.REQUEST_PASSWORD, tbcPassword });
          return { singlePaymentId, ...response.data };
        } catch (error: any) {
          console.error(`Failed to fetch status for ${singlePaymentId}:`, error.message);
          return { singlePaymentId, status: "ERROR" };
        }
      }),
    );

    for (const status of statuses) {
      const withdraw = batch.find((w) => w.uniqueKey === status.singlePaymentId);
      if (!withdraw) continue;

      let newStatus = "pending";
      switch (status.status) {
        case "C":
        case "FL":
        case "D":
        case "R":
          newStatus = "rejected";
          break;
        case "F":
          newStatus = "completed";
          break;
        default:
          newStatus = "pending";
      }

      if (newStatus === "rejected") {
        const balance = await ReferalBalanceModel.findOne({ driverId: withdraw.driverId });
        if (balance) {
          balance.amount += Number(withdraw.amount.toFixed(2));
          await balance.save();
        }
      }

      await ReferalWithdrawModel.updateOne({ uniqueKey: status.singlePaymentId }, { status: newStatus });
    }
  }
}

export async function GET() {
  await connectMongo();
  try {
    const pendingWithdrawals = await ReferalWithdrawModel.find({ status: "pending", bank: "tbc" });
    if (pendingWithdrawals.length > 0) {
      const tbcPassword = await TBCPasswordModel.findOne({});
      if(tbcPassword){
        await processTbcWithdrawals(pendingWithdrawals, tbcPassword.password);
      }
      
    }

    return NextResponse.json({ message: "TBC Withdraw statuses updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating TBC withdraw statuses:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
