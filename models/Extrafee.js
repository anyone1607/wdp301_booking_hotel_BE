import mongoose from "mongoose";

const extraFeeSchema = new mongoose.Schema(
    {
        hotelId: {
            type: mongoose.Types.ObjectId,
            ref: "Hotel",
            required: true
        },
        extraName: {
            type: String,
            required: true,
        },
        extraPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            default: "active",
            enum: ["active", "inactive"],
        },
    },
    { timestamps: true }
);

export default mongoose.model("Extrafee", extraFeeSchema);