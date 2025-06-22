import { NextResponse } from "next/server";
import { verifyToken, signToken } from "@/services/jwt/jwt";
import { headers } from "next/headers";

export async function GET() {
  const headersList = headers();
  const authrorization = headersList.get("authorization") || "";
  const token = authrorization.split(" ")[1];

  try {
    // Get token from headers

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    // Verify the token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "სესიას გაუვიდა ვადა" }, { status: 401 });
    }

    const newToken = signToken({ id: decoded.id, username: decoded.username, role: decoded.role });

    return NextResponse.json({ valid: true, user: decoded, newToken }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
