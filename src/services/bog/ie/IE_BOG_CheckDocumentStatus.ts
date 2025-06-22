
import BOG_Axios from "../BOG_Axios";
import IE_BOG_GetBussinesToken from "./IE_BOG_GetBussinesToken";

export interface BOGDocumentStatus {
  UniqueId: string;
  UniqueKey: number;
  Status: string;
  BulkLineStatus?: string;
  RejectCode?: number;
  ResultCode: number;
  Match?: number;
}

export default async function IE_BOG_CheckDocumentStatus(keys: number | number[]): Promise<BOGDocumentStatus[] | null> {
  try {
    const authToken = await IE_BOG_GetBussinesToken();
    if (!authToken) {
      throw new Error("Failed to fetch BOG auth token");
    }

    const keyParam = Array.isArray(keys) ? keys.join(",") : keys.toString();

    const response = await BOG_Axios.get(`/documents/statuses/${keyParam}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    return response.data as BOGDocumentStatus[];
  } catch (error: any) {
    console.error("Failed to check BOG document status:", error);
    return null;
  }
}
