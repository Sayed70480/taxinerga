import Routes from "@/config/Routes";
import { Link, usePathname } from "@/i18n/routing";
import React, { useState } from "react";
import { IoMenu, IoClose } from "react-icons/io5"; // Import menu icons

const AdminSidebarnav = Object.values(Routes.admin.subPages || []).filter((r) => r.path !== "/admin/login");

const SidebarPhone = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // Toggle state

  return (
    <>
      {/* Menu Toggle Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="fixed left-4 top-3 z-[999] flex items-center justify-center rounded-md bg-gray p-2 text-white shadow-md lg:hidden">
        {isOpen ? <IoClose size={28} /> : <IoMenu size={28} />}
      </button>

      {/* Sidebar Menu */}
      <div className={`fixed left-0 top-20 z-[9999] h-full w-[300px] bg-gray p-4 shadow-lg transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {AdminSidebarnav.map((route, index) => (
          <Link
            href={route.path}
            key={index}
            onClick={() => setIsOpen(false)} // Close on click
            className={`flex w-full cursor-pointer items-center gap-2 rounded-md p-2 font-semibold text-white ${pathname === route.path ? "bg-darkGray" : "hover:bg-darkGray"}`}
          >
            <route.icon size={28} />
            <span>{route.label}</span>
          </Link>
        ))}
      </div>

      {/* Background Overlay (closes menu when clicked) */}
      {isOpen && <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default SidebarPhone;
