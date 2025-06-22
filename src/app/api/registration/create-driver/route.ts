import { NextRequest, NextResponse } from "next/server";
import Yandex_CreateDriver, { CreateDriverParameters } from "@/services/yandex/Yandex_CreateDriver";
import { Locale } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import RegistrationRuleModel, { I_RegistrationRule } from "@/services/mongodb/models/RegistrationRuleModel";
import { Ubill_SendSMS } from "@/services/ubill/Ubill_SendSMS";
import ReferalModel from "@/services/mongodb/models/ReferalModel";
import Yandex_GetDriverById from "@/services/yandex/Yandex_GetDriverById";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const headerList = headers();
  const locale = headerList.get("locale") as Locale;
  const t = await getTranslations({ locale });
  try {
    const { phone, first_name, last_name, country, referal, expiry_date, issue_date, number } = await request.json();

    if (!phone || !first_name || !last_name || !country || !expiry_date || !issue_date || !number) {
      return NextResponse.json({ message: t("registration.missingFields") }, { status: 400 });
    }

    const driverData: CreateDriverParameters = {
      person: {
        contact_info: { phone },
        driver_license: { country, expiry_date, issue_date, number },
        full_name: { first_name, last_name },
      },
    };

    // ✅ Call Yandex API to create the driver
    const contractorProfileId = await Yandex_CreateDriver(driverData);

    const inviterDriver = referal ? await Yandex_GetDriverById(referal) : null;

    if (referal && inviterDriver) {
      await ReferalModel.create({
        inviterDriverId: referal,
        invitedDriverId: contractorProfileId,
        firstName: first_name,
        lastName: last_name,
        inviterPhone: inviterDriver.person.contact_info.phone,
        inviterFirstName: inviterDriver.person.full_name.first_name,
        inviterLastName: inviterDriver.person.full_name.last_name,
        invitedPhone: phone,
      });
    }

    const registrationRule = await RegistrationRuleModel.findOne<I_RegistrationRule>({});

    if (registrationRule && registrationRule.notificationPhones && registrationRule.notificationPhones.length > 0) {
      await Ubill_SendSMS({
        numbers: registrationRule.notificationPhones,
        text: `ახალი მძღოლი დარეგისტრირდა: ${first_name} ${last_name}, ტელ: ${phone}. ${referal ? "რეფერალური ლინკიდან" : ""}`,
      });
    }

    return NextResponse.json({ message: t("registration.driverSuccess"), id: contractorProfileId });
  } catch (error: any) {
    console.error("❌ Error in driver registration:", error);
    if (error.message) {
      return NextResponse.json({ message: error?.message }, { status: 400 });
    }
    return NextResponse.json({ message: t("global.serverError") }, { status: 500 });
  }
}
