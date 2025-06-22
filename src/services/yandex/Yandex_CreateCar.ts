import Yandex_Axios from "./Yandex_Axios";

export default async function Yandex_CreateCar(parameters: CreateCarParameters): Promise<string> {
  const idempotencyToken = crypto.randomUUID();

  try {
    const response = await Yandex_Axios.post<RequestResponse>(
      "/v2/parks/vehicles/car",
      { ...parameters, park_profile: { ...parameters.park_profile, status: "working" } },
      {
        headers: { "X-Idempotency-Token": idempotencyToken },
      }
    );

    return response.data.vehicle_id;
  } catch (error: any) {
    console.error("Failed to create Yandex car profile");

    if (error.response) {
      console.error("Response data:", error.response.data.message);
      console.error("Response status:", error.response.status);
    }

    throw new Error(error?.response?.data?.message || "Failed Request. Contact Support");
  }
}

// Types
interface RequestResponse {
  vehicle_id: string;
}

export interface CreateCarParameters {
  park_profile: ParkProfile;
  vehicle_licenses: VehicleLicenses;
  vehicle_specifications: VehicleSpecifications;
  driverId: string;
}

interface ParkProfile {
  callsign: string;
  fuel_type: FuelType;
  status: "working ";
}

interface VehicleLicenses {
  licence_plate_number: string;
}

interface VehicleSpecifications {
  brand: string;
  color: CarColor;
  model: string;
  transmission: Transmission;
  year: number;
}

export type CarColor = "Белый" | "Желтый" | "Бежевый" | "Черный" | "Голубой" | "Серый" | "Красный" | "Оранжевый" | "Синий" | "Зеленый" | "Коричневый" | "Фиолетовый" | "Розовый";

export const ColorArray: CarColor[] = ["Белый", "Желтый", "Бежевый", "Черный", "Голубой", "Серый", "Красный", "Оранжевый", "Синий", "Зеленый", "Коричневый", "Фиолетовый", "Розовый"];

export const FuelTypeArray: FuelType[] = ["petrol", "methane", "propane", "electricity"];

export type FuelType = "petrol" | "methane" | "propane" | "electricity";
export type Transmission = "mechanical" | "automatic" | "robotic" | "variator";
export const TransmissionArray: Transmission[] = ["mechanical", "automatic", "robotic", "variator"];
