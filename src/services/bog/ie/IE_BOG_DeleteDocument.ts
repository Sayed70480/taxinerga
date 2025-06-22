import BOG_Axios from "../BOG_Axios";
import IE_BOG_GetBussinesToken from "./IE_BOG_GetBussinesToken";

export default async function IE_BOG_DeleteDocument(uniqueKey: string) {
  try {
    const authToken = await IE_BOG_GetBussinesToken();
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
