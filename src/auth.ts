import NextAuth from "next-auth";
import { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";
import Yandex_GetDriverByPhone, { YandexDriverInfo } from "./services/yandex/Yandex_GetDriverByPhone";

interface User extends YandexDriverInfo {
  lastFetched: number;
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  },
  callbacks: {
    async jwt({ token, user }) {
      // On login, store user data
      if (user) {
        token.user = user;
        token.lastFetched = Date.now(); // Store the fetch time
      }

      return token;
    },

    async session({ session, token }) {
      if (!session.user) return session;

      const REFRESH_INTERVAL = 5 * 60 * 1000; // 24 hours in milliseconds

      // If the data was fetched more than 24 hours ago, refresh it
      // @ts-expect-error - IGNORE
      if (!token.lastFetched || Date.now() - token.lastFetched > REFRESH_INTERVAL) {
        try {
          const user = token.user as User;
          const updatedUser = await Yandex_GetDriverByPhone(user.driver_profile.phones[0]);
          if (updatedUser) {
            token.user = updatedUser;
            token.lastFetched = Date.now(); // Update fetch time

            try {
              await axios.post(process.env.AUTH_URL + "/api/driver", { phone: user.driver_profile.phones[0] });
            } catch (error) {
              console.error("Failed to auth driver", error);
            }
          }
        } catch (error) {
          console.error("Failed to refresh user data:", error);
        }
      }

      // @ts-expect-error - IGNORE
      session.user = token.user as User;
      
      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        phone: { label: "Phone" },
        otp: { label: "OTP" },
        id: { label: "ID" },
      },
      // @ts-expect-error - IGNORE
      async authorize(credentials) {
        if (!credentials.id) {
          if (!credentials?.phone || !credentials?.otp) {
            throw new Error("Missing phone or OTP");
          }

          try {
            const res = await axios.post<{ driver: YandexDriverInfo }>(process.env.AUTH_URL + "/api/otp/confirm", credentials);

            if (!res.data.driver) {
              throw new Error("Driver not found");
            }

            try {
              await axios.post(process.env.AUTH_URL + "/api/driver", { phone: credentials.phone });
            } catch (error) {
              console.error("Failed to auth driver", error);
            }

            return {
              ...res.data.driver,
            } as YandexDriverInfo;
          } catch (error: any) {
            throw new CredentialsSignin(error.response.data.message);
          }
        } else {
          // @ts-expect-error - IGNORE
          const driver = await Yandex_GetDriverByPhone(credentials.id);
          try {
            await axios.post(process.env.AUTH_URL + "/api/driver", { phone: credentials.id });
          } catch (error) {
            console.error("Failed to auth driver", error);
          }
          if (!driver) {
            throw new Error("Driver not found");
          }

          return {
            ...driver,
          } as YandexDriverInfo;
        }
      },
    }),
  ],
});
