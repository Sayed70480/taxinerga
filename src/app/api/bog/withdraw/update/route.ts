export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import connectMongo from "@/services/mongodb/connectMongo";
import WithdrawModel, { I_Withdraw } from "@/services/mongodb/models/WithdrawModel";
import BOG_CheckDocumentStatus from "@/services/bog/BOG_CheckDocumentStatus";
import IE_BOG_CheckDocumentStatus from "@/services/bog/ie/IE_BOG_CheckDocumentStatus";
import Yandex_DriverRefund from "@/services/yandex/Yandex_DriverRefund";
import ReferalBalanceModel from "@/services/mongodb/models/ReferalBalanceModel";
import ReferalModel from "@/services/mongodb/models/ReferalModel";
import ReferalParametersModel from "@/services/mongodb/models/ReferalParametersModel";
import LeaderboardSettingsModel, { ILeaderboardSettings } from "@/services/mongodb/models/LeaderboardSettingsModel";
import DriverLeaderboardModel, { IDriverLeaderboard } from "@/services/mongodb/models/DriverLeaderboardModel";

async function processWithdrawals(withdrawals: I_Withdraw[], checkStatusFunction: any) {
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
        await Yandex_DriverRefund(withdraw.driverId, withdraw.amount);
      }

      if (newStatus === "completed") {
        try {
          await connectMongo();
          const hasReferer = await ReferalModel.findOne({ invitedDriverId: withdraw.driverId });
          if (hasReferer) {
            let refererBalance = await ReferalBalanceModel.findOne({ driverId: hasReferer.inviterDriverId });
            if (!refererBalance) {
              await ReferalBalanceModel.create({ driverId: hasReferer.inviterDriverId, amount: 0 });
              refererBalance = await ReferalBalanceModel.findOne({ driverId: hasReferer.inviterDriverId });
            }
            if (refererBalance) {
              const referalParams = await ReferalParametersModel.findOne({});
              const percentage = referalParams?.percentage || 0;
              const rawAmount = withdraw.commission ? withdraw.amount - withdraw.commission : withdraw.amount;
              refererBalance.amount += Number((rawAmount * (percentage / 100)).toFixed(2));
              await refererBalance.save();
            }
          }
        } catch (error) {
          console.error(error);
        }
        try {
          await connectMongo();
          const settings = await LeaderboardSettingsModel.findOne<ILeaderboardSettings>();
          
          if (settings && settings.status === "started") {
            await DriverLeaderboardModel.findOneAndUpdate<IDriverLeaderboard>(
              { phone: withdraw.phone },
              { $inc: { currentPoints: withdraw.amount } },
              { new: true }, 
            );
          }
        } catch (error) {
          console.error(error);
        }
      }

      await WithdrawModel.updateOne({ uniqueKey: status.UniqueKey }, { status: newStatus });
    }
  }
}

export async function GET() {
  await connectMongo();
  try {
    const pendingWithdrawalsLTD = await WithdrawModel.find({ status: "pending", bank: "bog", bank_account: "ltd" });
    if (pendingWithdrawalsLTD.length > 0) {
      await processWithdrawals(pendingWithdrawalsLTD, BOG_CheckDocumentStatus);
    }

    const pendingWithdrawalsIE = await WithdrawModel.find({ status: "pending", bank: "bog", bank_account: "ie" });
    if (pendingWithdrawalsIE.length > 0) {
      await processWithdrawals(pendingWithdrawalsIE, IE_BOG_CheckDocumentStatus);
    }

    return NextResponse.json({ message: "Withdraw statuses updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating withdraw statuses:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
