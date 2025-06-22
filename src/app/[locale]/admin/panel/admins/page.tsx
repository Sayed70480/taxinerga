import AdminModel from "@/services/mongodb/models/AdminModel";
import EditAdmins from "./EditAdmins";
import { raw } from "@/app/[locale]/layout";
import connectMongo from "@/services/mongodb/connectMongo";

const AdminsPage = async () => {
  await connectMongo();
  const admins = await AdminModel.find();
  return <EditAdmins admins={raw(admins)} />;
};

export default AdminsPage;
