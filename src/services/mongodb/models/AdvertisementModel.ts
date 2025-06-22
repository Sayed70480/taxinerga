import { Locale } from "@/i18n/routing";
import mongoose, { Document, Model, Schema, model } from "mongoose";

// ✅ Define TypeScript Interface for Gift
export interface I_Advertisement extends Document {
  content: Record<Locale, string>;
  visible: boolean;
  updatedAt: Date;
}

// ✅ Define Mongoose Schema
const AdvertisementSchema: Schema<I_Advertisement> = new Schema(
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

const AdvertisementModel: Model<I_Advertisement> = mongoose.models?.Advertisement || model<I_Advertisement>("Advertisement", AdvertisementSchema);

export default AdvertisementModel;
