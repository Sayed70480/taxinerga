import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
  prefix?: string;
  trimBetween?: boolean; // New prop to control space trimming between characters
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, prefix, onChange, trimBetween = false, ...props }, ref) => {
  // Handle input change with optional between-space trimming
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.trim(); // Always trim leading and trailing spaces

    if (trimBetween) {
      value = value.replaceAll(" ", ""); // Remove all spaces inside if enabled
    }

    if (onChange) {
      onChange({
        ...event,
        target: { ...event.target, value }, // Override event target value
      });
    }
  };

  return (
    <label className="relative h-[102px] block text-sm text-black">
      {label}
      <div className="relative">
        {prefix && <p className="absolute left-3 top-1/2 -translate-y-1/2 transform text-base">{prefix}</p>}
        <input ref={ref} className={`bg-white placeholder:text-black mt-2 block w-full rounded-lg px-4 py-3 text-base focus:outline-none ${prefix ? "pl-14" : ""}`} {...props} onChange={handleChange} />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </label>
  );
});

Input.displayName = "Input"; // Required for forwardRef

export default Input;
