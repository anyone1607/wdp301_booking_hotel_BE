import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({

  tourId: {
    type: mongoose.Types.ObjectId,
    ref: "Tour",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  hotelPhone: {
    type: Number,
    required: true
  },
  hotelEmail: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date,
  },
  description: {
    type: String,
  }
},
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);

export default mongoose.model("Hotel", hotelSchema);
