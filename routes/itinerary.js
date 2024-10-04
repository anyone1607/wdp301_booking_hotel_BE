import express from "express";
import {
    createItinerary,
    updateItinerary,
    getAllItineraries,
    getAllItinerariesByTourId,
    deleteItinerariesByTourId
} from '../Controllers/itineraryController.js'
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js'

const router = express.Router();

// Create a new itinerary
router.post("/", createItinerary);

// Update an itinerary by ID
router.put("/:id",  updateItinerary);

// Get all itineraries
router.get("/",  getAllItineraries);

// Get all itineraries by tour ID
router.get("/tour/:tourId", getAllItinerariesByTourId);

router.delete("/:tourId", deleteItinerariesByTourId);



export default router;
