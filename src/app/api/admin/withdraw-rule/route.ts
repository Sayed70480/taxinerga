import { NextRequest, NextResponse } from "next/server";
import WithdrawStructModel from "@/services/mongodb/models/WithdrawStructModel";
import { AdminProtection } from "@/services/auth/AdminProtection";
import connectMongo from "@/services/mongodb/connectMongo";

export async function PUT(req: NextRequest) {
  try {
    await connectMongo();

    const user = AdminProtection(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { bog_account, fixed_commission, firstFreeWithdraw, notificationPhones, notificationPhonesTBC, timeCommissionRules } = await req.json();

    if (
      !["ltd", "individualEntrepreneur"].includes(bog_account) ||
      typeof fixed_commission !== "number" ||
      fixed_commission < 0 ||
      typeof firstFreeWithdraw !== "boolean" ||
      !Array.isArray(notificationPhones) ||
      !Array.isArray(notificationPhonesTBC) ||
      notificationPhones.some((phone) => !/^\+9955\d{8}$/.test(phone)) ||
      notificationPhonesTBC.some((phone) => !/^\+9955\d{8}$/.test(phone)) ||
      !Array.isArray(timeCommissionRules) ||
      timeCommissionRules.some((rule) => typeof rule.from !== "string" || typeof rule.to !== "string" || typeof rule.commission !== "number" || rule.commission < 0)
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const updatedRule = await WithdrawStructModel.findOneAndUpdate(
      {},
      {
        $set: {
          bog_account,
          fixed_commission,
          firstFreeWithdraw,
          notificationPhones,
          notificationPhonesTBC,
          timeCommissionRules,
        },
      },
      { new: true, upsert: true },
    );

    return NextResponse.json({ success: true, data: updatedRule }, { status: 200 });
  } catch (error) {
    console.error("Error updating withdraw struct:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
