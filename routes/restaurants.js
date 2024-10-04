import express from "express";
import {
    createRestaurant,
    updateRestaurant,
    getAllRestaurants,
    getAllRestaurantsByTourId, getRestaurantById
} from "../Controllers/restaurantController.js";
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js'

const router = express.Router();

// Create a new restaurant
router.post("/", createRestaurant);

// Update a restaurant by ID
router.put("/:id",  updateRestaurant);

// Get all restaurants
router.get("/", getAllRestaurants);

// Get all restaurants by tour ID
router.get("/tour/:tourId", getAllRestaurantsByTourId);
router.get("/:id", getRestaurantById);


export default router;
