import mongoose from "mongoose";
import SuperAdminModel from "./models/SuperAdminModel";
import RegistrationRuleModel from "./models/RegistrationRuleModel";

declare global {
  var mongoose: any;
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectMongo() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then(async (mongoose) => {
      await setupModels();
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectMongo;

async function setupModels() {
  const superAdmin = await SuperAdminModel.findOne({ username: process.env.SUPER_ADMIN_USERNAME });
  if (!superAdmin) {
    await SuperAdminModel.create({
      username: process.env.SUPER_ADMIN_USERNAME,
      password: process.env.SUPER_ADMIN_PASSWORD,
    });
  }
  const existingRegistrationRule = await RegistrationRuleModel.findOne();
  if (!existingRegistrationRule) {
    await RegistrationRuleModel.create({
      work_rule_id: "0f80cd93c8174ad38a26be3dffb3c26a",
      notificationPhones: [],
    });
  }
}
