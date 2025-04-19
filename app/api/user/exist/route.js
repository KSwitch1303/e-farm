import { connectDB } from "@utils/connectDB";
import User from "@models/user";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const publicKey = searchParams.get("publicKey");

  if (!publicKey) {
    return new Response("Public key is required", { status: 400 });
  }

  try {
    const userExists = await checkUserExist(publicKey);
    return new Response(JSON.stringify({ exists: userExists }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to check user existence", { status: 500 });
  }
};

const checkUserExist = async (publicKey) => {
  await connectDB();
  const user = await User.findOne({ publicKey });
  return user ? true : false;
}