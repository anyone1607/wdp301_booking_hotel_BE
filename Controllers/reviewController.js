import Tour from "../models/Tour.js";
import Review from "../models/Review.js";

// Endpoint để tạo review mới
export const createReview = async (req, res) => {
   const tourId = req.params.tourId;
   const newReview = new Review({ ...req.body });

   try {
      const savedReview = await newReview.save();

      // Sau khi tạo review mới, cập nhật mảng reviews của tour
      await Tour.findByIdAndUpdate(tourId, {
         $push: { reviews: savedReview._id }
      });

      res.status(200).json({ success: true, message: "Review submitted", data: savedReview });
   } catch (error) {
      res.status(500).json({ success: false, message: "Failed to submit review" });
   }
};

// Endpoint để lấy tất cả các review
export const getAllReviews = async (req, res) => {
   try {
      const reviews = await Review.find().populate('userId', 'name').populate('tourId', 'title');
      res.status(200).json({ success: true, data: reviews });
   } catch (error) {
      res.status(500).json({ success: false, message: "Failed to get reviews" });
   }
};
