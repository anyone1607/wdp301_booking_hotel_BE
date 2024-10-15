import Location from "../models/Location.js";
// api done
export const createLocation = async (req, res) => {
    const location = new Location(req.body);
    try {
        const savedLocation = await location.save();
        res.status(200).json(savedLocation);
    } catch (err) {
        res.status(500).json(err);
    }
}
// api done
export const getAllLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).json(locations);
    } catch (err) {
        res.status(500).json(err);
    }
}
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
}
// api done
export const deleteLocation = async (req, res) => {
    try {
        await Location.findByIdAndDelete(req.params.id);
        res.status(200).json("Location has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
}
