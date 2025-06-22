import connectMongo from "@/services/mongodb/connectMongo";
import EditAdvertisement from "./EditAdvertisement";
import AdvertisementModel, { I_Advertisement } from "@/services/mongodb/models/AdvertisementModel";

const AdminAd = async () => {
  await connectMongo();

  const ad = await AdvertisementModel.findOne<I_Advertisement>({});

  const defaultValue = ad?.content;
  const defaultChecked = ad?.visible || true;

  return <EditAdvertisement defaultChecked={defaultChecked} defaultValue={defaultValue && JSON.parse(JSON.stringify(defaultValue))} />;
};

export default AdminAd;
