import RegistrationRuleModel, { I_RegistrationRule } from "../mongodb/models/RegistrationRuleModel";
import Yandex_Axios from "./Yandex_Axios";

export default async function Yandex_CreateDriver(parameters: CreateDriverParameters): Promise<string> {
  const idempotencyToken = crypto.randomUUID();
  const hireDate = new Date().toISOString().split("T")[0]; // ISO 8601 format without timezone
  const registrationRules = await RegistrationRuleModel.findOne<I_RegistrationRule>({});
  if (!registrationRules) {
    throw new Error("Registration Rules not found");
  }
  const { work_rule_id } = registrationRules;
  const body: RequestBody = {
    account: {
      work_rule_id,
    },
    order_provider: { partner: true, platform: true },
    profile: { hire_date: hireDate },
    ...parameters,
  };

  try {
    const response = await Yandex_Axios.post<RequestResponse>("/v2/parks/contractors/driver-profile", body, {
      headers: { "X-Idempotency-Token": idempotencyToken },
    });

    return response.data.contractor_profile_id;
  } catch (error: any) {
    console.error("Failed to create Yandex driver profile");

    // Standardized error handling
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }

    throw new Error(error?.response?.data?.message || "Failed Request. Contact Support");
  }
}

// Types
interface RequestResponse {
  contractor_profile_id: string;
}

interface RequestBody {
  order_provider: OrderProvider;
  person: Person;
  profile: Profile;
  account: Account;
}

interface Account {
  work_rule_id: string;
}

export interface CreateDriverParameters {
  person: Person;
}

interface OrderProvider {
  partner: boolean;
  platform: boolean;
}

interface Person {
  contact_info: ContactInfo;
  driver_license: DriverLicense;
  full_name: FullName;
}

interface Profile {
  hire_date: string;
}

interface ContactInfo {
  phone: string;
}

interface DriverLicense {
  country: string;
  expiry_date: string;
  issue_date: string;
  number: string;
}

interface FullName {
  first_name: string;
  last_name: string;
}
