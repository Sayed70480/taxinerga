import mongoose, { Document, Model, Schema, model } from "mongoose";

export interface IReferalParameters extends Document {
  percentage: number;
  minWithdrawAmount: number;
}

const ReferalParametersSchema = new Schema<IReferalParameters>(
  {
    percentage: { type: Number, required: true },
    minWithdrawAmount: { type: Number, required: true },
  },
  { timestamps: true },
);

const ReferalParametersModel: Model<IReferalParameters> = mongoose.models?.ReferalParameters || model<IReferalParameters>("ReferalParameters", ReferalParametersSchema);

export default ReferalParametersModel;
