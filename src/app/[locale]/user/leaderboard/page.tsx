import { auth } from "@/auth";
import connectMongo from "@/services/mongodb/connectMongo";
import DriverLeaderboardModel, { IDriverLeaderboard } from "@/services/mongodb/models/DriverLeaderboardModel";
import LeaderboardSettingsModel, { ILeaderboardSettings } from "@/services/mongodb/models/LeaderboardSettingsModel";
import React from "react";
import LeaderboardPage from "./LeaderboardPage";

const page = async () => {
  await connectMongo();
  const session = await auth();
  const driver = session?.user;
  if (!session || !driver) {
    return <h1>UNAOTHORIZED</h1>;
  }

  const settings = await LeaderboardSettingsModel.findOne<ILeaderboardSettings>();

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


  const leaderboard = await DriverLeaderboardModel.find<IDriverLeaderboard>({}).sort({ currentPoints: -1 });
  const driverPlace = leaderboard.findIndex((item) => item.phone === driver.driver_profile.phones[0]) + 1;
  const driverPoints = leaderboard.find((item) => item.phone === driver.driver_profile.phones[0])?.currentPoints;
  if (!settings) {
    return <div>Loading...</div>;
  }
  return <LeaderboardPage driverPoints={driverPoints || 0} driver={driver} settings={settings} leaderboard={leaderboard} driverPlace={driverPlace} />;
};

export default page;
