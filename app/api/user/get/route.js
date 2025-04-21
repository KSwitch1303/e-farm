import { connectDB } from "@utils/connectDB";
import User from "@models/user";
export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const publicKey = searchParams.get("publicKey");

  
}