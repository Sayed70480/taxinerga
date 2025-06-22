import mongoose, { Schema, Document, model } from "mongoose";
import { IGiveawayPrize } from "./GiveawayPrizeModel";

export interface IGiveawaySettings extends Document {
  isEnabled: boolean;
  requiredAmount: number;
  maxTicketsPerDay: number;
  goldenChanceForSuperPrize: number;
  variants: number;
  prizes: IGiveawayPrize[];
  superVariants: number;
  superChances: number;
  superPrize: {
    name: {
      ka: string;
      ru: string;
      tk: string;
    };
    quantity: number;
  };
}

const GiveawaySettingsSchema = new Schema<IGiveawaySettings>(
  {
    isEnabled: { type: Boolean, default: false },
    requiredAmount: { type: Number, required: true },
    maxTicketsPerDay: { type: Number, required: true },
    goldenChanceForSuperPrize: { type: Number, required: true },
    variants: { type: Number, required: true },
    superVariants: { type: Number, required: true },
    superChances: { type: Number, required: true },
    prizes: [{ type: Schema.Types.ObjectId, ref: "GiveawayPrize" }],
    superPrize: { type: Schema.Types.ObjectId, ref: "GiveawaySuperPrize" },
  },
  { timestamps: true },
);

export default mongoose.models.GiveawaySettings || model<IGiveawaySettings>("GiveawaySettings", GiveawaySettingsSchema);
