import moment from "moment";
import MaintenanceTimeModel, { I_MaintenanceTime } from "./services/mongodb/models/MaintenanceTimeModel";

export async function isUnderMaintenance(): Promise<false | I_MaintenanceTime> {
  try {
    const maintenanceTime = await MaintenanceTimeModel.findOne();
    if (!maintenanceTime) return false;

    const now = moment().utc();
    const startTime = moment(maintenanceTime.startTime).utc();
    const endTime = moment(maintenanceTime.endTime).utc();


    return now.isBetween(startTime, endTime, undefined, "[]") ? maintenanceTime : false;
  } catch (error) {
    console.error("Error checking maintenance status:", error);
    return false;
  }
}
