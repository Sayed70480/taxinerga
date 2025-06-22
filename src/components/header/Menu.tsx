"use client";
import { menuAtom } from "@/jotai/menuAtom";
import { useAtom } from "jotai";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import Content from "../custom_ui/Content";
import Routes from "@/config/Routes";
import { Link, usePathname } from "@/i18n/routing";
import SignOutButton from "./SignOutButton";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import Image from "next/image";
import { ImFacebook2 } from "react-icons/im";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";


const userMenu = Object.values(Routes.user.subPages || []);

const Menu = ({ authorized }: { authorized: boolean }) => {
  const t = useTranslations("routes");
  const [open, setOpen] = useAtom(menuAtom);
  const pathname = usePathname();
  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);
  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer text-white">
        <HiOutlineMenu size={32} />
      </div>
      {open && <div className={`fixed bottom-0 left-0 right-0 top-0 z-[-1] ${open && "!z-[998] backdrop-blur-[1px]"}`}></div>}
      <div className={`fixed top-0 z-[999] h-[100dvh] w-[75vw] max-w-[400px] bg-slate-200 transition-all lg:h-fit lg:rounded-xl lg:pb-8 lg:shadow lg:shadow-white lg:transition-none ${open ? "left-[25%] lg:left-auto lg:right-[calc((100vw-1280px)/2)]" : "left-full"}`}>
        <Content className="flex h-16 cursor-pointer items-center justify-between px-4 text-white  bg-blue-500">
          <h1 className="font-bold text-2xl">TaxiNerga</h1>
          <HiOutlineX size={32} onClick={() => setOpen(false)} />
        </Content>
        <div className="flex items-center gap-4 p-3 pl-5  border-black border-b-[1px] mb-4">
          <Image
                  src="/pro.png"// Use the imported image variable here
                  alt="User Profile Picture"
                   width={80}  // You can still set these, but Next.js often infers them from the import
                        height={80} //
                                     className="rounded-full"
                 />
       
          <div>
            <h4 className="font-extrabold text-xl  inline">User Name</h4>
            <h5 className="font-semibold">User Id</h5>
          </div>
        </div>
        {authorized && (
          <div className="flex flex-col gap-4 pl-6">
            {userMenu.map((item) => (
              <Link href={item.path} key={item.path} className="flex items-center gap-4 text-lg text-black">
                <item.icon size={28} />
                {/* @ts-expect-error -- Ignore */}
                <p className="whitespace-nowrap">{t(item.label)}</p>
              </Link>
            ))}
           
            <SignOutButton close={() => setOpen(false)} />
          </div>
        )}
        {!authorized && (
          <div className="flex flex-col gap-1 pl-6">
            <Link onClick={() => setOpen(false)} href={Routes.signIn.path} className="flex items-center gap-2 text-lg text-white">
              <Routes.signIn.icon size={32} />
              {/* @ts-expect-error -- Ignore */}
              <p className="whitespace-nowrap">{t(Routes.signIn.label)}</p>
            </Link>
          </div>
        )}
         <div  className="flex justify-center gap-8 mt-5">
<a href="#"><ImFacebook2 size={28}/></a>
<a href="#"><FaTiktok size={28}/></a>
<a href="#"><FaSquareInstagram size={28}/></a>

            </div>
      </div>
    </>
  );
};

export default Menu;
