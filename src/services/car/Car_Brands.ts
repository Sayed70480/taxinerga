import carData from "./car-list.json";

export interface BrandOption {
  label: string;
  value: string;
}

export default function Car_Brands(): BrandOption[] {
  try {
    const items = carData.map((item: { brand: string }) => ({
      label: item.brand,
      value: item.brand,
    }));

    return items;
  } catch  {
    console.error("Failed to load car brands");
    return [];
  }
}
