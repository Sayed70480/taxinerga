"use client";
import { useState } from "react";
import { BiSolidPhoneCall } from "react-icons/bi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useTranslations } from "next-intl";
import { FaWhatsapp } from "react-icons/fa";

const Contact = () => {
  const t = useTranslations("global.contact");
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="rounded-full border-[2px] border-white bg-yellow-500 bg-opacity-80 p-3">
        <BiSolidPhoneCall onClick={() => setOpen(true)} className="animate__animated animate__slow animate__infinite animate__heartBeat m-auto text-2xl text-zinc-900" />
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[899] flex items-center justify-center bg-black/50 backdrop-blur-md" // ✅ Backdrop Blur
          onClick={() => setOpen(false)} // ✅ Click outside to close
        >
          {/* Contact Box */}
          <div
            className="relative w-[300px] rounded-lg border border-yellow-700 bg-zinc-900 p-4"
            onClick={(e) => e.stopPropagation()} // ✅ Prevent closing when clicking inside
          >
            {/* Close Button */}
            <AiOutlineCloseCircle onClick={() => setOpen(false)} className="absolute right-2 top-2 cursor-pointer text-2xl text-white" />

            {/* Contact Title */}
            <p className="mb-4 mt-4 text-center text-lg text-zinc-100">{t("contact")}</p>

            {/* Mobile Contact */}
            <div className="flex flex-col justify-center gap-1">
              <span>{t("mobile")}</span>
              <a target="_blank" href="tel:+995558137739" className="flex items-center gap-2 text-center text-lg text-yellow-500">
                <BiSolidPhoneCall /> +995 558 13 77 39
              </a>
            </div>

            {/* WhatsApp Contact */}
            <div className="mt-3 flex flex-col justify-center gap-1">
              <span>{t("whatsapp")}</span>
              <a target="_blank" href="https://wa.me/995558137739" className="flex items-center gap-2 text-center text-lg text-yellow-500">
                <FaWhatsapp /> +995 558 13 77 39
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Contact;
