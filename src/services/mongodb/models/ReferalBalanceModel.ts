import mongoose, { Schema, Model, model } from "mongoose";

interface IReferalBalance extends Document {
  driverId: string;
  amount: number;
}

const ReferalBalanceSchema = new Schema<IReferalBalance>(
  {
    driverId: { type: String, required: true },
    amount: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

const ReferalBalanceModel: Model<IReferalBalance> = mongoose.models?.ReferalBalance || model<IReferalBalance>("ReferalBalance", ReferalBalanceSchema);

export default ReferalBalanceModel;
