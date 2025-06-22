import Yandex_Axios from "./Yandex_Axios";

const parkId = process.env.YANDEX_PARK_ID!;
export async function Yandex_AttachCarToDriver(driverProfileId: string, carId: string): Promise<void> {
  try {
    await Yandex_Axios.put("/v1/parks/driver-profiles/car-bindings", null, {
      params: { driver_profile_id: driverProfileId, car_id: carId, park_id: parkId },
    });
  } catch (error: any) {
    console.error("Failed to attach car to driver");
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw new Error(error?.response?.data?.message || "Failed Request. Contact Support");
  }
}
