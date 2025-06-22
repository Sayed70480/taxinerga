import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Locale, routing } from "@/i18n/routing";
import Header from "@/components/header/Header";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { ToastContainer } from "react-toastify";
import connectMongo from "@/services/mongodb/connectMongo";
import { Provider } from "jotai";
import GiftModel, { I_Gift } from "@/services/mongodb/models/GiftModel";
import CarRentModel, { I_CarRent } from "@/services/mongodb/models/CarRentModel";
import Modal from "@/components/functional/Modal";
import ContactModel, { I_Contact } from "@/services/mongodb/models/ContactModel";
import NotificationModel, { I_Notification } from "@/services/mongodb/models/NotificationModel";
import AdvertisementModel, { I_Advertisement } from "@/services/mongodb/models/AdvertisementModel";
import Bottom from "./Bottom";
import { Analytics } from "@vercel/analytics/react";
import localFont from "next/font/local";
import { isUnderMaintenance } from "@/isUnderMaintenance";
import moment from "moment-timezone";
import "moment/locale/ka";

const FontGeorgian = localFont({
  src: [
    {
      path: "../../assets/FiraGO-Regular.ttf",
      weight: "400",
    },

    {
      path: "../../assets/FiraGO-Medium.ttf",
      weight: "500",
    },
    {
      path: "../../assets/FiraGO-SemiBold.ttf",
      weight: "600",
    },
    {
      path: "../../assets/FiraGO-Bold.ttf",
      weight: "700",
    },
    {
      path: "../../assets/FiraGO-Bold.ttf",
      weight: "800",
    },
  ],
});

const FontRussian = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["cyrillic"],
});

export const metadata: Metadata = {
  title: "Taxi Nerga",
  description: "Taxi Nerga",
};

export default async function LocaleLayout({ children, params: { locale } }: { children: React.ReactNode; params: { locale: Locale } }) {
  await connectMongo();

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  let fontClassName = FontGeorgian.className;
  switch (locale) {
    case "ka":
      fontClassName = FontGeorgian.className;
      break;
    case "ru":
      fontClassName = FontRussian.className;
      break;
    case "tk":
      fontClassName = FontRussian.className;
      break;
    default:
      break;
  }

  moment.tz.setDefault("Asia/Tbilisi");
  moment.locale(locale === "ka" ? "ka" : "ru");

  const gift = await GiftModel.findOne<I_Gift>({});
  const carRent = await CarRentModel.findOne<I_CarRent>({});
  const contact = await ContactModel.findOne<I_Contact>({});
  const notification = await NotificationModel.findOne<I_Notification>({});
  const ad = await AdvertisementModel.findOne<I_Advertisement>({});

  const maintenance = await isUnderMaintenance();

  const t = await getTranslations({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`relative bg-white text-black  antialiased ${fontClassName}`}>
        <Analytics />
        <NextIntlClientProvider messages={messages}>
          <Provider>
            {maintenance ? (
              <div className={`bg-gray-100 flex h-screen w-full items-centerjustify-center ${fontClassName}`}>
                <div className="text-center ">
                  <h1 className="text-2xl font-bold">{t("global.maintenance")}</h1>
                  <p className="mt-4 text-lg">
                    {t("global.timeLeft")} <br />
                    <strong className="mt-6 block">{moment(maintenance.endTime).format("HH:mm, DD MMMM YYYY")}</strong>
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Header />
                <ToastContainer toastClassName={`${fontClassName} !font-medium !text-sm`} className={`${fontClassName} !text-sm !font-medium`} theme="dark" position="top-center" />
                <Bottom notification={raw(notification)} contact={raw(contact)} gift={raw(gift)} carRent={raw(carRent)} />
                {ad && ad.visible && <Modal modalName="ad" autoOpen={true} modalId={ad?.updatedAt.toString()} html={ad.content[locale]} />}
                <div className="h-[100dvh] overflow-y-auto pb-14 pt-20">{children}</div>
              </>
            )}
          </Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function raw(data: any) {
  return data ? JSON.parse(JSON.stringify(data)) : null;
}
