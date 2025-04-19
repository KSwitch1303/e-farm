import { connectDB } from "@utils/connectDB";

import Space from "@models/farmSpace";

export const GET = async (req) => {
  try {
    await connectDB();
    const spaces = await Space.find({}).sort({ createdAt: -1 }).populate("cropNFT");
    return new Response(JSON.stringify(spaces), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to fetch spaces", { status: 500 });
  }
}