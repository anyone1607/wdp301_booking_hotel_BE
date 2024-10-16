import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
   {
      userId: {
         type: mongoose.Types.ObjectId,
         ref: "User",
         required: true
      },
      roomIds: [{
         type: mongoose.Types.ObjectId,
         ref: "RoomCategory",

      }],
      extraIds: [{
         type: mongoose.Types.ObjectId,
         ref: "Extrafee",

      }],
      hotelId: {
         type: mongoose.Types.ObjectId,
         ref: "Hotel",

      },
      name: {
         type: String,
         required: true
      },
      adult: {
         type: Number,
         required: true
      },
      children: {
         type: Number,
         default: 0
      },
      baby: {
         type: Number,
         default: 0
      },
      phone: {
         type: String,
         required: true
      },
      bookAt: {
         type: Date,
         required: true
      },

      checkOut: {
         type: Date,
         required: true
      },
      roomQuantity: {
         type: Number,
         default: 1
      },
      status: {
         type: String,
         default: 'pending',
         enum: ['pending', 'confirmed', 'cancelled']
      },
      totalAmount: {
         type: Number,
         required: true
      },
   },
   { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
