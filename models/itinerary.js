import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema({
    tourId: {
        type: mongoose.Types.ObjectId,
        ref: "Tour",
        required: true
    },
    day: {
        type: Number,

    },
    detail: {
        type: String,

    }
}, { timestamps: true });

export default mongoose.model("Itinerary", itinerarySchema);
