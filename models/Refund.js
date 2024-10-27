// models/Refund.js

import mongoose from 'mongoose';

const RefundSchema = new mongoose.Schema({
    bankNumber: {
        type: String,
        required: true,
    },
    bankName: {
        type: String,
        required: true,
    },
    reasons: {
        type: String,
        required: true,
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
        required: true,
    },
    name: {  // Thêm trường name
        type: String,
        required: true,
    }
}, { timestamps: true });

const Refund = mongoose.model('Refund', RefundSchema);
export default Refund;
