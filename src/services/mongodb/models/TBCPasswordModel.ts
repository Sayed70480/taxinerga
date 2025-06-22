import mongoose, { Document, Model, Schema, model } from "mongoose";

// ✅ Define TypeScript Interface for TBCPassword
export interface I_TBCPassword extends Document {
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// ✅ Define Mongoose Schema
const TBCPasswordSchema: Schema<I_TBCPassword> = new Schema(
  {
    password: {
      type: String,
      required: true,
      length: 6,
    },
  },
  {
    timestamps: true,
  },
);

const TBCPasswordModel: Model<I_TBCPassword> = mongoose.models?.TBCPassword || model<I_TBCPassword>("TBCPassword", TBCPasswordSchema);

export default TBCPasswordModel;
