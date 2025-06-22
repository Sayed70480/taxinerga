import mongoose, { Schema, Document, Model, model } from "mongoose";



export interface I_MaintenanceTime extends Document {
  startTime: Date;
  endTime: Date;
}

const MaintenanceTimeSchema: Schema = new Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
});

const MaintenanceTimeModel: Model<I_MaintenanceTime> = mongoose.models?.MaintenanceTime || model<I_MaintenanceTime>("MaintenanceTime", MaintenanceTimeSchema);

export default MaintenanceTimeModel;
