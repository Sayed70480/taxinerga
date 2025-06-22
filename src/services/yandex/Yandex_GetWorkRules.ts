import Yandex_Axios from "./Yandex_Axios";

const parkId = process.env.YANDEX_PARK_ID!;

export interface YandexWorkRule {
  id: string;
  is_enabled: boolean;
  name: string;
}

interface YandexWorkRulesResponse {
  rules: YandexWorkRule[];
}

export default async function Yandex_GetWorkRules(): Promise<YandexWorkRule[]> {
  try {
    const response = await Yandex_Axios.get<YandexWorkRulesResponse>(`/v1/parks/driver-work-rules`, {
      params: { park_id: parkId },
    });

    return response.data.rules; // Returns an array of work rules
  } catch (error: any) {
    console.error("Failed to fetch Yandex work rules:", error);
    return [];
  }
}
