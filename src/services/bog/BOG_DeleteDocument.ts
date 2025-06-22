import BOG_Axios from "./BOG_Axios";
import BOG_GetBussinesToken from "./BOG_GetBussinesToken";

export default async function BOG_DeleteDocument(uniqueKey: string) {
  try {
    const authToken = await BOG_GetBussinesToken();
    if (!authToken) {
      throw new Error("Failed to fetch BOG auth token");
    }

    await BOG_Axios.delete(`/documents/${uniqueKey}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    return true;
  } catch (error: any) {
    console.error(`Failed to delete BOG document ${uniqueKey}:`, error);
    return false;
  }
}
