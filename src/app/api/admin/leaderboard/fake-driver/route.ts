// /app/api/leaderboard/fake-driver/route.ts
import { NextRequest, NextResponse } from "next/server";
import DriverLeaderboard from "@/services/mongodb/models/DriverLeaderboardModel";
import { AdminProtection } from "@/services/auth/AdminProtection";
import connectMongo from "@/services/mongodb/connectMongo";

export async function POST(req: NextRequest) {
  await connectMongo();

  // Authenticate and authorize the admin
  const user = AdminProtection(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();

  const { name, surname } = body;

  try {
    const driver = await DriverLeaderboard.create({
      name,
      surname,
      isFake: true,
      phone: null,
    });

    return NextResponse.json(driver, { status: 201 });
  } catch (err) {
    console.error("Error creating fake driver:", err);
    return NextResponse.json({ message: "Failed to create fake driver." }, { status: 500 });
  }
}
