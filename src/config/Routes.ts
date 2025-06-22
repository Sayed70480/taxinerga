import { IconType } from "react-icons/lib";
import { HiOutlineUser, HiOutlineViewGrid, HiOutlineHome, HiOutlineUserAdd, HiOutlineIdentification } from "react-icons/hi";
import { HiOutlineUserPlus } from "react-icons/hi2";
import { BsCash, BsDatabaseGear } from "react-icons/bs";
import { MdOutlineHistory, MdOutlineLeaderboard } from "react-icons/md";
import { TiGift } from "react-icons/ti";
import { LiaCarSideSolid } from "react-icons/lia";
import { FiPhone } from "react-icons/fi";
import { RiAdvertisementLine, RiAdminLine } from "react-icons/ri";
import { IoMdNotificationsOutline } from "react-icons/io";
import { VscPerson } from "react-icons/vsc";
import { FaRegHandshake } from "react-icons/fa";
import { ImSphere } from "react-icons/im";
import { ImFlag } from "react-icons/im";

// ✅ Define main routes
type RouteEnum = "home" | "signIn" | "registration" | "admin" | "user";

// ✅ Define sub-routes allowed under admin and user
type SubRouteEnum =
  | "adminPanel"
  | "adminLogin"
  | "adminWithdraws"
  | "adminRegistrations"
  | "payout"
  | "founds" // Added for funds page
  | "payoutRequests"
  | "adminWithdrawParams"
  | "gift" // Added for gifts page
  | "carRent"
  | "admins"
  | "notification"
  | "advertisement"
  | "contact"
  | "drivers"
  | "referalParameters"
  | "referals"
  | "leaderboard"
  | "changecar"
  | "changephonenumber"
  | "carforrent"
  | "faq";

// ✅ Route Type
interface Route {
  path: string;
  label: string;
  icon: IconType;
  subPages?: Partial<Record<SubRouteEnum, Route>>; // ✅ Restricts nested routes
}

// ✅ Define all routes
const Routes: Record<RouteEnum, Route> = {
  home: {
    path: "/",
    label: "home",
    icon: HiOutlineHome,
  },
  signIn: {
    path: "/sign-in",
    label: "signIn",
    icon: HiOutlineUser,
  },
  registration: {
    path: "/register",
    label: "register",
    icon: HiOutlineUserAdd,
  },
  admin: {
    path: "/admin",
    label: "admin",
    icon: HiOutlineIdentification,
    subPages: {
      adminPanel: {
        path: "/admin/panel",
        label: "მიმოხილვა",
        icon: HiOutlineViewGrid,
      },
      drivers: {
        path: "/admin/panel/drivers",
        label: "მძღოლები",
        icon: VscPerson,
      },
      adminWithdrawParams: {
        path: "/admin/panel/withdraw-parameters",
        label: "გატანის პარამეტრები",
        icon: BsDatabaseGear,
      },
      adminRegistrations: {
        path: "/admin/panel/registration-rules",
        label: "რეგისტრაციის წესები",
        icon: HiOutlineUserPlus,
      },
      gift: {
        path: "/admin/panel/gift",
        label: "საჩუქარი",
        icon: TiGift,
      },
      carRent: {
        path: "/admin/panel/car-rent",
        label: "მანქანის გაქირავება",
        icon: LiaCarSideSolid,
      },
      contact: {
        path: "/admin/panel/contact",
        label: "კონტაქტი",
        icon: FiPhone,
      },
      advertisement: {
        path: "/admin/panel/advertisement",
        label: "რეკლამა",
        icon: RiAdvertisementLine,
      },
      notification: {
        path: "/admin/panel/notification",
        label: "შეტყობინება",
        icon: IoMdNotificationsOutline,
      },
      admins: {
        path: "/admin/panel/admins",
        label: "ადმინისტრატორები",
        icon: RiAdminLine,
      },
      referalParameters: {
        path: "/admin/panel/referal-parameters",
        label: "რეფერალური სისტემა",
        icon: FaRegHandshake,
      },
      leaderboard: {
        path: "/admin/panel/leaderboard",
        label: "ლიდერბორდი",
        icon: MdOutlineLeaderboard,
      },
      adminLogin: {
        path: "/admin/login",
        label: "Admin Login",
        icon: HiOutlineIdentification,
      },
    },
  },
  user: {
    path: "/withdrawInfo", // This base path means user routes generally start after /[locale]/
    label: "payout",
    icon: HiOutlineIdentification,
    subPages: {
      payout: {
  // Change path to match folder casing
  path: "/user/withdrawInfo", // <-- Changed to match 'withdrawInfo' folder
  label: "payout",
  icon: BsCash,
},
      changecar: {
        path: "/user/changecar", // Assuming src/app/[locale]/user/changecar/page.tsx
        label: "Change Car",
        icon: LiaCarSideSolid,
      },
      changephonenumber: {
        path: "/user/changephonenumber", // Confirmed: src/app/[locale]/user/changephonenumber/page.tsx
        label: "Change Phone Number",
        icon: FiPhone,
      },
      carforrent: {
        path: "/user/carforrent", // Confirmed: src/app/[locale]/user/carforrent/page.tsx
        label: "Car For Rent",
        icon: ImSphere,
      },
      referals: {
        path: "/user/referals", // Assuming src/app/[locale]/user/referals/page.tsx 
        label: "referals Link",
        icon: FaRegHandshake,
      },
      faq: {
        path: "/user/faq", // Confirmed: src/app/[locale]/user/faq/page.tsx
        label: "Faq",
        icon: ImFlag,
      },
      payoutRequests: {
        path: "/user/payouts", // Assuming src/app/[locale]/user/payouts/page.tsx
        label: "payoutHistory",
        icon: MdOutlineHistory,
      },
      // ✅ NEW: Added the 'gifts' route based on your file structure
      gift: {
        path: "/user/gifts", // Corresponds to src/app/[locale]/user/gifts/page.tsx
        label: "Gifts", // Display label for the link
        icon: TiGift, // Using the TiGift icon
      },
      // ✅ NEW: Added the 'founds' route based on your Link href
      founds: {
        path: "/user/funds", // Corresponds to src/app/[locale]/user/funds/page.tsx
        label: "Add Funds", // Display label for the link
        icon: BsCash, // Using BsCash or choose another appropriate icon
      },
    },
  },
};

export default Routes;