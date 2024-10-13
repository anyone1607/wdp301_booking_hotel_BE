import express from "express";
import {
    createBooking,
    getAllBooking,
    getBooking,
    deleteBooking,
    getAllBookingByUserId,
    updateBookingById,
    cancelBookingById,
    getAvailableRoomCount
} from "../Controllers/bookingController.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/:id", getBooking);
router.get("/", getAllBooking);
router.delete("/:bookingId", deleteBooking);
router.get("/user/:userId", getAllBookingByUserId);
router.put("/:bookingId", updateBookingById);
router.put("/cancel/:bookingId", cancelBookingById);
router.get("/availableRoomCount", getAvailableRoomCount);


export default router;
