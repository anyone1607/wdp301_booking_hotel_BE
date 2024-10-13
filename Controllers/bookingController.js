import Booking from './../models/Booking.js';
import RoomCategory from "../models/RoomCategory.js";
// Create new booking
export const createBooking = async (req, res) => {
   const newBooking = new Booking(req.body);

   try {
      const savedBooking = await newBooking.save();
      // Set a timeout to cancel the booking after 60 seconds
      setTimeout(async () => {
         try {
            await Booking.findByIdAndUpdate(savedBooking._id, { status: 'cancelled' }, { new: true });
            console.log(`Booking ${savedBooking._id} status updated to cancelled`);
         } catch (error) {
            console.error(`Failed to update booking status for ${savedBooking._id}:`, error);
         }
      }, 60000);

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
      const bookings = await Booking.find().sort({ bookAt: -1 }).populate('roomIds', 'roomName'); // Sort by booking date descending
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

export const getAvailableRoomCount = async (req, res) => {
   const { hotelId, bookAt, checkOut } = req.query;

   if (!hotelId || !bookAt || !checkOut) {
      return res.status(400).json({ message: "Missing required parameters." });
   }

   try {
      // Convert string dates to Date objects
      const startDate = new Date(bookAt);
      const endDate = new Date(checkOut);

      // Find all confirmed bookings within the requested date range for the hotel
      const bookings = await Booking.find({
         hotelId: mongoose.Types.ObjectId(hotelId),
         status: 'confirmed',
         $or: [
            { checkOut: { $gt: startDate, $lt: endDate } },
            { bookAt: { $gt: startDate, $lt: endDate } },
            { bookAt: { $lt: startDate }, checkOut: { $gt: endDate } }
         ]
      }).populate('roomIds');

      // Get all room categories for the hotel
      const roomCategories = await RoomCategory.find({ hotelId: hotelId });

      // Create a list of booked room IDs
      const bookedRoomIds = bookings.flatMap(booking => booking.roomIds.map(room => room._id.toString()));

      // Count available rooms
      const availableRoomCounts = roomCategories.map(room => ({
         roomId: room._id,
         roomName: room.roomName,
         availableCount: room.quantity - bookedRoomIds.filter(id => id === room._id.toString()).length
      }));

      return res.status(200).json({
         success: true,
         data: availableRoomCounts,
      });
   } catch (error) {
      console.error("Error fetching available room count:", error);
      return res.status(500).json({ message: "Internal server error." });
   }
};
