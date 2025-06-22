import connectMongo from "@/services/mongodb/connectMongo";
import EditCarRent from "./EditCarRent";
import CarRentModel, { I_CarRent } from "@/services/mongodb/models/CarRentModel";

const AdminCarRent = async () => {
  await connectMongo();

  const carRent = await CarRentModel.findOne<I_CarRent>({});

  const defaultValue = carRent?.content;

  return <EditCarRent defaultChecked={carRent?.visible || false} defaultValue={defaultValue && JSON.parse(JSON.stringify(defaultValue))} />;
};

export default AdminCarRent;
