import mongoose, { Schema, Document, Model } from "mongoose";

export interface I_RegistrationRule extends Document {
  work_rule_id: string;
  notificationPhones?: string[];
}

const RegistrationRuleSchema: Schema = new Schema({
  work_rule_id: { type: String, required: true, unique: true },
  notificationPhones: { type: [String], required: false },
});

const RegistrationRuleModel: Model<I_RegistrationRule> = mongoose.models.RegistrationRule || mongoose.model<I_RegistrationRule>("RegistrationRule", RegistrationRuleSchema);

export default RegistrationRuleModel;
