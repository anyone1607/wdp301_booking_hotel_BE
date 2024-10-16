import mongoose from "mongoose";

const roomCategorySchema = new mongoose.Schema(
    {
        hotelId: {
            type: mongoose.Types.ObjectId,
            ref: "Tour",
            required: true
        },
        // tourId: {
        //     type: mongoose.Types.ObjectId,
        //     ref: "Tour",
        //     required: true
        // },
        roomName: {
            type: String,
            required: true,
        },
        roomPrice: {
            type: Number,
            required: true,
        },
        maxOccupancy: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
        },
        description: {
            type: String,

        },
        status: {
            type: String,
            default: "active",
            enum: ["active", "inactive"],
        },
    },
    { timestamps: true }
);

export default mongoose.model("RoomCategory", roomCategorySchema);
