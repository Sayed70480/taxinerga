import mongoose, { Document, Model, Schema, model } from "mongoose";

// ✅ Define TypeScript Interface for OTP
export interface I_Otp extends Document {
  phone: string;
  otp: string;
  createdAt: Date;
}

// ✅ Define Mongoose Schema
const OtpSchema: Schema<I_Otp> = new Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
      length: 6,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600,
    },
  },
  {
    timestamps: true,
  }
);

const OtpModel: Model<I_Otp> = mongoose.models?.Otp || model<I_Otp>("Otp", OtpSchema);

export default OtpModel;
