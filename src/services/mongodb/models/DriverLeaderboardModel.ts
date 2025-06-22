// /models/DriverLeaderboard.js
import mongoose from "mongoose";

export interface IDriverLeaderboard {
    _id: string;
    name: string;
    surname: string;
    phone: string | null;
    isFake: boolean;
    currentPoints: number; // fetched periodically or live
    paused: boolean; // override if set
}

const driverLeaderboardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    phone: { type: String, required: false, default: null },
    isFake: { type: Boolean, default: false },
    currentPoints: { type: Number, default: 0 }, // fetched periodically or 
    paused: { type: Boolean, default: false }, // override if set
  },
  { timestamps: true },
);

export default mongoose.models.DriverLeaderboard || mongoose.model("DriverLeaderboard", driverLeaderboardSchema);
