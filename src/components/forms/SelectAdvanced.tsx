"use client";
import { useState, useEffect } from "react";
import Select from "react-select";

interface GlobalSelectProps {
  label: string;
  options: { value: string; label: string }[];
  error?: string | null;
  value?: string;
  disabled?: boolean;
  onChange?: (value: any) => void;
  formatOptionLabel?: (option: { value: string; label: string; icon?: any }) => React.ReactNode;
}

const SelectAdvanced = ({ label, options, error, value, onChange, disabled, formatOptionLabel }: GlobalSelectProps) => {
  const [selectOptions, setSelectOptions] = useState(options);

  useEffect(() => {
    setSelectOptions(options);
  }, [options]);

  return (
    <div className="h-[102px]">
      <label className="mb-2 block text-sm text-white">{label}</label>
      <Select
        isDisabled={disabled}
        formatOptionLabel={formatOptionLabel}
        styles={{
          control: (styles) => ({
            ...styles,
            backgroundColor: "#292929",
            borderColor: "#292929",
            padding: "8px 2px",
            borderRadius: "0.375rem",
            boxShadow: "none",
          }),
          option: (styles, { isFocused }) => ({
            ...styles,
            backgroundColor: isFocused ? "#292929" : "transparent",
            color: isFocused ? "#FAFAFA" : "#FAFAFA",
            cursor: "pointer",
          }),
          singleValue: (styles) => ({ ...styles, color: "#FAFAFA", fontSize: "1rem" }),
          input: (styles) => ({ ...styles, color: "#FAFAFA" }),
          placeholder: (styles) => ({ ...styles, color: "#FAFAFA" }),
          dropdownIndicator: (styles) => ({ ...styles, color: "#FAFAFA" }),
          indicatorSeparator: (styles) => ({ ...styles, backgroundColor: "#FAFAFA" }),
          menu: (styles) => ({ ...styles, backgroundColor: "#292929" }),
          menuList: (styles) => ({ ...styles, backgroundColor: "#292929" }),
        }}
        options={selectOptions}
        value={selectOptions.find((option) => option.value === value)}
        onChange={(selectedOption) => onChange?.(selectedOption?.value || "")}
        isSearchable
        placeholder={label}
        classNamePrefix="react-select"
      />
      {error && <p className="mt-1 text-sm font-semibold text-red-600">{error}</p>}
    </div>
  );
};

export default SelectAdvanced;
