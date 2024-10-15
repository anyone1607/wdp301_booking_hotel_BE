import Tour from "../models/Tour.js";
import Location from "../models/Location.js"; // Import model Location
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

export const createTour = async (req, res) => {
  const file = req.file; // Lấy file từ request
  console.log("Received file:", file); // Log file nhận được

  try {
      const { location, ...tourData } = req.body;
      console.log("Tour data:", tourData); // Log dữ liệu tour

      const foundLocation = await Location.findById(location);
      if (!foundLocation) {
          return res.status(404).json({ success: false, message: "Location not found!" });
      }

      let photoUrl = '';
      if (file) {
          const fileUri = getDataUri(file);
          const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
              folder: "users",
          });
          console.log("Cloudinary response:", cloudResponse); // Log phản hồi từ Cloudinary
          photoUrl = cloudResponse.secure_url;
      }

      const newTour = new Tour({
          ...tourData,
          city: foundLocation.city,
          location: foundLocation._id,
          photo: photoUrl
      });

      const savedTour = await newTour.save();
      const populatedTour = await Tour.findById(savedTour._id).populate("location");
      
      res.status(200).json({
          success: true,
          message: "Successfully created",
          data: populatedTour,
      });
  } catch (error) {
      console.error("Error creating tour:", error); // Log lỗi chi tiết
      res.status(500).json({ success: false, message: "Failed to create. Try again!", error: error.message });
  }
};


// Update Tour
export const updateTour = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedTour,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};

// Delete Tour
export const deleteTour = async (req, res) => {
  const id = req.params.id;

  try {
    await Tour.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Successfully deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

// Get single Tour
export const getSingleTour = async (req, res) => {
  const id = req.params.id;

  try {
    const tour = await Tour.findById(id).populate("reviews").populate("location"); // Thêm populate cho location
    res.status(200).json({ success: true, message: "Successfully", data: tour });
  } catch (error) {
    res.status(404).json({ success: false, message: "Not Found" });
  }
};


// Get All Tours
// Get All Tours
export const getAllTour = async (req, res) => {
  try {
    const tours = await Tour.find({}).populate("reviews").populate("location");
    res.status(200).json({
      success: true,
      count: tours.length,
      message: "Successfully",
      data: tours,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: "Not Found" });
  }
};


// Get tour by search
// Get tour by search
export const getTourBySearch = async (req, res) => {
  const city = new RegExp(req.query.city, "i");
  const distance = parseInt(req.query.distance);

  try {
    const tours = await Tour.find({
      city,
      distance: { $gte: distance },
    }).populate("reviews");

    res.status(200).json({ success: true, message: "Successfully", data: tours });
  } catch (error) {
    res.status(404).json({ success: false, message: "Not Found" });
  }
};


// Get featured Tour
export const getFeaturedTour = async (req, res) => {
  try {
    const tours = await Tour.find({ featured: true }).populate("reviews").limit(8);
    res.status(200).json({ success: true, message: "Successfully", data: tours });
  } catch (error) {
    res.status(404).json({ success: false, message: "Not Found" });
  }
};

// Get tour count
export const getTourCount = async (req, res) => {
  try {
    const tourCount = await Tour.estimatedDocumentCount();
    res.status(200).json({ success: true, data: tourCount });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch" });
  }
};

// Get Tours By City
export const getToursByCity = async (req, res) => {
  try {
    const city = req.params.city;
    const tours = await Tour.find({ city: city });

    if (tours.length === 0) {
      return res.status(404).json({ message: 'No tours found in this city' });
    }

    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
