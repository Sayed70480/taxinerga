import { forwardRef, InputHTMLAttributes } from "react";

interface InputDateProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
}

const InputDate = forwardRef<HTMLInputElement, InputDateProps>(({ label, error, onChange, ...props }, ref) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters

    // Automatically insert `/` at correct positions
    if (value.length > 1) value = value.slice(0, 2) + "/" + value.slice(2);
    if (value.length > 4) value = value.slice(0, 5) + "/" + value.slice(5, 9);

    // Handle backspace: Remove `/` if deleting the day or month
    if (event.nativeEvent instanceof InputEvent && event.nativeEvent.inputType === "deleteContentBackward") {
      if (value.length === 3) value = value.slice(0, 2); // Remove `/` when deleting after day
      if (value.length === 6) value = value.slice(0, 5); // Remove `/` when deleting after month
    }

    // Limit input to 10 characters (dd/mm/yyyy)
    value = value.slice(0, 10);

    event.target.value = value; // Ensures correct display while typing

    if (onChange) {
      onChange({
        ...event,
        target: { ...event.target, value }, // Override event target value
      });
    }
  };

  return (
    <label className="relative block h-[102px] text-sm text-black">
      {label}
      <input ref={ref} className="mt-2 block w-full rounded-lg bg-white px-4 py-3 text-base placeholder:text-black focus:outline-none" maxLength={10} {...props} onChange={handleChange} />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </label>
  );
});

InputDate.displayName = "InputDate"; // Required for forwardRef

export default InputDate;
