import Content from "@/components/custom_ui/Content";
import { Locale } from "@/i18n/routing";
import { IDriverLeaderboard } from "@/services/mongodb/models/DriverLeaderboardModel";
import { ILeaderboardSettings } from "@/services/mongodb/models/LeaderboardSettingsModel";
import { YandexDriverInfo } from "@/services/yandex/Yandex_GetDriverByPhone";
import { useLocale, useTranslations } from "next-intl";
import React from "react";
import { PiCoinVerticalDuotone } from "react-icons/pi";

interface Props {
  settings: ILeaderboardSettings;
  driverPlace: number;
  leaderboard: IDriverLeaderboard[];
  driver: YandexDriverInfo
  driverPoints: number;
}

const LeaderboardPage = ({ settings, driverPoints,driverPlace, leaderboard, driver }: Props) => {
  const t = useTranslations("leaderboard");
  const locale = useLocale() as Locale;
  return (
    <Content className="mx-auto max-w-[432px]">
      <h1 className="text-center text-lg font-semibold">{t("title")}</h1>
      <div className={`mt-1 flex items-center justify-center gap-1 text-sm`}>
        <div className={`${settings.status === "started" && "bg-emerald-500"} ${settings.status === "paused" && "bg-yellow"} ${settings.status === "finished" && "bg-white"} aspect-square w-2 rounded-full`}></div>
        <span>{t(settings.status)}</span>
      </div>
      <div className="ql-container mt-2">
        <div className="ql-editor !bg-transparent" dangerouslySetInnerHTML={{ __html: settings.content[locale] }}></div>
      </div>
      <div className="mx-auto mt-2 max-h-[40dvh] max-w-[300px] overflow-y-auto">
        {leaderboard.slice(0, 20).map((driver, index) => (
            <div key={index} className={`flex items-center justify-between border-b border-b-gray p-1 ${driverPlace === index + 1 && "bg-emerald-500 bg-opacity-50 rounded-md"}`}>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{index + 1} -</span>
                <span className="text-sm font-semibold">
                  {driver.name[0]}.{driver.surname[0]}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold">{driver.currentPoints >= 0 ? Math.round(driver.currentPoints) : 0}</span>
                <PiCoinVerticalDuotone className="text-yellow" />
              </div>
            </div>
        ))}
        {driverPlace > 20 && (
          <div>
            <div  className={`flex items-center justify-between border-b border-b-gray p-1 bg-emerald-500 bg-opacity-50 rounded-md`}>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  {driver.driver_profile.first_name[0]}.{driver.driver_profile.last_name[0]}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold">{driverPoints >= 0 ? Math.round(driverPoints) : 0}</span>
                <PiCoinVerticalDuotone className="text-yellow" />
              </div>
            </div>
          </div>
        )}
      </div>
    </Content>
  );
};

export default LeaderboardPage;
