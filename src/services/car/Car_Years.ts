export interface YearOption {
  label: string;
  value: string;
}

export default function Car_Years() {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: currentYear - 1980 + 1 }, (_, i) => {
    const year = (1980 + i).toString();
    return { label: year, value: year };
  }).reverse();
}
