import Location from "../models/Location.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
// api done
export const createLocation = async (req, res) => {
    const file = req.file;
    console.log("Received file:", file);
    try {
        const { ...locationData } = req.body;
        let photoUrl = "";
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                folder: "users",
            });
            console.log("Cloudinary response:", cloudResponse);
            photoUrl = cloudResponse.secure_url;
        }
        const newLocation = new Location({
            ...locationData,
            photo: photoUrl,
        });
        console.log("New location data:", newLocation);
        const savedLocation = await newLocation.save();
        res.status(200).json({
            success: true,
            message: "Successfully created location",
            data: savedLocation,
        });
    } catch (err) {
        console.error("Error while creating location:", err);
        res.status(500).json({
            success: false,
            message: "Failed to create location",
            error: err.message,
        });
    }
};
// api done
export const getAllLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).json(locations);
    } catch (err) {
        res.status(500).json(err);
    }
};
// api done
export const updateLocation = async (req, res) => {
    try {
        const updatedLocation = await Location.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedLocation);
    } catch (err) {
        res.status(500).json(err);
    }
};
// api done
export const deleteLocation = async (req, res) => {
    try {
        await Location.findByIdAndDelete(req.params.id);
        res.status(200).json("Location has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
};

// api active inactive theo status update 30/10/2024
export const updateLocationStatus = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) return res.status(404).json({ message: 'Location not found' });

        location.status = location.status === "active" ? "inactive" : "active";
        await location.save();

        res.status(200).json({ message: "Location status updated", status: location.status });
    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error });
    }
};
