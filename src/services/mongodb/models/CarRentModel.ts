import { Locale } from "@/i18n/routing";
import mongoose, { Document, Model, Schema, model } from "mongoose";

// ✅ Define TypeScript Interface for Gift
export interface I_CarRent extends Document {
  content: Record<Locale, string>;
  visible: boolean;
  updatedAt: Date;
}

// ✅ Define Mongoose Schema
const CarRentSchema: Schema<I_CarRent> = new Schema(
  {
    content: {
      ka: { type: String, required: true },
      ru: { type: String, required: true },
      tk: { type: String, required: true },
    },
    visible: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
  },
);

const CarRentModel: Model<I_CarRent> = mongoose.models?.CarRent || model<I_CarRent>("CarRent", CarRentSchema);

export default CarRentModel;
