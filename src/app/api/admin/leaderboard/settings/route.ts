// /app/api/leaderboard/settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import LeaderboardSettings from "@/services/mongodb/models/LeaderboardSettingsModel";
import connectMongo from "@/services/mongodb/connectMongo";
import { AdminProtection } from "@/services/auth/AdminProtection";

export async function PUT(req: NextRequest) {
  await connectMongo();

  // Authenticate and authorize the admin
  const user = AdminProtection(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const body = await req.json();

  try {
    const updated = await LeaderboardSettings.findOneAndUpdate({}, { ...body }, { upsert: true, new: true });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating leaderboard settings:", error);
    return NextResponse.json({ message: "Failed to update settings." }, { status: 500 });
  }
}
