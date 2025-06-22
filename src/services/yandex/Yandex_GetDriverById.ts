import Yandex_Axios from "./Yandex_Axios";

export default async function Yandex_GetDriverById(driverId: string): Promise<DriverByIdInfo | null> {
  try {
    const response = await Yandex_Axios.get("v2/parks/contractors/driver-profile?contractor_profile_id=" + driverId);
    return response.data as DriverByIdInfo;
  } catch (error: any) {
    console.error("Failed to fetch Yandex driver by ID");
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw new Error(error?.response?.data?.message || "Failed Request. Contact Support");
  }
}

export interface DriverByIdInfo {
  account: {
    balance_limit: string;
    work_rule_id: string;
    payment_service_id: string;
    block_orders_on_balance_below_limit: boolean;
  };
  person: {
    full_name: {
      first_name: string;
      last_name: string;
    };
    contact_info: {
      phone: string;
    };
    driver_license: {
      country: string;
      expiry_date: string;
      issue_date: string;
      number: string;
    };
    employment_type: string;
  };
  profile: {
    hire_date: string;
    work_status: string;
    comment: string;
  };
  car_id: string;
  order_provider: {
    platform: boolean;
    partner: boolean;
  };
}
