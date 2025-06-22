"use client";

import Modal from "@/components/functional/Modal";
import { Locale } from "@/i18n/routing";
import { I_CarRent } from "@/services/mongodb/models/CarRentModel";
import { I_Contact } from "@/services/mongodb/models/ContactModel";
import { I_Gift } from "@/services/mongodb/models/GiftModel";
import { I_Notification } from "@/services/mongodb/models/NotificationModel";
import { useLocale } from "next-intl";
import { FaBell, FaPhone, FaTaxi } from "react-icons/fa";
import { IoGiftSharp } from "react-icons/io5";

interface Props {
  gift: I_Gift | null;
  carRent: I_CarRent | null;
  contact: I_Contact | null;
  notification: I_Notification | null;
}

const Bottom = ({ gift, carRent, contact, notification }: Props) => {
  const locale: Locale = useLocale() as Locale;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[500] bg-blue-500 ">
      <div className="mx-auto flex h-11 max-w-[500px] items-center justify-evenly">
        {gift && gift.visible && <Modal modalId={gift.updatedAt.toString()} modalName="gift" icon={IoGiftSharp} html={gift.content[locale]} />}
        {carRent && carRent.visible && <Modal modalId={carRent.updatedAt.toString()} modalName="car-rent" icon={FaTaxi} html={carRent.content[locale]} />}
        {contact && <Modal icon={FaPhone} html={contact.content[locale]} />}
        {notification && notification.visible && <Modal modalId={notification.updatedAt.toString()} modalName="notification" icon={FaBell} html={notification.content[locale]} />}
      </div>
    </div>
  );
};

export default Bottom;
