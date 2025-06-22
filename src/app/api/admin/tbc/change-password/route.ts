import { AdminProtection } from "@/services/auth/AdminProtection";
import connectMongo from "@/services/mongodb/connectMongo";
import TBCPasswordModel from "@/services/mongodb/models/TBCPasswordModel";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const user = AdminProtection(req, ["superadmin"]);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { oldPassword, newPassword, nonce } = await req.json();

    if (!oldPassword || !newPassword || !nonce) {
      return new Response(JSON.stringify({ error: "oldPassword, newPassword, and nonce are required" }), { status: 400 });
    }

    // Ensure TBC_SERVICE URL is set
    if (!process.env.TBC_SERVICE) {
      return new Response(JSON.stringify({ error: "TBC_SERVICE environment variable is not set" }), { status: 500 });
    }

    // Send password change request to TBC Service
    const response = await axios.post(`${process.env.TBC_SERVICE}/tbc-change-password`, { oldPassword, newPassword, nonce, reqPassword: process.env.REQUEST_PASSWORD }, { headers: { "Content-Type": "application/json" } });

    // Update password in MongoDB
    await TBCPasswordModel.findOneAndUpdate(
      {}, // Find any existing document (assuming there's only one)
      { $set: { password: response.data.password } }, // Update password field
      { new: true, upsert: true }, // Return updated doc, create if not exists
    );

    return new Response(JSON.stringify({ message: "პაროლი შეიცვალა" }), { status: 200 });
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
    return new Response(JSON.stringify({ message: error.response?.data?.message || "Server error" }), { status: error.response?.status || 500 });
  }
}
