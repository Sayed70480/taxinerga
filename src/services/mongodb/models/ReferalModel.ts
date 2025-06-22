import mongoose, { Document, Model, Schema, model } from "mongoose";

export interface IReferal extends Document {
  inviterDriverId: string;
  invitedDriverId: string;
  inviterPhone: string;
  invitedPhone: string;
  firstName: string;
  lastName: string;
  inviterFirstName:string;
  inviterLastName: string;
}

const ReferalSchema = new Schema<IReferal>(
  {
    inviterDriverId: { type: String, required: true },
    invitedDriverId: { type: String, required: true, unique: true },
    inviterPhone: { type: String, required: true },
    invitedPhone: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    inviterFirstName: { type: String, required: true },
    inviterLastName: { type: String, required: true },
  },
  { timestamps: true },
);

const ReferalModel: Model<IReferal> = mongoose.models.Referal || model<IReferal>("Referal", ReferalSchema);

export default ReferalModel;
