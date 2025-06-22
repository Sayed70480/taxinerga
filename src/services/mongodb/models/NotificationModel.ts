import { Locale } from "@/i18n/routing";
import mongoose, { Document, Model, Schema, model } from "mongoose";

// ✅ Define TypeScript Interface for Gift
export interface I_Notification extends Document {
  content: Record<Locale, string>;
  visible: boolean;
  updatedAt: Date;
}

// ✅ Define Mongoose Schema
const NotificationSchema: Schema<I_Notification> = new Schema(
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

const NotificationModel: Model<I_Notification> = mongoose.models?.Notification || model<I_Notification>("Notification", NotificationSchema);

export default NotificationModel;
