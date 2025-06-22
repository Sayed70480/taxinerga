import { NextRequest, NextResponse } from "next/server";
import { AdminProtection } from "@/services/auth/AdminProtection";
import connectMongo from "@/services/mongodb/connectMongo";
import AdminModel from "@/services/mongodb/models/AdminModel";
import bcrypt from "bcryptjs";

interface AdminUpdate {
  _id?: string;
  username: string;
  password?: string;
}

export async function PUT(req: NextRequest) {
  try {
    await connectMongo();

    const user = AdminProtection(req, ["superadmin"]);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { admins }: { admins: AdminUpdate[] } = await req.json();

    await Promise.all(
      admins.map(async (admin) => {
        const hashedPassword = admin.password ? await bcrypt.hash(admin.password, 10) : undefined;

        if (admin._id) {
          // 🔹 Update existing admin
          await AdminModel.findOneAndUpdate({ _id: admin._id }, { username: admin.username, ...(hashedPassword && { password: hashedPassword }) }, { new: true });
        } else {
          // 🔹 Create new admin
          await AdminModel.create({
            username: admin.username,
            password: hashedPassword || "default_password", // Ensure password is hashed
          });
        }
      }),
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating admins:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
