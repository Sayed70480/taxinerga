import axios from "axios";

const UBILL_API_URL = "https://api.ubill.dev/v1/sms/send";
const UBILL_BRAND_ID = process.env.UBILL_BRAND_ID;
const UBILL_API_KEY = process.env.UBILL_API_KEY;

interface SendSmsParams {
  numbers: string[];
  text: string;
}

export const Ubill_SendSMS = async ({ numbers, text }: SendSmsParams) => {
  if (!UBILL_BRAND_ID || !UBILL_API_KEY) {
    console.error("UBILL_BRAND_ID or UBILL_API_KEY is missing in environment variables.");
    return;
  }

  try {
    const response = await axios.post(
      UBILL_API_URL,
      {
        brandID: Number(UBILL_BRAND_ID),
        numbers,
        text,
        stopList: false,
      },
      {
        headers: {
          key: UBILL_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.smsID;
  } catch (error) {
    console.error("Error sending SMS:", error);
    return null;
  }
};
