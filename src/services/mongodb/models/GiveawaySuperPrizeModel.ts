import mongoose, { Schema, Document, model } from "mongoose";

export interface IGiveawaySuperPrize extends Document {
  name: {
    ka: string;
    ru: string;
    tk: string;
  };
  quantity: number;
}

const GiveawaySuperPrizeSchema = new Schema(
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

export default mongoose.models.GiveawaySuperPrize || model<IGiveawaySuperPrize>("GiveawaySuperPrize", GiveawaySuperPrizeSchema);
