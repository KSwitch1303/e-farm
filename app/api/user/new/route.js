import { connectDB } from "@/utils/connectDB";
import User from "@/models/user";

export const POST = async (req) => {
  const body = await req.json();
  const { name, publicKey, email } = body;
  console.log("Received data:", { name, publicKey, email });
  try {
    await connectDB();
    const newUser = new User({
      name,
      publicKey,
      email
    });

    await newUser.save();
    return new Response(JSON.stringify(newUser), { status: 201 });

    
  } catch (error) {
    console.log(error);
    return new Response("Failed to create user", { status: 500 });
  }
}