import GiftModel, { I_Gift } from "@/services/mongodb/models/GiftModel";
import EditGift from "./EditGift";
import connectMongo from "@/services/mongodb/connectMongo";

const AdminGift = async () => {
  await connectMongo();

  const gift = await GiftModel.findOne<I_Gift>({});

  const defaultValue = gift?.content;

  return <EditGift defaultChecked={gift?.visible || false} defaultValue={defaultValue && JSON.parse(JSON.stringify(defaultValue))} />;
};

export default AdminGift;
