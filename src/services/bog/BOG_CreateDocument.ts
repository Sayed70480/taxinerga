import WithdrawModel from "../mongodb/models/WithdrawModel";
import BOG_Axios from "./BOG_Axios";
import BOG_GetBussinesToken from "./BOG_GetBussinesToken";

function generateGUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function generateDocumentN() {
  return Math.floor(Math.random() * 100000000000000)
    .toString()
    .padStart(16, "0");
}

export default async function BOG_CreateDocument({ amount, iban, firstName, lastName }: { amount: number; iban: string; firstName: string; lastName: string }) {
  try {
    const authToken = await BOG_GetBussinesToken();
    if (!authToken) {
      throw new Error("Failed to fetch BOG auth token");
    }

    let documentN = generateDocumentN();

    // Ensure Unique Document Number
    while (await WithdrawModel.findOne({ documentNumber: documentN })) {
      documentN = generateDocumentN();
    }

    const transactionData = [
      {
        Nomination: `კუთვნილი თანხა`,
        DispatchType: "BULK",
        ValueDate: new Date(),
        UniqueId: generateGUID(),
        Amount: amount,
        DocumentNo: documentN,
        SourceAccountNumber: process.env.BOG_SOURCE_ACCOUNT_NUMBER,
        BeneficiaryAccountNumber: iban,
        BeneficiaryBankCode: "BAGAGE22",
        BeneficiaryInn: "xxxxxxxxxxx",
        BeneficiaryName: `${firstName} ${lastName}`,
        CheckInn: false,
      },
    ];

    const response = await BOG_Axios.post("/documents/domestic", transactionData, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    const { ResultCode, UniqueKey, UniqueId } = response.data[0];

    if (ResultCode !== 0) {
      await BOG_Axios.delete(`/documents/${UniqueKey}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      throw new Error(`BOG Error: ${ResultCode}`);
    }

    return { documentNumber: documentN, uniqueKey: UniqueKey, uniqueId: UniqueId };
  } catch (error: any) {
    console.error("BOG Create Document Error:", error);
    throw new Error(error?.message || "Failed to create BOG document");
  }
}
