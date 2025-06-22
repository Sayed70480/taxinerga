export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import connectMongo from "@/services/mongodb/connectMongo";
import BOG_CheckDocumentStatus from "@/services/bog/BOG_CheckDocumentStatus";
import IE_BOG_CheckDocumentStatus from "@/services/bog/ie/IE_BOG_CheckDocumentStatus";
import ReferalWithdrawModel, { I_ReferalWithdraw } from "@/services/mongodb/models/ReferalWithdrawModel";
import ReferalBalanceModel from "@/services/mongodb/models/ReferalBalanceModel";

async function processWithdrawals(withdrawals: I_ReferalWithdraw[], checkStatusFunction: any) {
  const batchSize = 10;
  for (let i = 0; i < withdrawals.length; i += batchSize) {
    const batch = withdrawals.slice(i, i + batchSize);
    const uniqueKeys = batch.map((withdraw) => Number(withdraw.uniqueKey));
    const statuses = await checkStatusFunction(uniqueKeys);
    if (!statuses) {
      return NextResponse.json({ message: "Failed to fetch document statuses from BOG" }, { status: 500 });
    }

    for (const status of statuses) {
      const withdraw = batch.find((w) => w.uniqueKey === status.UniqueKey.toString());
      if (!withdraw) continue;

      let newStatus = "pending";
      switch (status.Status) {
        case "C":
        case "D":
        case "R":
          newStatus = "rejected";
          break;
        case "P":
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

      await ReferalWithdrawModel.updateOne({ uniqueKey: status.UniqueKey }, { status: newStatus });
    }
  }
}

export async function GET() {
  await connectMongo();
  try {
    const pendingWithdrawalsLTD = await ReferalWithdrawModel.find({ status: "pending", bank: "bog", bank_account: "ltd" });
    if (pendingWithdrawalsLTD.length > 0) {
      await processWithdrawals(pendingWithdrawalsLTD, BOG_CheckDocumentStatus);
    }

    const pendingWithdrawalsIE = await ReferalWithdrawModel.find({ status: "pending", bank: "bog", bank_account: "ie" });
    if (pendingWithdrawalsIE.length > 0) {
      await processWithdrawals(pendingWithdrawalsIE, IE_BOG_CheckDocumentStatus);
    }

    return NextResponse.json({ message: "Withdraw statuses updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating withdraw statuses:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
