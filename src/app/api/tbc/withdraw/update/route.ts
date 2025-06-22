export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import connectMongo from "@/services/mongodb/connectMongo";
import WithdrawModel, { I_Withdraw } from "@/services/mongodb/models/WithdrawModel";
import Yandex_DriverRefund from "@/services/yandex/Yandex_DriverRefund";
import axios from "axios";
import TBCPasswordModel from "@/services/mongodb/models/TBCPasswordModel";
import ReferalBalanceModel from "@/services/mongodb/models/ReferalBalanceModel";
import ReferalModel from "@/services/mongodb/models/ReferalModel";
import ReferalParametersModel from "@/services/mongodb/models/ReferalParametersModel";
import LeaderboardSettingsModel, { ILeaderboardSettings } from "@/services/mongodb/models/LeaderboardSettingsModel";
import DriverLeaderboardModel, { IDriverLeaderboard } from "@/services/mongodb/models/DriverLeaderboardModel";

async function processTbcWithdrawals(withdrawals: I_Withdraw[], tbcPassword: string) {
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
            await DriverLeaderboardModel.findOneAndUpdate<IDriverLeaderboard>({ phone: withdraw.phone }, { $inc: { currentPoints: withdraw.amount } }, { new: true });
          }
        } catch (error) {
          console.error(error);
        }
      }

      await WithdrawModel.updateOne({ uniqueKey: status.singlePaymentId }, { status: newStatus });
    }
  }
}

export async function GET() {
  await connectMongo();
  try {
    const pendingWithdrawals = await WithdrawModel.find({ status: "pending", bank: "tbc" });
    if (pendingWithdrawals.length > 0) {
      const tbcPassword = await TBCPasswordModel.findOne({});
      if (tbcPassword) {
        await processTbcWithdrawals(pendingWithdrawals, tbcPassword.password);
      }
    }

    return NextResponse.json({ message: "TBC Withdraw statuses updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating TBC withdraw statuses:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
