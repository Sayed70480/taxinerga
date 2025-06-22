import connectMongo from "@/services/mongodb/connectMongo";
import DriverLeaderboardModel, { IDriverLeaderboard } from "@/services/mongodb/models/DriverLeaderboardModel";
import LeaderboardSettingsModel, { ILeaderboardSettings } from "@/services/mongodb/models/LeaderboardSettingsModel";
import React from "react";
import EditLeaderboardSettingsForm from "./EditLeaderboardSettingsForm";
import { raw } from "@/app/[locale]/layout";
import EditDriversForm from "./EditDriversForm";

const page = async () => {
  await connectMongo();
  let settings = await LeaderboardSettingsModel.findOne<ILeaderboardSettings>({});
  if (!settings) {
    await LeaderboardSettingsModel.create({
      status: "finished",
      content: {
        ka: "empty",
        ru: "empty",
        tk: "empty",
      },
    });
  }
  settings = await LeaderboardSettingsModel.findOne<ILeaderboardSettings>({});
  if (!settings) {
    return <div>Failed to fetch settings</div>;
  }

  const fakeDrivers = await DriverLeaderboardModel.find<IDriverLeaderboard>({ isFake: true, paused: false }).sort({ currentPoints: -1 });
  const realTopDriver = await DriverLeaderboardModel.findOne({ isFake: false }).sort({ currentPoints: -1 });
  const realTopPoints = realTopDriver?.currentPoints || 0;
  const maxFakePoints = realTopPoints + fakeDrivers.length * 15;
  const minFakePoints = realTopPoints + 5;

  if (fakeDrivers.length > 0 && fakeDrivers[fakeDrivers.length - 1].currentPoints < realTopPoints) {
    const fakeDriversToUpdate = fakeDrivers.filter((driver) => driver.currentPoints < realTopPoints);

    for(let i = 0; i < fakeDriversToUpdate.length; i++) {
      const driver = fakeDriversToUpdate[i];
      const newPoints = Math.floor(Math.random() * (maxFakePoints - minFakePoints + 1)) + minFakePoints;
      await DriverLeaderboardModel.findByIdAndUpdate(driver._id, {
        currentPoints: newPoints,
      });
    }
  }

  const leaderboard = await DriverLeaderboardModel.find<IDriverLeaderboard>({}).sort({ currentPoints: -1 }).limit(20);

  const fakes = await DriverLeaderboardModel.find<IDriverLeaderboard>({ isFake: true });

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <EditLeaderboardSettingsForm settings={raw(settings)} />
      <EditDriversForm fakes={raw(fakes)} leaderboard={raw(leaderboard)} />
    </div>
  );
};

export default page;
