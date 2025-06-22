"use client";

import Content from "@/components/custom_ui/Content";
import { IReferal } from "@/services/mongodb/models/ReferalModel";
import { IReferalParameters } from "@/services/mongodb/models/ReferalParametersModel";
import { useLocale, useTranslations } from "next-intl";
// import { BsFillInfoCircleFill } from "react-icons/bs";
import Copy from "./Copy";
// import ReferalWithdrawForm from "./ReferalWithdrawForm";
// import Button from "@/components/forms/Button";
import { useState } from "react";

interface Props {
  balance: number;
  referals: IReferal[];
  driverId: string;
  referalParams: IReferalParameters;
  baseUrl: string;
  bankP: "tbc" | "bog";
  ibanP: string;
}
const Referals = ({ balance, referals, baseUrl, driverId, ibanP, bankP }: Props) => {
  const t = useTranslations("referals");
  const locale = useLocale();
  // const [open, setOpen] = useState(false);
  return (
    <main className="px-4 ">
      <Content className="flex max-w-[480px] flex-col gap-4 border-[1px] border-blue-500 overflow-hidden  rounded-lg">
        <div className="mx-auto flex w-full flex-col gap-4  bg-blue-500 p-2 px-4">
          <div className=" bg-blue-500 text-white text-center py-6 rounded-t-lg">
            <h2 className="text-2xl font-bold ">REFERRAL LINK</h2>
            {/* <h1 className="text-white">{t("balane")}</h1>
            <p className="w-fit rounded-md bg-darkGray p-2 text-sm text-yellow">{balance.toFixed(2)} ₾</p> */}
          </div>
        </div>
        {/* {!open && <Button onClick={() => setOpen(true)}>{t("cashout")}</Button>}
        {open && <ReferalWithdrawForm ibanP={ibanP} bankP={bankP} />} */}
        {/* <div className="m mx-auto w-full rounded-lg border border-blue-400 bg-blue-400 bg-opacity-30 p-4 text-sm text-white">
          <BsFillInfoCircleFill className="float-left mr-2 mt-1 text-blue-400" />
          {t("percentage").replace("^", referalParams.percentage.toString())}
        </div> */}
        <div className="mx-auto flex w-full flex-col gap-4 text-center bg-white p-2 px-4">
          <p className="text-black">
            {/* {t("share")} */}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi fuga sit dicta, nulla accusantium repellendus quis non consequuntur quos maiores, dolores iste tempora nemo qui! Temporibus ut numquam architecto voluptas!
            </p>
          <Copy content={`${baseUrl}/${locale}/register?referal=${driverId}`} />
        </div>
        {referals.length === 0 ? (
          
          <div className="mx-auto w-full rounded-lg bg-white border-[1px] border-blue-500 text-black p-2 px-4 text-center">{t("noReferals")}</div>
        ) : (
          <div className="mx-auto grid w-full text-black border-[1px] border-blue-500 max-w-[480px] grid-cols-1 gap-4">
            {/* <p className="mb-2 text-lg font-semibold text-yellow">{t("referals")}</p> */}
            {referals.map((ref) => (
              <p key={ref._id + ""}>
                {ref.firstName} {ref.lastName}
              </p>
            ))}
          </div>
        )}
      </Content>
    </main>
  );
};

export default Referals;
