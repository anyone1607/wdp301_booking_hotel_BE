import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String
    },
    address: {
      type: String
    },
    phone: {
      type: String
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
    },

    role: {
      type: String,
      default: "admin",
    },
    status: {
      type: String,
      default: 'active',
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
