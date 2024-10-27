import Payment from "../models/Payment.js";
import Refund from "../models/Refund.js";
import Booking from "../models/Booking.js"; // Import mô hình Booking

// Tạo một yêu cầu hoàn tiền (refund)
export const createRefund = async (req, res) => {
    const { bankNumber, bankName, reasons, paymentId, name } = req.body; // Thêm name vào req.body

    try {
        // Kiểm tra xem Payment có tồn tại không
        const payment = await Payment.findById(paymentId).populate('bookingId'); // Populate bookingId từ Payment
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Tạo yêu cầu hoàn tiền mới
        const newRefund = new Refund({
            bankNumber,
            bankName,
            reasons,
            paymentId,
            name, // Gán name cho yêu cầu hoàn tiền
        });

        await newRefund.save();

        // Cập nhật trạng thái của booking từ confirmed sang pending
        await Booking.findByIdAndUpdate(payment.bookingId, { status: 'pending' });

        res.status(201).json({ 
            message: 'Refund request created successfully', 
            refund: newRefund,
            bookingId: payment.bookingId // Trả về bookingId để biết được booking nào đã được cập nhật
        });
    } catch (error) {
        console.error('Error creating refund:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Lấy tất cả các yêu cầu hoàn tiền
export const getAllRefunds = async (req, res) => {
    try {
        // Tìm tất cả các Refund và populate thêm cả trường bookingId từ Payment
        const refunds = await Refund.find()
            .populate({
                path: 'paymentId',
                select: 'bookingId'  // Chỉ chọn trường bookingId từ Payment
            });

        res.status(200).json(refunds);
    } catch (error) {
        console.error('Error fetching refunds:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Lấy các yêu cầu hoàn tiền dựa trên Booking ID
export const getRefundByBookingId = async (req, res) => {
    const { bookingId } = req.params;

    try {
        // Tìm tất cả các khoản thanh toán liên quan đến bookingId
        const payments = await Payment.find({ bookingId });
        const paymentIds = payments.map(payment => payment._id);

        // Tìm các refund liên quan đến những paymentId đã tìm thấy
        const refunds = await Refund.find({ paymentId: { $in: paymentIds } }).populate('paymentId');

        if (refunds.length === 0) {
            return res.status(404).json({ message: 'No refunds found for this booking' });
        }

        res.status(200).json(refunds);
    } catch (error) {
        console.error('Error fetching refunds for booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Cập nhật trạng thái của một yêu cầu hoàn tiền
export const updateRefundStatus = async (req, res) => {
    const { refundId } = req.params;
    const { status } = req.body;

    try {
        const refund = await Refund.findById(refundId);

        if (!refund) {
            return res.status(404).json({ message: 'Refund not found' });
        }

        if (!['pending', 'cancel', 'confirmed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        refund.status = status;
        await refund.save();

        res.status(200).json({ message: 'Refund status updated successfully', refund });
    } catch (error) {
        console.error('Error updating refund status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Lấy yêu cầu hoàn tiền dựa trên Booking ID
export const getRefundByIdBooking = async (req, res) => {
    const { id } = req.params; // Lấy bookingId từ tham số

    try {
        // Tìm tất cả các khoản thanh toán liên quan đến bookingId
        const payments = await Payment.find({ bookingId: id });
        const paymentIds = payments.map(payment => payment._id);

        // Tìm các refund liên quan đến những paymentId đã tìm thấy
        const refunds = await Refund.find({ paymentId: { $in: paymentIds } }).populate('paymentId');

        if (refunds.length === 0) {
            return res.status(404).json({ message: 'No refunds found for this booking' });
        }

        res.status(200).json(refunds);
    } catch (error) {
        console.error('Error fetching refunds for booking ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
