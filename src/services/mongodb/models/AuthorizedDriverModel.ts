import mongoose, { Document, Model, Schema, model } from "mongoose";

// ✅ Define TypeScript Interface for AuthorizedDriver
export interface I_AuthorizedDriver extends Document {
  phone: string;
  updatedAt: Date;
  createdAt: Date;
}

// ✅ Define Mongoose Schema
const AuthorizedDriverSchema: Schema<I_AuthorizedDriver> = new Schema(
  {
    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const AuthorizedDriverModel: Model<I_AuthorizedDriver> = mongoose.models?.AuthorizedDriver || model<I_AuthorizedDriver>("AuthorizedDriver", AuthorizedDriverSchema);

export default AuthorizedDriverModel;
