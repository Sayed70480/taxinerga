import Yandex_Axios from "./Yandex_Axios";
import { YandexDriverInfo } from "./Yandex_GetDriverByPhone";

export default async function Yandex_TotalDrivers(): Promise<{ drivers: YandexDriverInfo[]; total: number } | null> {
  try {
    let drivers: YandexDriverInfo[] = [];
    let offset = 0;
    const limit = 1000;
    let total = 0;

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

      if (total === 0) total = response.data.total;

      if (fetchedDrivers.length === 0) break;

      drivers = [...drivers, ...fetchedDrivers];
      offset += fetchedDrivers.length;

      if (offset >= response.data.total) break;
    }
    return { drivers, total };
  } catch (error: any) {
    console.error("Failed to fetch Yandex driver by phone");
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw new Error(error?.response?.data?.message || "Failed Request. Contact Support");
  }
}
