import { AdminProtection } from "@/services/auth/AdminProtection";
import connectMongo from "@/services/mongodb/connectMongo";
import ReferalModel from "@/services/mongodb/models/ReferalModel";
import Yandex_GetDriverByPhone from "@/services/yandex/Yandex_GetDriverByPhone";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectMongo();

    const user = AdminProtection(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const invited = await Yandex_GetDriverByPhone(params.id);
    if (!invited) return NextResponse.json({ message: "Invalid invited phone" }, { status: 400 });

    await ReferalModel.findOneAndDelete({ invitedDriverId: invited.driver_profile.id });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting referal:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
