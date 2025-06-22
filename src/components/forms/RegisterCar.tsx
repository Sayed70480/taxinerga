import { YearOption } from "@/services/car/Car_Years";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import SelectAdvanced from "./SelectAdvanced";
import Car_Brands, { BrandOption } from "@/services/car/Car_Brands";
import Car_Models, { ModelOptions } from "@/services/car/Car_Models";
import { CarColor, ColorArray } from "@/services/yandex/Yandex_CreateCar";
import Button from "./Button";
import Input from "./Input";
import axios from "axios";
import { toast } from "react-toastify";
import { SignIn } from "@/services/auth/SignIn";
import FormTitle from "../custom_ui/FormTitle";

interface Props {
  years: YearOption[];
  driverId: string;
}

const RegisterCar = ({ years, driverId }: Props) => {
  const t = useTranslations("carCreation");
  const locale = useLocale();
  const colorsT = useTranslations("carCreation.colors");
  const [step, setStep] = useState(1);
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [models, setModels] = useState<ModelOptions[]>([]);
  const [carData, setCarData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const colorOptions = ColorArray.map((item) => ({ label: colorsT(item), value: item }));

  useEffect(() => {
    const updateBrands = () => {
      const brandsData = Car_Brands();
      if (brandsData) {
        setBrands(brandsData);
      }
    };
    updateBrands();
  }, []);

  const updateModels = async (brand: string) => {
    const modelsData = await Car_Models(brand);
    if (modelsData) {
      setModels(modelsData);
    }
  };

  const vehicleSpecificationsSchema = yup.object({
    brand: yup.string().required(t("required")),
    color: yup.mixed<CarColor>().oneOf(ColorArray, "Invalid transmission type").required(t("required")),
    model: yup.string().required(t("required")),
    // transmission: yup.mixed<Transmission>().oneOf(TransmissionArray, "Invalid transmission type").required(t("required")),
    year: yup.string().required(t("required")),
  });

  const vehicleDetailsSchema = yup.object({
    callsign: yup
      .string()
      .matches(/^[A-Z]{2}[0-9]{3}[A-Z]{2}$/, t("invalidLicensePlate"))
      .required(t("required")),
    // fuel_type: yup.mixed<FuelType>().oneOf(FuelTypeArray, "Invalid fuel type").required(t("required")),
    techPassportNumber: yup.string().required(t("required")),
    vin: yup
      .string()
      .matches(/^[A-HJ-NPR-Z0-9]{17}$/, t("invalidVin"))
      .required(t("required")),
  });

  const {
    handleSubmit: handleVehicleSpecificationSubmit,
    formState: { errors: vehicleSpecificationErrors },
    setValue: setSpecsValue,
    watch: watchSpecs,
    setError: setSpecsError,
  } = useForm({ resolver: yupResolver(vehicleSpecificationsSchema) });

  const {
    register: registerVehicleDetails,
    handleSubmit: handleVehicleDetailsSubmit,
    formState: { errors: vehicleDetailsErrors },
  } = useForm({ resolver: yupResolver(vehicleDetailsSchema) });

  const handleStep1 = (data: any) => {
    setCarData((prev: any) => ({ ...prev, vehicle_specifications: { ...data, year: parseInt(data.year) } }));
    setStep(2);
  };

  const handleStep2 = async (data: any) => {
    setIsLoading(true);
    setCarData((prev: any) => ({ ...prev, park_profile: data }));
    const dataToSubmit = { ...carData, vehicle_specifications: { ...carData.vehicle_specifications, vin: data.vin }, park_profile: data, vehicle_licenses: { licence_plate_number: data.callsign, registration_certificate: data.techPassportNumber }, driverId };
    console.log(dataToSubmit);
    try {
      const response = await axios.post("/api/registration/create-car", dataToSubmit, {
        headers: {
          locale,
        },
      });
      toast.success(response.data.message);
      SignIn({ id: response.data.phone });
    } catch (error: any) {
      if (error?.response?.data?.message.includes("Model")) {
        setStep(1);
        setSpecsError("model", { message: t("modelNotExist") });
      }
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[400px] rounded-lg bg-slate-300 p-6 pt-4">
      {step === 1 && (
        <form onSubmit={handleVehicleSpecificationSubmit(handleStep1)}>
          <FormTitle className="mb-4">{t("registration")}</FormTitle>
          <div className="grid w-full gap-x-4">
            <SelectAdvanced
              value={watchSpecs("year")}
              onChange={(value) => {
                setSpecsValue("year", value, { shouldValidate: true });
              }}
              error={vehicleSpecificationErrors.year?.message}
              label={t("year")}
              options={years}
            />
            <SelectAdvanced
              disabled={brands.length === 0}
              value={watchSpecs("brand")}
              onChange={(value) => {
                setSpecsValue("brand", value, { shouldValidate: true });
                updateModels(value);
              }}
              error={vehicleSpecificationErrors.brand?.message}
              label={t("brand")}
              options={brands}
            />
            <SelectAdvanced disabled={models.length === 0} value={watchSpecs("model")} onChange={(value) => setSpecsValue("model", value, { shouldValidate: true })} error={vehicleSpecificationErrors.model?.message} label={t("model")} options={models} />

            <SelectAdvanced value={watchSpecs("color")} onChange={(value: CarColor) => setSpecsValue("color", value, { shouldValidate: true })} error={vehicleSpecificationErrors.color?.message} label={t("color")} options={colorOptions} />
            <Button type="submit">{t("next")}</Button>
          </div>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleVehicleDetailsSubmit(handleStep2)}>
          <FormTitle className="mb-4">{t("vehicle_details")}</FormTitle>
          <div className="w-full">
            <Input error={vehicleDetailsErrors.vin?.message} label={t("vin")} type="text" {...registerVehicleDetails("vin")} placeholder="1HGCM82633A123456" />
            <Input error={vehicleDetailsErrors.techPassportNumber?.message} label={t("techPass")} type="text" {...registerVehicleDetails("techPassportNumber")} placeholder="AJA0102033" />
            <Input error={vehicleDetailsErrors.callsign?.message} label={t("licensePlate")} type="text" {...registerVehicleDetails("callsign")} placeholder="AA000AA" />
            {/* <SelectAdvanced value={watchDetails("fuel_type")} onChange={(value: FuelType) => setDetailsValue("fuel_type", value, { shouldValidate: true })} error={vehicleDetailsErrors.fuel_type?.message} label={t("fuel_type")} options={fuelOptions} /> */}
            <div className="flex w-full gap-6">
              <Button type="button" onClick={() => setStep(1)}>
                {t("goBack")}
              </Button>
              <Button loading={isLoading} type="submit">
                {t("end")}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default RegisterCar;
