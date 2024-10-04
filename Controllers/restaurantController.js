import Restaurant from "../models/restaurant.js";

// Create a new restaurant
export const createRestaurant = async (req, res) => {
    const newRestaurant = new Restaurant(req.body);
    try {
        const savedRestaurant = await newRestaurant.save();
        res.status(200).json(savedRestaurant);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a restaurant by ID
export const updateRestaurant = async (req, res) => {
    try {
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedRestaurant);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all restaurants
export const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.status(200).json(restaurants);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all restaurants by tour ID
export const getAllRestaurantsByTourId = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ tourId: req.params.tourId });
        res.status(200).json(restaurants);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a restaurant by ID
export const getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.status(200).json(restaurant);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
