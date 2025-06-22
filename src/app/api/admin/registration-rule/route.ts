import { NextRequest, NextResponse } from "next/server";
import RegistrationRuleModel from "@/services/mongodb/models/RegistrationRuleModel";
import { AdminProtection } from "@/services/auth/AdminProtection";
import connectMongo from "@/services/mongodb/connectMongo";

export async function PUT(req: NextRequest) {
  try {
    // Ensure database connection
    await connectMongo();

    // Authenticate and authorize the admin
    const user = AdminProtection(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Parse the request body
    const { work_rule_id, notificationPhones } = await req.json();

    // Validate input
    if (!work_rule_id || !Array.isArray(notificationPhones) || notificationPhones.some((phone) => !/^\+9955\d{8}$/.test(phone))) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Update the only existing registration rule
    const updatedRule = await RegistrationRuleModel.findOneAndUpdate(
      {}, // Update the single existing entry
      { work_rule_id, notificationPhones },
      { new: true, upsert: true }, // Create if it doesn't exist
    );

    return NextResponse.json({ success: true, data: updatedRule }, { status: 200 });
  } catch (error) {
    console.error("Error updating registration rule:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
