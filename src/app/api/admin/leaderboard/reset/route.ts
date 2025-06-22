// /app/api/leaderboard/fake-driver/route.ts
import { NextRequest, NextResponse } from "next/server";
import DriverLeaderboardModel from "@/services/mongodb/models/DriverLeaderboardModel";
import { AdminProtection } from "@/services/auth/AdminProtection";
import connectMongo from "@/services/mongodb/connectMongo";
import Yandex_TotalDrivers from "@/services/yandex/Yandex_TotalDrivers";

export async function GET(req: NextRequest) {
  await connectMongo();

  // Authenticate and authorize the admin
  const user = AdminProtection(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await DriverLeaderboardModel.deleteMany();
    const allDrivers = await Yandex_TotalDrivers();
    // go throught all drivers and create a driver leaderboard for each one
    if (!allDrivers) {
      return NextResponse.json({ message: "Error. Contact Developer" }, { status: 404 });
    }

    for (const driver of allDrivers.drivers) {
      const points = Number(driver.accounts[0].balance) > 0 ? -Math.abs(Number(driver.accounts[0].balance)) : 0;
      const newDriver = new DriverLeaderboardModel({
        name: driver.driver_profile.first_name,
        surname: driver.driver_profile.last_name,
        phone: driver.driver_profile.phones[0],
        isFake: false,
        currentPoints: points,
      });
      await newDriver.save();
    }

    return NextResponse.json(true, { status: 201 });
  } catch (err) {
    console.error("Error creating fake driver:", err);
    return NextResponse.json({ message: "Failed to create fake driver." }, { status: 500 });
  }
}
