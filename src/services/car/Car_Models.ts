import axios from "axios";

export interface ModelOptions {
  label: string;
  value: string;
}

export default async function Car_Models(brand: string): Promise<ModelOptions[]> {
  try {
    const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${brand}?format=json`);

    const items = response.data.Results.map((item: any) => {
      let formattedModel = item.Model_Name.toLowerCase(); // Convert to lowercase
      formattedModel = formattedModel.charAt(0).toUpperCase() + formattedModel.slice(1); // Capitalize first letter

      return {
        label: formattedModel,
        value: formattedModel,
      };
    });

    return items;
  } catch  {
    console.error(`Failed to fetch models for ${brand}`);
    return [];
  }
}
