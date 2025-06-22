import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  error?: string;
}

const Select: React.FC<SelectProps> = ({ label, options, error, ...props }) => {
  return (
    <label className="block h-24 font-semibold relative text-zinc-800 text-base">
      {label}
      <select className="block w-full font-semibold !h-[44px] text-lg focus:outline-none p-2 mt-1 rounded-md bg-yellow-600 text-zinc-900" {...props}>
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </label>
  );
};

export default Select;
