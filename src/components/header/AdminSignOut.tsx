"use client";
import Routes from "@/config/Routes";
import { useRouter } from "@/i18n/routing";
import { adminAtom } from "@/jotai/adminAtom";
import { useAtom } from "jotai";
import { PiSignOutBold } from "react-icons/pi";

const AdminSignOut = () => {
  const [admin, setAdmin] = useAtom(adminAtom);
  const router = useRouter();
  if (!admin) {
    return null;
  }
  return (
    <div className="flex items-center gap-6 text-lg font-semibold text-white">
      {admin && <p className="hidden lg:block">{admin.username}</p>}
      <PiSignOutBold
        onClick={() => {
          setAdmin(null);
          localStorage.removeItem("admin_token");
          router.push(Routes.admin.subPages?.adminLogin?.path || "");
        }}
        className="cursor-pointer text-xl"
      />
    </div>
  );
};

export default AdminSignOut;
