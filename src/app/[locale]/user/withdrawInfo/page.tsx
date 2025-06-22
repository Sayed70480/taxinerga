import { auth } from "@/auth";
import Content from "@/components/custom_ui/Content";
import { WithdrawForm } from "@/components/forms/WithdrawForm";
import Balance from "@/components/functional/Balance";
import Routes from "@/config/Routes";
import { redirect } from "@/i18n/routing";
import { SignOut } from "@/services/auth/SignOut";
import connectMongo from "@/services/mongodb/connectMongo";
import WithdrawModel, { I_Withdraw } from "@/services/mongodb/models/WithdrawModel";
import updateWithdrawals from "@/updateWithdrawals";
import { getLocale } from "next-intl/server";
import WithdrawInfo from "./WithdrawInfo";

export default async function WithdrawInfoPage() {
  const locale = await getLocale();
  const session = await auth();
  const driver = session?.user;

  if (!session || !driver) {
    await SignOut();
    redirect({ href: { pathname: Routes.signIn.path }, locale });
    return <h1>UNAOTHORIZED</h1>;
  }

  if (!driver.car || driver.car?.id === "") {
    redirect({ href: { pathname: Routes.registration.path, query: { driverId: driver.driver_profile.id } }, locale });
  }

  await connectMongo();

  await updateWithdrawals();

  const withdrawn = await WithdrawModel.findOne<I_Withdraw>({ driverId: driver.driver_profile.id }).sort({ createdAt: -1 });

  const { iban, bank } = withdrawn || { iban: "", bank: "bog" };

  function formatCallsign(callsign: string) {
    if (!callsign || callsign.length < 5) return callsign;

    const firstPart = callsign.slice(0, 2).toUpperCase();
    const secondPart = callsign.slice(2, 5).toUpperCase();
    const rest = callsign.slice(5).toUpperCase();

    return `${firstPart}-${secondPart}-${rest}`;
  }

  return (
    <main className="flex flex-col px-4">
      <Content>
        <div className="mx-auto flex flex-col gap-4 rounded-lg    bg-gray p-2 px-4 lg:w-[432px] ">
          <div className="flex items-center justify-between">
            <h1 className="text-white">
              {driver.driver_profile.first_name} {driver.driver_profile.last_name}
            </h1>
            <Balance balanceFromYandex={parseFloat(driver.accounts[0].balance)} />
          </div>
          <div className="flex items-center justify-between text-white">
            <p>
              {driver.car.brand} {driver.car.model}
            </p>
            <div className="relative w-fit text-nowrap rounded-lg bg-zinc-100 px-3 py-1 text-xs tracking-wider text-zinc-900">
              <div className="absolute left-0 top-0 h-6 w-1 rounded-l-md bg-blue-700"></div>
              <div className="absolute right-0 top-0 h-6 w-1 rounded-r-md bg-blue-700"></div>
              {formatCallsign(driver.car.callsign)}
            </div>
          </div>
        </div>
      </Content>
      <WithdrawInfo />
      <Content>
        <div className="mx-auto mt-3 w-full rounded-lg bg-gray p-3 px-4 lg:w-fit">
          <WithdrawForm ibanP={iban} bankP={bank} />
        </div>
      </Content>
    </main>
  );
}
