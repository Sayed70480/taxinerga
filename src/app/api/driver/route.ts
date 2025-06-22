import connectMongo from "@/services/mongodb/connectMongo";
import AuthorizedDriverModel from "@/services/mongodb/models/AuthorizedDriverModel";

export async function POST(req: Request) {
  try {
    await connectMongo();
    const { phone }: { phone: string } = await req.json();
    const authDriver = await AuthorizedDriverModel.findOneAndUpdate(
      { phone }, // Search condition
      { $set: { updatedAt: new Date() } }, // Always stored in UTC
      { upsert: true, new: true }, // Create if not exists, return updated doc
    );
    return Response.json(authDriver);
  } catch {
    return Response.json({ message: "Problem" }, { status: 400 });
  }
}
