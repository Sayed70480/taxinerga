"use client";
import { useEffect, useState } from "react";
import countries from "i18n-iso-countries";
import Select from "react-select";

interface CountrySelectProps {
  label: string;
  error?: string | null;
  locale: string;
  value?: string;
  onChange?: (value: string) => void;
}

const CountrySelect = ({ label, error, locale, value, onChange }: CountrySelectProps) => {
  const [countryOptions, setCountryOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const loadCountryData = async () => {
      try {
        const countryLocale = await import(`i18n-iso-countries/langs/${locale}.json`);
        countries.registerLocale(countryLocale);

        const countryNames = countries.getNames(locale) || {};
        const options = Object.entries(countryNames).map(([code, name]) => ({
          value: countries.alpha2ToAlpha3(code)?.toLowerCase() || code.toLowerCase(), // 3-letter code
          label: name, // Localized country name
        }));

        setCountryOptions(options);
      } catch (error) {
        console.error("Error loading country data:", error);
      }
    };

    loadCountryData();
  }, [locale]);

  return (
    <div className="h-[102px]">
      <label className="block text-white text-sm mb-2">{label}</label>
      <Select
        styles={{
          control: (styles) => ({ ...styles, backgroundColor: "#292929", borderColor: "#292929", padding: "4px", borderRadius: "0.375rem", boxShadow: "none" }),
          option: (styles, { isFocused }) => ({ ...styles, backgroundColor: isFocused ? "#292929" : "transparent", color: isFocused ? "#FAFAFA" : "#FAFAFA", cursor: "pointer" }),
          singleValue: (styles) => ({ ...styles, color: "#FAFAFA", fontSize: "1rem" }),
          input: (styles) => ({ ...styles, color: "#FAFAFA" }),
          placeholder: (styles) => ({ ...styles, color: "#FAFAFA" }),
          dropdownIndicator: (styles) => ({ ...styles, color: "#FAFAFA" }),
          indicatorSeparator: (styles) => ({ ...styles, backgroundColor: "#FAFAFA" }),
          menu: (styles) => ({ ...styles, backgroundColor: "#292929" }),
          menuList: (styles) => ({ ...styles, backgroundColor: "#292929" }),
        }}
        options={countryOptions}
        value={countryOptions.find((option) => option.value === value)}
        onChange={(selectedOption) => onChange?.(selectedOption?.value || "")}
        isSearchable
        placeholder={label}
        classNamePrefix="react-select"
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CountrySelect;
