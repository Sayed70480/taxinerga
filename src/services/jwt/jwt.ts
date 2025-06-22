import jwt, { Secret } from "jsonwebtoken";

const SECRET_KEY: Secret = process.env.JWT_SECRET as string;

if (!SECRET_KEY) {
  throw new Error("❌ JWT_SECRET is missing in environment variables");
}

export const signToken = (payload: object) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "60d" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY as Secret) as any;
  } catch (error) {
    console.error("Error verifying JWT token:", error);
    return null;
  }
};
