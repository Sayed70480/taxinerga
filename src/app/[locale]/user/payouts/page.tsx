import { auth } from "@/auth";
import WithdrawModel, { I_Withdraw } from "@/services/mongodb/models/WithdrawModel";
import { getTranslations } from "next-intl/server";
import React from "react";
import BOG from "@/assets/bog.svg";
import TBC from "@/assets/tbc.svg";
import Image from "next/image";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import connectMongo from "@/services/mongodb/connectMongo";
import { FaCircleCheck, FaCircleXmark, FaClock, FaSackDollar, FaCalendar } from "react-icons/fa6";
import { RiBankCardFill, RiDiscountPercentFill } from "react-icons/ri";
import { MdAccessTimeFilled } from "react-icons/md";
import ReferalWithdrawModel from "@/services/mongodb/models/ReferalWithdrawModel";

dayjs.extend(utc);
dayjs.extend(timezone);

const PayoutHistory = async () => {
  await connectMongo();
  const t = await getTranslations("payoutsHistory");
  const session = await auth();
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const driver = session.user;
  const history = await WithdrawModel.find<I_Withdraw>({ driverId: driver.driver_profile.id }).sort({ createdAt: -1 }).limit(15);
  const bonuses = await ReferalWithdrawModel.find<I_Withdraw>({ driverId: driver.driver_profile.id }).sort({ createdAt: -1 }).limit(15);
  return (
    <>
      <div className="mx-auto max-w-[600px]">
        <h1 className="mb-5 text-center text-xl font-bold">{t("title")}</h1>
        <div className="grid grid-cols-[80px,1fr,1fr,1fr,80px] gap-1 text-sm font-bold">
          <div className="flex items-center justify-center">
            <RiBankCardFill />
          </div>
          <div className="flex items-center justify-center">
            <FaSackDollar />
          </div>
          <div className="flex items-center justify-center">
            <RiDiscountPercentFill />
          </div>
          <div className="flex items-center justify-center">
            <MdAccessTimeFilled />
          </div>
          <div className="flex items-center justify-center">
            <FaCalendar />
          </div>
        </div>
        <div className="mt-4 grid max-h-[60dvh] grid-cols-1 gap-y-2 overflow-y-auto text-sm font-bold">
          {history.map((item) => (
            <div className="border-t-gray-500 mx-auto grid w-full grid-cols-[80px,1fr,1fr,1fr,80px] border-t px-2 pt-1" key={item._id as string}>
              <div className="flex items-center justify-center gap-1 text-xs">
                {<Image className="w-5" src={item.bank === "bog" ? BOG : TBC} alt="bog" />}
                <span>&lowast;&lowast;{item.iban.slice(item.iban.length - 4, item.iban.length)}</span>
              </div>
              <div className="flex w-full items-center justify-center text-center text-sm">{item.amount} ₾</div>
              <div className="items-center justify-center text-center text-sm">{item.commission || 0} ₾</div>
              <div className={`text-yellow-500 hidden items-center justify-center text-center text-sm lg:flex ${item.status === "rejected" && "!text-red-500"} ${item.status === "completed" && "!text-emerald-600"} `}>{t(item.status)}</div>
              <div className={`text-yellow-500 flex items-center justify-center text-center text-sm lg:hidden ${item.status === "rejected" && "!text-red-500"} ${item.status === "completed" && "!text-emerald-600"} `}>
                {item.status === "completed" && <FaCircleCheck className="text-emerald-600" size={16} />}
                {item.status === "rejected" && <FaCircleXmark className="text-red-500" size={16} />}
                {item.status === "pending" && <FaClock className="text-yellow" size={16} />}
              </div>
              <div className="flex-col items-center justify-center text-center text-sm">
                <span>
                  {(() => {
                    const createdAt = dayjs.utc(item.createdAt).tz("Asia/Tbilisi"); // Convert to Georgian time
                    const today = dayjs().tz("Asia/Tbilisi"); // Get today's date in Georgian time

                    if (createdAt.isSame(today, "day")) {
                      // If it's today, show only time
                      return createdAt.format("HH:mm");
                    } else {
                      // If it's not today, show only the date
                      return createdAt.format("DD.MM.YYYY");
                    }
                  })()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {bonuses.length > 0 && (
        <div className="mx-auto mt-5 max-w-[600px]">
          <h1 className="mb-5 text-center text-xl font-bold">{t("referal")}</h1>
          <div className="grid grid-cols-[80px,1fr,1fr,1fr,80px] gap-1 text-sm font-bold">
            <div className="flex items-center justify-center">
              <RiBankCardFill />
            </div>
            <div className="flex items-center justify-center">
              <FaSackDollar />
            </div>
            <div className="flex items-center justify-center">
              <RiDiscountPercentFill />
            </div>
            <div className="flex items-center justify-center">
              <MdAccessTimeFilled />
            </div>
            <div className="flex items-center justify-center">
              <FaCalendar />
            </div>
          </div>
          <div className="mt-4 grid max-h-[60dvh] grid-cols-1 gap-y-2 overflow-y-auto text-sm font-bold">
            {bonuses.map((item) => (
              <div className="border-t-gray-500 mx-auto grid w-full grid-cols-[80px,1fr,1fr,1fr,80px] border-t px-2 pt-1" key={item._id as string}>
                <div className="flex items-center justify-center gap-1 text-xs">
                  {<Image className="w-5" src={item.bank === "bog" ? BOG : TBC} alt="bog" />}
                  <span>&lowast;&lowast;{item.iban.slice(item.iban.length - 4, item.iban.length)}</span>
                </div>
                <div className="flex w-full items-center justify-center text-center text-sm">{item.amount} ₾</div>
                <div className="items-center justify-center text-center text-sm">{item.commission || 0} ₾</div>
                <div className={`text-yellow-500 hidden items-center justify-center text-center text-sm lg:flex ${item.status === "rejected" && "!text-red-500"} ${item.status === "completed" && "!text-emerald-600"} `}>{t(item.status)}</div>
                <div className={`text-yellow-500 flex items-center justify-center text-center text-sm lg:hidden ${item.status === "rejected" && "!text-red-500"} ${item.status === "completed" && "!text-emerald-600"} `}>
                  {item.status === "completed" && <FaCircleCheck className="text-emerald-600" size={16} />}
                  {item.status === "rejected" && <FaCircleXmark className="text-red-500" size={16} />}
                  {item.status === "pending" && <FaClock className="text-yellow" size={16} />}
                </div>
                <div className="flex-col items-center justify-center text-center text-sm">
                  <span>
                    {(() => {
                      const createdAt = dayjs.utc(item.createdAt).tz("Asia/Tbilisi"); // Convert to Georgian time
                      const today = dayjs().tz("Asia/Tbilisi"); // Get today's date in Georgian time

                      if (createdAt.isSame(today, "day")) {
                        // If it's today, show only time
                        return createdAt.format("HH:mm");
                      } else {
                        // If it's not today, show only the date
                        return createdAt.format("DD.MM.YYYY");
                      }
                    })()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PayoutHistory;
