import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    tourId: {
        type: mongoose.Types.ObjectId,
        ref: "Tour",
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Restaurant", restaurantSchema);
