import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectMongo from "@/services/mongodb/connectMongo";
import SuperAdminModel from "@/services/mongodb/models/SuperAdminModel";
import AdminModel from "@/services/mongodb/models/AdminModel";
import { signToken } from "@/services/jwt/jwt";
import { Role } from "@/services/auth/AdminProtection";

export async function POST(req: Request) {
  await connectMongo();

  try {
    const { username, password } = await req.json();

    // Check if user is SuperAdmin
    let user = await SuperAdminModel.findOne({ username });
    let role: Role = "superadmin";

    // If not found, check Admin collection
    if (!user) {
      user = await AdminModel.findOne({ username });
      role = "admin";
    }

    // If no user found
    if (!user) {
      return NextResponse.json({ error: "ექაუნთი არ არსებობს" }, { status: 401 });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "პაროლი არასწორია" }, { status: 401 });
    }

    // Generate JWT Token
    const token = signToken({ id: user._id, username: user.username, role });

    return NextResponse.json({ token, username: user.username, role }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
