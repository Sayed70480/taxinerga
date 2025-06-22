import { NextRequest } from "next/server";
import { verifyToken } from "../jwt/jwt";

export type Role = "superadmin" | "admin";
export const AdminProtection = (req: NextRequest, allowedRoles: Role[] = ["superadmin", "admin"]) => {
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);

  if (!decoded || !allowedRoles.includes(decoded.role)) {
    return null;
  }

  return decoded;
};
