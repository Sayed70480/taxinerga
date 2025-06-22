"use client";
import Geo from "@/assets/georgia.png";
import Turk from "@/assets/turkmenistan.png";
import Rus from "@/assets/russia.png";
import { useLocale, useTranslations } from "next-intl";
import { Locale, locales, usePathname, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

const LangSwitch = ({className}:{className?:string}) => {
  const locale: Locale = useLocale() as Locale;
  const t = useTranslations("global.languages");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  // Get the correct flag for the current locale
  const getFlag = (locale: Locale) => {
    switch (locale) {
      case "tk":
        return Turk;
      case "ru":
        return Rus;
      case "ka":
      default:
        return Geo;
    }
  };

  const localeOptions = locales
    .filter((l) => l !== locale)
    .map((l) => ({
      value: l,
      label: t(l),
      flag: getFlag(l),
    }));

  const changeLocale = (nextLocale: Locale) => {
    setOpen(false);
    router.replace(
      // @ts-expect-error -- Ignore
      { pathname, params },
      { locale: nextLocale },
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative w-[128px] lg:w-[150px] ${className}`}>
      <div onClick={() => setOpen((prev) => !prev)} className={`cursor-pointer border-2 border-blue-500 border-b-0 bg-white p-1 pl-2 ${open ? "rounded-t-md" : "rounded-md"}`}>
        <div className="flex items-center gap-2 text-black lg:text-xl">
          <Image className="w-5 lg:w-6" priority quality={100} src={getFlag(locale)} alt={locale} />
          <p>{t(locale)}</p>
        </div>
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full rounded-b-md bg-white border-2 border-blue-500 border-t-0">
          {localeOptions.map((option, index) => (
            <div key={option.value} className={`hover:bg-yellow-500 flex cursor-pointer items-center gap-2 px-2 py-1 text-black  lg:text-xl ${index === localeOptions.length - 1 && "rounded-b-md"}`} onClick={() => changeLocale(option.value)}>
              <Image className="w-5 lg:w-6" priority quality={100} src={option.flag} alt={option.value} />
              <p className="select-none">{option.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LangSwitch;
