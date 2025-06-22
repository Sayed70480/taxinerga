import mongoose, { Schema, Document, model } from "mongoose";

export interface IGiveawayPrize extends Document {
  name: {
    ka: string;
    ru: string;
    tk: string;
  };
  quantity: number;
}

const GiveawayPrizeSchema = new Schema<IGiveawayPrize>(
  {
    name: {
      ka: { type: String, required: true },
      ru: { type: String, required: true },
      tk: { type: String, required: true },
    },
    quantity: { type: Number, required: true },
  },
  { timestamps: true },
);

export default mongoose.models.GiveawayPrize || model<IGiveawayPrize>("GiveawayPrize", GiveawayPrizeSchema);
