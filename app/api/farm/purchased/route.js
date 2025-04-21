import { connectDB } from "@utils/connectDB";

import Space from "@models/farmSpace";



const updateSpace = async (id, metadata, nftURI, publicKey) => {
  const dateNow = new Date();
  try {
    const space = await Space.findById(id);
    if (!space) throw new Error("Space not found");
    space.cropType = metadata.type;
    space.cropNFT = nftURI;
    space.occupied = true;
    space.owner = publicKey;
    space.plantingDate = dateNow.toISOString().split('T')[0];
    space.growthDuration = metadata.growthDuration;
    await space.save();
    return space;
  }
  catch (error) {
    console.error("Error updating space:", error);
    throw error;
  }
}

export const POST = async (req) => {
  const { id, metadata, nftURI, publicKey } = await req.json();
  console.log("id", id);
  console.log("metadata", metadata);
  console.log("nftURI", nftURI);
  console.log("publicKey", publicKey);
  await connectDB();
  
  const updatedSpace = await updateSpace(id, metadata, nftURI, publicKey);
  return new Response(JSON.stringify(updatedSpace), { status: 200 });
}