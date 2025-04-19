import mongoose from "mongoose";

let isConnected = false; // Track the connection status

export const connectDB = async () => {
  console.log("Connecting to database...");
  mongoose.set("strictQuery", true); // Set strictQuery to true  

  if (isConnected) {
    console.log("Database is already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.DB_URL, {
      dbName: "e-farm",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error: ", error);
  }
}