import mongoose, { Document, Model, Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

// ✅ Define TypeScript Interface
export interface I_Admin extends Document {
  username: string;
  password: string;
  createdAt: Date;
}

// ✅ Define Mongoose Schema
const AdminSchema: Schema<I_Admin> = new Schema(
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
  },
);

// ✅ Hash password before saving
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const AdminModel: Model<I_Admin> = mongoose.models?.Admin || model<I_Admin>("Admin", AdminSchema);

export default AdminModel;
