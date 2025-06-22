import Yandex_Axios from "./Yandex_Axios";

export interface YandexDriverInfo {
  updated_at: string;
  accounts: Account[];
  car: Car;
  driver_profile: DriverProfile;
  current_status: CurrentStatus;
}

interface Account {
  balance: string;
  balance_limit: string;
  currency: string;
  id: string;
  type: string;
  last_transaction_date: string;
}

interface Car {
  amenities: string[];
  brand: string;
  callsign: string;
  category: string[];
  color: string;
  id: string;
  model: string;
  normalized_number: string;
  number: string;
  registration_cert: string;
  status: string;
  vin: string;
  year: number;
}

interface DriverProfile {
  first_name: string;
  id: string;
  last_name: string;
  phones: string[];
  work_status: string;
}

interface CurrentStatus {
  status: string;
  status_updated_at: string;
}

export default async function Yandex_GetDriverByPhone(phone: string): Promise<YandexDriverInfo | null> {
  try {
    let drivers: YandexDriverInfo[] = [];
    let offset = 0;
    const limit = 500;

    while (true) {
      const requestBody = {
        query: {
          park: {
            id: process.env.YANDEX_PARK_ID,
            driver_profile: {
              work_status: ["working", "fired", "not_working"],
            },
          },
        },
        offset,
        limit,
      };

      const response = await Yandex_Axios.post("/v1/parks/driver-profiles/list", requestBody);
      const fetchedDrivers = response.data.driver_profiles || [];

      if (fetchedDrivers.length === 0) break;

      drivers = [...drivers, ...fetchedDrivers];
      offset += fetchedDrivers.length;

      if (offset >= response.data.total) break;
    }
    return drivers.find((d) => d.driver_profile.phones.includes(phone)) ?? null;
  } catch (error: any) {
    console.error("Failed to fetch Yandex driver by phone");
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw new Error(error?.response?.data?.message || "Failed Request. Contact Support");
  }
}
