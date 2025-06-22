import { useState, forwardRef } from "react";

interface MultiInputProps {
  label: string;
  values?: string[];
  onChange?: (values: string[]) => void;
  errors?: any;
}

const MultiInput = forwardRef<HTMLInputElement, MultiInputProps>(({ label, values = [], onChange, errors }, ref) => {
  const [entries, setEntries] = useState<string[]>(values);

  const handleChange = (index: number, value: string) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = value.trim();
    setEntries(updatedEntries);
    onChange?.(updatedEntries);
  };

  const handleAdd = () => {
    setEntries([...entries, ""]);
  };

  const handleRemove = (index: number) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
    onChange?.(updatedEntries);
  };

  return (
    <div className="block h-auto text-base font-semibold">
      <label className="text-white">{label}</label>
      <div className="mt-2 space-y-2 text-darkGray">
        {entries.map((entry, index) => (
          <div key={index} className="relative">
            <div className="flex items-center">
              <input ref={index === entries.length - 1 ? ref : null} value={entry} onChange={(e) => handleChange(index, e.target.value)} className="bg-darkGray placeholder:text-placeholder text-white block w-full rounded-md p-2 text-lg font-semibold focus:outline-none" />

              <button type="button" onClick={() => handleRemove(index)} className="ml-2 rounded bg-red-600 px-2 py-1 text-white">
                ✕
              </button>
            </div>
            {Boolean(errors && errors[index]) && <p className="w-full text-sm text-red-600">{errors[index].message}</p>}
          </div>
        ))}
        <button type="button" onClick={handleAdd} className="mt-2 w-full rounded bg-green-600 py-1 font-semibold text-white">
          + დამატება
        </button>
      </div>
    </div>
  );
});

MultiInput.displayName = "MultiInput";

export default MultiInput;
