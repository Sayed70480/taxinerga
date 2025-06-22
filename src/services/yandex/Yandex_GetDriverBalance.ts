import Yandex_Axios from "./Yandex_Axios";
import { YandexDriverInfo } from "./Yandex_GetDriverByPhone";

export default async function Yandex_GetDriverBalance(phone: string): Promise<number | null> {
  try {
    let drivers: YandexDriverInfo[] = [];
    let offset = 0;
    const limit = 1000;

    while (true) {
      const requestBody = {
        query: {
          park: {
            id: process.env.YANDEX_PARK_ID,
            driver_profile: {
              work_status: ["working", "not_working", "fired"],
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
    const driver = drivers.find((d) => d.driver_profile.phones.includes(phone)) ?? null;
    if (!driver) {
      console.error("Driver not found.");
      return null;
    }
    const balance = driver.accounts[0]?.balance ?? "0";
    return parseFloat(balance);
  } catch (error: any) {
    console.error("Failed to fetch Yandex balance by phone");
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw new Error(error?.response?.data?.message || "Failed Request. Contact Support");
  }
}
