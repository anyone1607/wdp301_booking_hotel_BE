import Hotel from "../models/Hotel.js";
import Tour from "../models/Tour.js";

// Create a new hotel
export const createHotel = async (req, res) => {
    const newHotel = new Hotel(req.body);
    try {
        const savedHotel = await newHotel.save();
        res.status(200).json(savedHotel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a hotel by ID
export const updateHotel = async (req, res) => {
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedHotel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all hotels
export const getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json(hotels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all hotels by tour ID
export const getAllHotelsByTourId = async (req, res) => {
    try {
        const hotels = await Hotel.find({ tourId: req.params.tourId });
        res.status(200).json(hotels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a hotel by ID
export const getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.status(200).json(hotel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
