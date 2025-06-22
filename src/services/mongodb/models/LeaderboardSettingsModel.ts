// /models/LeaderboardSettings.js
import mongoose from "mongoose";

export type LeaderboardStatus = "started" | "paused" | "finished";

export interface ILeaderboardSettings {
  status: LeaderboardStatus;
  content: {
    ka: string;
    ru: string;
    tk: string;
  };
}


const leaderboardSettingsSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["started", "paused", "finished"],
      required: true,
      default: "paused",
    },
    content: {
      ka: { type: String, required: true },
      ru: { type: String, required: true },
      tk: { type: String, required: true },
    },
  },
  { timestamps: true },
);

export default mongoose.models.LeaderboardSettings || mongoose.model("LeaderboardSettings", leaderboardSettingsSchema);
