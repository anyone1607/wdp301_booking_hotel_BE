import Booking from './../models/Booking.js';
import RoomCategory from "../models/RoomCategory.js";
import Payment from './../models/Payment.js'; // Import Payment model

// Create new booking
export const createBooking = async (req, res) => {
    const newBooking = new Booking(req.body);

    try {
        const savedBooking = await newBooking.save();

        // Set a timeout to cancel the booking after 60 seconds
        setTimeout(async () => {
            try {
                // Fetch the booking to get booking ID
                const booking = await Booking.findById(savedBooking._id);

                // Find payment details using the booking ID from the booking
                const payment = await Payment.findOne({ bookingId: booking._id }); // Find payment by bookingId



                // If payment status is confirmed, do not cancel
                if (!payment) {
                    // If payment status is not confirmed, cancel the booking
                    await Booking.findByIdAndUpdate(savedBooking._id, { status: 'cancelled' }, { new: true });
                    console.log(`Booking ${savedBooking._id} status updated to cancelled`);

                } else {
                    console.log(`Booking ${savedBooking._id} is confirmed, cancellation aborted.`);
                }
            } catch (error) {
                console.error(`Failed to update booking status for ${savedBooking._id}:`, error);
            }
        }, 60000); // 60 seconds

        res.status(200).json({ success: true, message: "Your tour is booked!", data: savedBooking });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ success: false, message: "Internal server error!" });
    }
};


// Get single booking
export const getBooking = async (req, res) => {
    const { id } = req.params;

    try {
        const booking = await Booking.findById(id).populate('roomIds'); // Changed to roomId
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found!" });
        }
        res.status(200).json({ success: true, message: "Successful!", data: booking });
    } catch (error) {
        console.error("Error fetching booking:", error);
        res.status(500).json({ success: false, message: "Internal server error!" });
    }
};

// Get all bookings
export const getAllBooking = async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ bookAt: -1 }).populate('roomIds', 'roomName').populate('hotelId').populate('extraIds'); // Sort by booking date descending
        res.status(200).json({ success: true, message: "Successful!", data: bookings });
    } catch (error) {
        console.error("Error fetching all bookings:", error);
        res.status(500).json({ success: false, message: "Internal server error!" });
    }
};

// Delete booking
export const deleteBooking = async (req, res) => {
    const { bookingId } = req.params;

    try {
        const deletedBooking = await Booking.findByIdAndDelete(bookingId);

        if (!deletedBooking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.status(204).json({ success: true, message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ success: false, message: 'Failed to delete booking' });
    }
};

// Get all bookings by userId
export const getAllBookingByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const bookings = await Booking.find({ userId }).sort({ bookAt: -1 }); // Sort by booking date descending

        if (!bookings.length) {
            return res.status(404).json({ success: false, message: 'No bookings found for this user' });
        }

        res.status(200).json({ success: true, message: 'Successful!', data: bookings });
    } catch (error) {
        console.error('Error fetching bookings by userId:', error);
        res.status(500).json({ success: false, message: 'Internal server error!' });
    }
};

// Update booking by ID
export const updateBookingById = async (req, res) => {
    const { bookingId } = req.params;

    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { $set: req.body },
            { new: true, runValidators: true } // Added runValidators to validate the updated data
        );

        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.status(200).json({ success: true, message: 'Booking updated successfully', data: updatedBooking });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ success: false, message: 'Failed to update booking' });
    }
};

// Cancel booking by ID
export const cancelBookingById = async (req, res) => {
    const { bookingId } = req.params;

    try {
        const cancelledBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { $set: { status: 'cancelled' } },
            { new: true }
        );

        if (!cancelledBooking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.status(200).json({ success: true, message: 'Booking cancelled successfully', data: cancelledBooking });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ success: false, message: 'Failed to cancel booking' });
    }
};

// ================================================================================================================

export // Lấy tất cả booking với status: confirmed theo hotelId
    const getConfirmedBookingsByHotelId = async (req, res) => {
        try {
            const { hotelId } = req.params; // Lấy hotelId từ params

            // Tìm tất cả booking với status: confirmed theo hotelId
            const confirmedBookings = await Booking.find({
                hotelId: hotelId,
                status: 'confirmed'
            })
            // .populate('roomIds') // Nếu bạn cần thông tin chi tiết về phòng
            //    .populate('userId'); // Nếu bạn cần thông tin người dùng

            res.status(200).json({
                success: true,
                data: confirmedBookings
            });
        } catch (error) {
            console.error("Error fetching confirmed bookings:", error);
            res.status(500).json({
                success: false,
                message: 'Server Error',
                error: error.message
            });
        }
    };


export const getRoomAvailability = async (req, res) => {
    const { hotelId, bookAt, checkOut } = req.params;

    try {
        // Tìm các booking đã tồn tại trong khoảng thời gian này
        const existingBookings = await Booking.find({
            hotelId,
            status: 'confirmed',
            $or: [
                { bookAt: { $lte: checkOut }, checkOut: { $gte: bookAt } } // Trùng lịch
            ]
        });

        // Lấy danh sách phòng từ RoomCategory
        const roomCategories = await RoomCategory.find({ hotelId });

        // Tính toán số lượng phòng còn trống
        const availableRooms = roomCategories.map(room => {
            const bookedCount = existingBookings.reduce((count, booking) => {
                return count + (booking.roomIds.filter(roomId => roomId.toString() === room._id.toString()).length);
            }, 0);

            return {
                roomId: room._id,
                name: room.roomName,
                availableCount: room.quantity - bookedCount
            };
        });

        res.status(200).json({ availableRooms });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi kiểm tra số lượng phòng", error });
    }
};

