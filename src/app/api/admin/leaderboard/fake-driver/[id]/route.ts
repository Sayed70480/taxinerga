import { NextRequest, NextResponse } from "next/server";
import DriverLeaderboardModel from "@/services/mongodb/models/DriverLeaderboardModel";
import connectMongo from "@/services/mongodb/connectMongo";
import { AdminProtection } from "@/services/auth/AdminProtection";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectMongo();

  const user = AdminProtection(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  

  try {
    const { id } = params;

    console.log("Deleting fake driver with ID:", id);

    const driver = await DriverLeaderboardModel.findById(id);

    if (!driver) {
      return NextResponse.json({ message: "Driver not found." }, { status: 404 });
    }

    if (!driver.isFake) {
      return NextResponse.json({ message: "You can only delete fake drivers." }, { status: 400 });
    }

    await DriverLeaderboardModel.findByIdAndDelete(id);

    return NextResponse.json({ message: "Fake driver deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting fake driver:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectMongo();

  const user = AdminProtection(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = params;
    const {paused} = await req.json();

    const driver = await DriverLeaderboardModel.findById(id);

    if (!driver) {
      return NextResponse.json({ message: "Driver not found." }, { status: 404 });
    }

    if (!driver.isFake) {
      return NextResponse.json({ message: "You can only delete fake drivers." }, { status: 400 });
    }

    await DriverLeaderboardModel.findOneAndUpdate({
        _id: id,
        }, {
        paused: paused,
    });

    return NextResponse.json({ message: "Fake driver deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting fake driver:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
