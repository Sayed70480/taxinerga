import ContactModel, { I_Contact } from "@/services/mongodb/models/ContactModel";
import EditContact from "./EditContact";
import connectMongo from "@/services/mongodb/connectMongo";

const AdminContact = async () => {
  await connectMongo();

  const contact = await ContactModel.findOne<I_Contact>({});

  const defaultValue = contact?.content;

  return <EditContact defaultValue={defaultValue && JSON.parse(JSON.stringify(defaultValue))} />;
};

export default AdminContact;
