import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: [/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/, "Username must be 8-20 characters long and contain at least one letter and one number"],
  },
  publicKey: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  }
}, { timestamps: true });

const User = models.User || model("User", userSchema);
export default User;