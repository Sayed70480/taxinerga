import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export type Locale = "tk" | "ka" | "ru";
export const locales: Locale[] = ["tk", "ka", "ru"];

export const routing = defineRouting({
  locales,
  defaultLocale: "ka",
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
