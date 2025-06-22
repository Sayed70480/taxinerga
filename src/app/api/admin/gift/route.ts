import { NextRequest, NextResponse } from "next/server";
import GiftModel from "@/services/mongodb/models/GiftModel";
import { AdminProtection } from "@/services/auth/AdminProtection";
import connectMongo from "@/services/mongodb/connectMongo";

export async function PUT(req: NextRequest) {
  try {
    // Ensure database connection
    await connectMongo();

    // Authenticate and authorize the admin
    const user = AdminProtection(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Parse the request body
    const { content, visible } = await req.json();

    // Validate input
    if (typeof content !== "object" || !content.ka || typeof content.ka !== "string" || content.ka.trim() === "" || !content.ru || typeof content.ru !== "string" || content.ru.trim() === "" || !content.tk || typeof content.tk !== "string" || content.tk.trim() === "") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Update or insert the only existing gift entry
    const updatedGift = await GiftModel.findOneAndUpdate(
      {}, // Update the single existing entry
      { content, visible },
      { new: true, upsert: true }, // Create if it doesn't exist
    );

    return NextResponse.json({ success: true, data: updatedGift }, { status: 200 });
  } catch (error) {
    console.error("Error updating gift:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
