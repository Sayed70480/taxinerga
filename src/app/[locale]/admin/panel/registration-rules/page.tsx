import React from "react";
import connectMongo from "@/services/mongodb/connectMongo";
import RegistrationRuleModel from "@/services/mongodb/models/RegistrationRuleModel";
import Yandex_GetWorkRules, { YandexWorkRule } from "@/services/yandex/Yandex_GetWorkRules";
import EditRegistrationRuleForm from "@/components/admin/forms/EditWorkRuleForm";

const AdminRegistrationRules = async () => {
  await connectMongo();

  const yandexWorkRules: YandexWorkRule[] = await Yandex_GetWorkRules();

  const registrationRule = await RegistrationRuleModel.findOne();

  if (!registrationRule) {
    return <div>Registration Rules not found</div>;
  }

  return (
    <div>
      <p className="text-lg font-semibold text-white">რეგისტრაციის პარამეტრების შეცვლა</p>
      <EditRegistrationRuleForm yandexWorkRules={yandexWorkRules} defaultValues={JSON.parse(JSON.stringify(registrationRule))} />
    </div>
  );
};

export default AdminRegistrationRules;
