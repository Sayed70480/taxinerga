import mongoose, { Document, Model, Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

// ✅ Define TypeScript Interface for SuperAdmin
export interface I_SuperAdmin extends Document {
  username: string;
  password: string;
  createdAt: Date;
}

// ✅ Define Mongoose Schema
const SuperAdminSchema: Schema<I_SuperAdmin> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Hash password before saving
SuperAdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const SuperAdminModel: Model<I_SuperAdmin> = mongoose.models?.SuperAdmin || model<I_SuperAdmin>("SuperAdmin", SuperAdminSchema);

export default SuperAdminModel;
