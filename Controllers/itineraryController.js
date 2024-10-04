import Itinerary from "../models/itinerary.js";
import Tour from "../models/Tour.js";

// Create a new itinerary
export const createItinerary = async (req, res) => {
    const newItinerary = new Itinerary(req.body);
    try {
        const savedItinerary = await newItinerary.save();
        res.status(200).json(savedItinerary);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update an itinerary by ID
export const updateItinerary = async (req, res) => {
    try {
        const updatedItinerary = await Itinerary.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedItinerary);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all itineraries
export const getAllItineraries = async (req, res) => {
    try {
        const itineraries = await Itinerary.find();
        res.status(200).json(itineraries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all itineraries by tour ID
export const getAllItinerariesByTourId = async (req, res) => {
    try {
        const itineraries = await Itinerary.find({ tourId: req.params.tourId });
        res.status(200).json(itineraries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteItinerariesByTourId = async (req, res) => {
    try {
        const itineraries = await Itinerary.deleteMany({ tourId: req.params.tourId });
        res.status(200).json(itineraries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
