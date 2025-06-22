import mongoose, { Schema, Document, model } from "mongoose";
import { IGiveawayPrize } from "./GiveawayPrizeModel";
import { IGiveawaySuperPrize } from "./GiveawaySuperPrizeModel";

export interface IGiveawayDriver extends Document {
  driverId: string;
  phone: string;
  fullName: string;
  chances: number;
  superTickets: number;
  prizes: IGiveawayPrize[];
  superPrizes: IGiveawaySuperPrize[];
}

const GiveawayDriverSchema = new Schema<IGiveawayDriver>(
  {
    driverId: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    chances: { type: Number, required: true, default: 0 },
    superTickets: { type: Number, required: true, default: 0 },
    prizes: [{ type: Schema.Types.ObjectId, ref: "GiveawayPrize" }],
    superPrizes: [{ type: Schema.Types.ObjectId, ref: "GiveawaySuperPrize" }],
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.GiveawayDriver || model<IGiveawayDriver>("GiveawayDriver", GiveawayDriverSchema);
