import Routes from "@/config/Routes";
import { Link } from "@/i18n/routing";
import React from "react";
import { Roboto } from "next/font/google";

const LogoFont = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

const Logo = () => {
  return (
    <Link className={LogoFont.className} href={Routes.home.path}>
      <h1 className="text-lg text-white lg:text-3xl">TaxiNerga</h1>
    </Link>
  );
};

export default Logo;
