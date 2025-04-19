import { connectDB } from "@utils/connectDB";

import Space from "@models/farmSpace";

export const GET = async (req, {params}) => {
  let filteredSpaces
  try {
    console.log("Fetching spaces...");
    await connectDB();
    
    const { space } = await params; // Extract space from params
    if (!space) {
      return new Response("Space parameter is missing", { status: 400 });
    }
    console.log("Space parameter:", space);
    const spaces = await Space.find({}).sort({ createdAt: -1 }).populate("cropNFT");
    // console.log(spaces);
    for (let i = 0; i < spaces.length; i++) {
      // console.log(spaces[i].code);
      if (spaces[i]._id == space) {
        // console.log("Found matching space:", spaces[i]);
        filteredSpaces = spaces[i];
      }
    }
    
    // const filteredSpaces = spaces.filter((spaceItem) => {console.log(spaceItem.code); spaceItem.code == space});
    
    if (filteredSpaces.length === 0) {
      return new Response("No spaces found", { status: 409 });
    }

    return new Response(JSON.stringify(filteredSpaces), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to fetch spaces", { status: 500 });
  }
}