"use client";

import Admin_Axios from "@/admin/Admin_Axios";
import Sidebar from "@/components/admin/Sidebar";
import SidebarPhone from "@/components/admin/SidebarPhone";
import Routes from "@/config/Routes";
import { useRouter } from "@/i18n/routing";
import { adminAtom } from "@/jotai/adminAtom";
import { useAtom } from "jotai";
import { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
};

export default function AdminPanelLayout({ children }: Props) {
  const router = useRouter();
  const [admin, setAdmin] = useAtom(adminAtom);

  useEffect(() => {
    if (!admin) {
      const validateToken = async () => {
        const token = localStorage.getItem("admin_token");

        if (!token) {
          router.push(Routes.admin.subPages?.adminLogin?.path || "");
          return;
        }
        try {
          const res = await Admin_Axios.get("/validate", {
            headers: { Authorization: `Bearer ${token}` },
          });
          Admin_Axios.interceptors.request.use((config) => {
            config.headers.Authorization = `Bearer ${res.data.newToken}`;
            return config;
          });
     
          setAdmin(res.data.user);
        } catch (err) {
          console.error(err);
          localStorage.removeItem("token");
          router.push(Routes.admin.subPages?.adminLogin?.path || "");
        }
      };

      validateToken();
    }
  }, [admin, router, setAdmin]);

  if (!admin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full gap-6 p-4">
      <Sidebar />
      <SidebarPhone />

      <main className="lg:ml-[340px] rounded-lg bg-gray p-4">{children}</main>
    </div>
  );
}
