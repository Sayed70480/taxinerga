import mongoose, { Schema, Document, Model } from "mongoose";

export interface TimeCommissionRule {
  from: string; // "HH:mm"
  to: string; // "HH:mm"
  commission: number;
}

export interface I_WithdrawStruct extends Document {
  bog_account: "ltd" | "individualEntrepreneur";
  fixed_commission: number;
  firstFreeWithdraw: boolean;
  notificationPhones?: string[];
  notificationPhonesTBC?: string[];
  timeCommissionRules?: TimeCommissionRule[];
}

const TimeCommissionRuleSchema = new Schema<TimeCommissionRule>(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    commission: { type: Number, required: true },
  },
  { _id: false },
);

const WithdrawStructSchema: Schema = new Schema(
  {
    bog_account: {
      type: String,
      enum: ["ltd", "individualEntrepreneur"],
      required: true,
      default: "ltd",
    },
    fixed_commission: {
      type: Number,
      required: true,
      default: 0.5,
    },
    firstFreeWithdraw: {
      type: Boolean,
      required: true,
      default: true,
    },
    notificationPhones: { type: [String], required: false },
    notificationPhonesTBC: { type: [String], required: false },
    timeCommissionRules: {
      type: [TimeCommissionRuleSchema],
      required: false,
      default: [],
    },
  },
  { timestamps: true },
);

const WithdrawStructModel: Model<I_WithdrawStruct> = mongoose.models.WithdrawStruct || mongoose.model<I_WithdrawStruct>("WithdrawStruct", WithdrawStructSchema);

export default WithdrawStructModel;
