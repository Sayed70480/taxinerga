import mongoose, { Document, Model, Schema, model } from "mongoose";

// ✅ Define TypeScript Interface for OTP
export interface I_ReferalWithdraw extends Document {
  phone: string;
  firstName: string;
  lastName: string;
  amount: number;
  bank: "bog" | "tbc";
  documentNumber: string;
  uniqueKey: string;
  uniqueId: string;
  iban: string;
  driverId: string;
  status: "pending" | "completed" | "rejected";
  bank_account: "ltd" | "ie";
  createdAt: Date;
}

const ReferalWithdrawSchema: Schema<I_ReferalWithdraw> = new Schema(
  {
    documentNumber: { type: String, required: true, unique: true },
    uniqueKey: { type: String, required: true, unique: true },
    uniqueId: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    amount: { type: Number, required: true },
    bank: { type: String, enum: ["bog", "tbc"], required: true },
    bank_account: { type: String, enum: ["ltd", "ie"], required: true },
    iban: { type: String, required: true },
    driverId: { type: String, required: true, ref: "Driver" },
    status: { type: String, enum: ["pending", "completed", "rejected"], default: "pending" },
  },
  {
    timestamps: true,
  },
);

const ReferalWithdrawModel: Model<I_ReferalWithdraw> = mongoose.models?.ReferalWithdraw || model<I_ReferalWithdraw>("ReferalWithdraw", ReferalWithdrawSchema);

export default ReferalWithdrawModel;
