import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

import { auth } from "@/auth";
import Routes from "./config/Routes";
import { locales } from "./i18n/routing";

const publicPages = ["/contact", "/register"];

const authPages = ["/sign-in"];


const testPathnameRegex = (pages: string[], pathName: string): boolean => {
  return RegExp(`^(/(${locales.join("|")}))?(${pages.flatMap((p) => (p === "/" ? ["", "/"] : p)).join("|")})/?$`, "i").test(pathName);
};

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: "ka",
  localePrefix: "always",
});

const authMiddleware = auth((req) => {
  const isAuthPage = testPathnameRegex(authPages, req.nextUrl.pathname);
  const session = req.auth;

  // Redirect to sign-in page if not authenticated
  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL(Routes.signIn.path, req.nextUrl));
  }

  // Redirect to home page if authenticated and trying to access auth pages
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL(Routes.home.path, req.nextUrl));
  }

  return intlMiddleware(req);
});

const middleware = (req: NextRequest) => {
  const isPublicPage = testPathnameRegex(publicPages, req.nextUrl.pathname);
  const isAuthPage = testPathnameRegex(authPages, req.nextUrl.pathname);
  const isAdminPage = req.nextUrl.pathname.includes("/admin");

  if (isAuthPage) {
    return (authMiddleware as any)(req);
  }

  if (isPublicPage || isAdminPage) {
    return intlMiddleware(req);
  } else {
    return (authMiddleware as any)(req);
  }
};

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

export default middleware;
