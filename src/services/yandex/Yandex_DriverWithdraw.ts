import Yandex_Axios from "./Yandex_Axios";

const PARK_ID = process.env.YANDEX_PARK_ID!;
const API_KEY = process.env.YANDEX_X_API_Key!;
const CLIENT_ID = process.env.YANDEX_X_Client_ID!;

export default async function Yandex_DriverWithdraw(driverProfileId: string, amount: number): Promise<boolean> {
  if (!driverProfileId || amount <= 0) {
    console.error("Invalid parameters for Yandex_DriverWithdraw");
    return false;
  }

  try {
    const idempotencyToken = crypto.randomUUID(); // Ensure request uniqueness

    const requestBody = {
      amount: `-${amount.toFixed(2)}`, // Ensure 2 decimal places
      category_id: "partner_service_manual", // Adjust if necessary
      description: "Driver balance withdrawal",
      driver_profile_id: driverProfileId,
      park_id: PARK_ID,
    };

    const headers = {
      "X-API-Key": API_KEY,
      "X-Client-ID": CLIENT_ID,
      "X-Idempotency-Token": idempotencyToken,
      "Content-Type": "application/json",
    };

    await Yandex_Axios.post("/v2/parks/driver-profiles/transactions", requestBody, { headers });

    
    return true;
  } catch (error: any) {
    console.error("Error in Yandex_DriverWithdraw:", error);
    throw new Error(error?.response?.data?.message || "Failed Request. Contact Support");
  }
}
