import { YandexDriverInfo } from "@/services/yandex/Yandex_GetDriverByPhone";
import NextAuth from "next-auth";

interface User extends YandexDriverInfo {
  lastFetched: number;
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User;
  }
}
