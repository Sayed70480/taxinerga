import Routes from "@/config/Routes";
import { Link, usePathname } from "@/i18n/routing";
import React from "react";

const AdminSidebarnav = Object.values(Routes.admin.subPages || []).filter((r) => r.path !== "/admin/login");

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className="w-[300px] hidden lg:flex fixed p-4 min-h-[200px] h-fit rounded-lg bg-gray flex-col gap-1">
      {AdminSidebarnav.map((route, index) => (
        <Link href={route.path} key={index} className={`flex w-full font-semibold p-2 rounded-md cursor-pointer items-center gap-2 text-white ${pathname === route.path ? "bg-darkGray" :"hover:bg-darkGray"}`}>
          <route.icon size={28}/>
          <span>{route.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
