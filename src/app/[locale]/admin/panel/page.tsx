import connectMongo from "@/services/mongodb/connectMongo";
import ReferalBalanceModel from "@/services/mongodb/models/ReferalBalanceModel";
import ReferalWithdrawModel from "@/services/mongodb/models/ReferalWithdrawModel";
import WithdrawModel from "@/services/mongodb/models/WithdrawModel";
import updateWithdrawals from "@/updateWithdrawals";
import React from "react";

const AdminPanelHome = async () => {
  await connectMongo();
  await updateWithdrawals();

  const withdraws = await WithdrawModel.find();
  const pendingWithDraws = withdraws.filter((withdraw) => withdraw.status === "pending").length;
  const refW = await ReferalWithdrawModel.find({ status: "pending" });
  const commissions = await getCommissions();
  const sumReferalBalance = await ReferalBalanceModel.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);
  const totalBalance = sumReferalBalance[0]?.totalAmount || 0;

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,300px))] gap-6">
        <>
          <div className="flex h-[140px] flex-col justify-between rounded-lg border-[4px] border-yellow bg-darkGray p-4 text-white">
            <h1 className="text-lg">წინა თვის საკომისიოები</h1>
            <p className="text-2xl font-bold">{commissions.prevMonthCommission} ₾</p>
          </div>
          <div className="flex h-[140px] flex-col justify-between rounded-lg border-[4px] border-yellow bg-darkGray p-4 text-white">
            <h1 className="text-lg">ამ თვის საკომისიოები</h1>
            <p className="text-2xl font-bold">{commissions.thisMonthCommission} ₾</p>
          </div>
          <Box data={pendingWithDraws + refW.length} title="განაღდებები მოლოდინში" />
          <Box data={totalBalance.toFixed(2)+ " ₾"} title="რეფერალური ბალანსი" />
        </>
    </div>
  );
};

function Box({ data, title }: { data: any; title: any }) {
  return (
    <div className="flex h-[140px] flex-col justify-between rounded-lg bg-darkGray p-4 text-white">
      <h1 className="text-lg">{title}</h1>
      <p className="text-2xl font-bold">{data}</p>
    </div>
  );
}

async function getCommissions() {
  const now = new Date();

  // Get first day of this month (UTC)
  const startOfThisMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));

  // Get first day of previous month (UTC)
  const startOfPrevMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1, 0, 0, 0));

  // Query MongoDB for successful commissions only
  const [thisMonthCommission, prevMonthCommission] = await Promise.all([
    WithdrawModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfThisMonth }, // This month
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          totalCommission: { $sum: "$commission" },
        },
      },
    ]),
    WithdrawModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfPrevMonth, $lt: startOfThisMonth }, // Last month
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          totalCommission: { $sum: "$commission" },
        },
      },
    ]),
  ]);

  return {
    thisMonthCommission: thisMonthCommission.length > 0 ? thisMonthCommission[0].totalCommission : 0,
    prevMonthCommission: prevMonthCommission.length > 0 ? prevMonthCommission[0].totalCommission : 0,
  };
}

export default AdminPanelHome;
