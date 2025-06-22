import BOG_Axios from "./BOG_Axios";
import BOG_GetBussinesToken from "./BOG_GetBussinesToken";

export interface BOGDocumentStatus {
  UniqueId: string;
  UniqueKey: number;
  Status: string;
  BulkLineStatus?: string;
  RejectCode?: number;
  ResultCode: number;
  Match?: number;
}

export default async function BOG_CheckDocumentStatus(keys: number | number[]): Promise<BOGDocumentStatus[] | null> {
  try {
    const authToken = await BOG_GetBussinesToken();
    if (!authToken) {
      throw new Error("Failed to fetch BOG auth token");
    }

    const keyParam = Array.isArray(keys) ? keys.join(",") : keys.toString();

    const response = await BOG_Axios.get(`/documents/statuses/${keyParam}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    return response.data as BOGDocumentStatus[];
  } catch {
    console.error("Failed to check BOG document status:");
    return null;
  }
}
