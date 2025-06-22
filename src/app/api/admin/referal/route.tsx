import { NextRequest, NextResponse } from "next/server";
import { AdminProtection } from "@/services/auth/AdminProtection";
import connectMongo from "@/services/mongodb/connectMongo";
import ReferalParametersModel from "@/services/mongodb/models/ReferalParametersModel";
import Yandex_GetDriverByPhone from "@/services/yandex/Yandex_GetDriverByPhone";
import ReferalModel from "@/services/mongodb/models/ReferalModel";
import ReferalBalanceModel from "@/services/mongodb/models/ReferalBalanceModel";

export interface ReferalResponseItem {
  inviter: {
    firstName: string;
    lastName: string;
    phone: string;
    driverId: string;
    balance: number;
  };
  referals: {
    firstName: string;
    lastName: string;
    phone: string;
  }[];
}

export interface ReferalListResponse {
  data: ReferalResponseItem[];
  total: number;
  page: number;
  totalPages: number;
}

export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    const user = AdminProtection(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const search = (searchParams.get("search") || "").trim().toLowerCase();

    const limit = 10;
    const skip = (page - 1) * limit;

    let filter = {};

    if (search) {
      const regex = new RegExp(search, "i");

      filter = {
        $or: [{ inviterPhone: regex }, { invitedPhone: regex }, { $expr: { $regexMatch: { input: { $concat: ["$firstName", " ", "$lastName"] }, regex } } }, { $expr: { $regexMatch: { input: { $concat: ["$inviterFirstName", " ", "$inviterLastName"] }, regex } } }],
      };
    }

    const allReferals = await ReferalModel.find(filter).sort({ createdAt: -1 });

    // Group by inviter
    const inviterMap = new Map<
      string,
      {
        inviter: {
          firstName: string;
          lastName: string;
          phone: string;
          driverId: string;
          balance: number;
        };
        referals: {
          firstName: string;
          lastName: string;
          phone: string;
        }[];
      }
    >();

    for (const ref of allReferals) {
      const key = ref.inviterDriverId;

      if (!inviterMap.has(key)) {
        // Get balance from ReferalBalanceModel
        const balanceRecord = await ReferalBalanceModel.findOne({ driverId: key });

        inviterMap.set(key, {
          inviter: {
            firstName: ref.inviterFirstName,
            lastName: ref.inviterLastName,
            phone: ref.inviterPhone,
            driverId: key,
            balance: balanceRecord?.amount || 0,
          },
          referals: [],
        });
      }

      inviterMap.get(key)!.referals.push({
        firstName: ref.firstName,
        lastName: ref.lastName,
        phone: ref.invitedPhone,
      });
    }

    const grouped = Array.from(inviterMap.values());
    const paginated = grouped.slice(skip, skip + limit);

    return NextResponse.json({
      data: paginated,
      total: grouped.length,
      page,
      totalPages: Math.ceil(grouped.length / limit),
    });
  } catch (error) {
    console.error("Error fetching referals:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Ensure database connection
    await connectMongo();

    // Authenticate and authorize the admin
    const user = AdminProtection(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Parse the request body
    const { percentage, minWithdrawAmount } = await req.json();

    await ReferalParametersModel.findOneAndUpdate({}, { percentage, minWithdrawAmount }, { new: true, upsert: true });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating gift:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Ensure database connection
    await connectMongo();

    // Authenticate and authorize the admin
    const user = AdminProtection(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // Parse the request body
    const { inviterPhone, invitedPhone } = await req.json();

    const inviter = await Yandex_GetDriverByPhone(inviterPhone);
    if (!inviter) return NextResponse.json({ message: "Invalid inviter phone" }, { status: 400 });
    const invited = await Yandex_GetDriverByPhone(invitedPhone);
    if (!invited) return NextResponse.json({ message: "Invalid invited phone" }, { status: 400 });

    const alreadyInvited = await ReferalModel.findOne({ invitedDriverId: invited.driver_profile.id });
    if (alreadyInvited) return NextResponse.json({ message: "Already invited" }, { status: 400 });

    await ReferalModel.create({
      inviterDriverId: inviter.driver_profile.id,
      invitedDriverId: invited.driver_profile.id,
      firstName: invited.driver_profile.first_name,
      lastName: invited.driver_profile.last_name,
      inviterPhone: inviterPhone,
      inviterFirstName: inviter.driver_profile.first_name,
      inviterLastName: inviter.driver_profile.last_name,
      invitedPhone: invitedPhone,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating gift:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
