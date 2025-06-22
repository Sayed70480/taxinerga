import { AdminProtection } from "@/services/auth/AdminProtection";
import connectMongo from "@/services/mongodb/connectMongo";
import WithdrawModel from "@/services/mongodb/models/WithdrawModel";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    await connectMongo();

    const user = AdminProtection(req, ["superadmin"]);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await WithdrawModel.deleteMany({});

    return new Response(JSON.stringify({ message: "გატანის ისტორია გასუფთავდა" }), { status: 200 });
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
    return new Response(JSON.stringify({ message: error.response?.data?.message || "Server error" }), { status: error.response?.status || 500 });
  }
}
