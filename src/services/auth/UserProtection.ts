import { auth } from "@/auth";

export async function UserProtection() {
  const session = await auth();
  if (!session) {
    return null;
  }
  const user = session?.user;
  if (!user) {
    return null;
  }
  return user;
}
