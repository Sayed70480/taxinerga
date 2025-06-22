"use server";

import { signIn } from "@/auth";

interface SignInProps {
  phone?: string;
  otp?: string;
  id?: string;
}

export async function SignIn({ phone, otp, id }: SignInProps) {
  if (id) {
    return await signIn("credentials", { id, redirectTo: "/" });
  }
  return await signIn("credentials", { phone, otp, redirectTo: "/" });
}
