import express from "express";
import {
    createHotel,
    updateHotel,
    getAllHotels,
    getAllHotelsByTourId, getHotelById
} from '../Controllers/hotelController.js'
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js'

const router = express.Router();

// Create a new hotel
router.post("/", createHotel);

// Update a hotel by ID
router.put("/:id", updateHotel);

// Get all hotels
router.get("/",  getAllHotels);

// Get all hotels by tour ID
router.get("/tour/:tourId", getAllHotelsByTourId);
router.get("/:id", getHotelById);

export default router;
