import { Locale } from "@/i18n/routing";
import mongoose, { Document, Model, Schema, model } from "mongoose";

// ✅ Define TypeScript Interface for Gift
export interface I_Contact extends Document {
  content: Record<Locale, string>;
}

// ✅ Define Mongoose Schema
const ContactSchema: Schema<I_Contact> = new Schema(
  {
    content: {
      ka: { type: String, required: true },
      ru: { type: String, required: true },
      tk: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  },
);

const ContactModel: Model<I_Contact> = mongoose.models?.Contact || model<I_Contact>("Contact", ContactSchema);

export default ContactModel;
