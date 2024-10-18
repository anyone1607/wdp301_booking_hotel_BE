import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    //title la name cua hotel
    title: {
      type: String,
      required: true,
      // unique: true,
    },
    hotelPhone: {
      type: Number,
    },
    hotelEmail: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date
    },
    desc: {
      type: String,
      required: true,
    },
    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Review",
      },
    ],

    location: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Location"
      }
    ],
    ///////////////////////////////////////////////////duoi la du lieu thua ko can xoa/////////////////////////////////////////////////////////
    city: {
      type: String,
    },

    distance: {
      type: Number,

    },
    photo: {
      type: String,

    },

    price: {
      type: Number,

    },
    maxGroupSize: {
      type: Number,

    },

    featured: {
      type: Boolean,
      default: false,
    },
    itineraries: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Itinerary",
      },
    ],
    hotels: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Hotel",
      },
    ],
    restaurants: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Restaurant",
      },
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Tour", tourSchema);
