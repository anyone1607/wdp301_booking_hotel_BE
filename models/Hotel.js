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
  price: { //hotel price
    type: Number,
    required: true
  },
  bedPrice: { // extra bed price
    type: Number,
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Hotel", hotelSchema);
