"use client";
import Content from "@/components/custom_ui/Content";
import RegisterCar from "@/components/forms/RegisterCar";
import RegisterDriver from "@/components/forms/RegisterDriver";
import Car_Years from "@/services/car/Car_Years";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

const RegistrationPage = () => {
  const params = useSearchParams();
  const [driverId, setDriverId] = useState<string | null>(params.get("driverId"));
  const referal = params.get("referal")
  const years = Car_Years();

  return (
    <div className="flex w-full flex-col items-center">
      <Content className="px-4">
        {!driverId && <RegisterDriver referal={referal} setDriverId={setDriverId} />}
        {Boolean(driverId && years.length > 0) && <RegisterCar years={years} driverId={driverId as string} />}
      </Content>
    </div>
  );
};

export default RegistrationPage;
