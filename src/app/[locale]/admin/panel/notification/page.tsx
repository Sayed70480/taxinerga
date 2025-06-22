import NotificationModel, { I_Notification } from "@/services/mongodb/models/NotificationModel";
import EditNotification from "./EditNotification";
import connectMongo from "@/services/mongodb/connectMongo";

const AdminNotification = async () => {
  await connectMongo();

  const ntfc = await NotificationModel.findOne<I_Notification>({});

  const defaultValue = ntfc?.content;
  const defaultChecked = ntfc?.visible || true;

  return <EditNotification defaultChecked={defaultChecked} defaultValue={defaultValue && JSON.parse(JSON.stringify(defaultValue))} />;
};

export default AdminNotification;
