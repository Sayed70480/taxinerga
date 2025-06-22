import { Locale } from "@/i18n/routing";
import mongoose, { Document, Model, Schema, model } from "mongoose";

// ✅ Define TypeScript Interface for Gift
export interface I_Gift extends Document {
  content: Record<Locale, string>;
  visible: boolean;
  updatedAt: Date;
}

// ✅ Define Mongoose Schema
const GiftSchema: Schema<I_Gift> = new Schema(
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

const GiftModel: Model<I_Gift> = mongoose.models?.Gift || model<I_Gift>("Gift", GiftSchema);

export default GiftModel;
