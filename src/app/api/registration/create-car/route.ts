import { NextRequest, NextResponse } from "next/server";
import { Locale } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import Yandex_CreateCar, { CreateCarParameters } from "@/services/yandex/Yandex_CreateCar";
import { Yandex_AttachCarToDriver } from "@/services/yandex/Yandex_AttachCarToDriver";
import Yandex_GetDriverById from "@/services/yandex/Yandex_GetDriverById";
import { headers } from "next/headers";
import RegistrationRuleModel, { I_RegistrationRule } from "@/services/mongodb/models/RegistrationRuleModel";
import { Ubill_SendSMS } from "@/services/ubill/Ubill_SendSMS";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const headerList = headers();
  const locale = headerList.get("locale") as Locale;
  const t = await getTranslations({ locale });

  try {
    const data: CreateCarParameters = await request.json();
    const driverId = data.driverId;

    // ✅ Call Yandex API to create the driver
    try {
      const carId = await Yandex_CreateCar(data);

      await Yandex_AttachCarToDriver(driverId, carId);

      const driver = await Yandex_GetDriverById(driverId);

      if (!driver) {
        return NextResponse.json({ message: t("registration.driverSuccess") }, { status: 404 });
      }

      const registrationRule = await RegistrationRuleModel.findOne<I_RegistrationRule>({});

      if (registrationRule && registrationRule.notificationPhones && registrationRule.notificationPhones.length > 0) {
        await Ubill_SendSMS({
          numbers: registrationRule.notificationPhones,
          text: `მძღოლმა: ${driver.person.full_name.first_name} ${driver.person.full_name.last_name}, ტელ: ${driver.person.contact_info.phone} დაამატა მანქანა`,
        });
      }

      return NextResponse.json({ message: t("registration.driverSuccess"), phone: driver.person.contact_info.phone });
    } catch (error: any) {
      return NextResponse.json({ message: error?.message }, { status: 400 });
    }
  } catch (error: any) {
    if (error.message) {
      return NextResponse.json({ message: error?.message }, { status: 400 });
    }
    console.error("❌ Error in driver registration:", error);
    return NextResponse.json({ message: t("global.serverError") }, { status: 500 });
  }
}
