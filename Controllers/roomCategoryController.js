import RoomCategory from "../models/RoomCategory.js";
import Hotel from "../models/Hotel.js";
import cloudinary from "../utils/cloudinary.js"; // Đảm bảo bạn đã cấu hình Cloudinary đúng
import getDataUri from "../utils/datauri.js";

export const createRoomCategory = async (req, res) => {
  const { roomName, hotelId, roomPrice, maxOccupancy, quantity, description } = req.body;

  // Kiểm tra xem tất cả các trường có được cung cấp không
  if (!roomName || !hotelId || !roomPrice || !maxOccupancy || !quantity || !description || !req.file) {
    return res.status(400).json({ message: "Tất cả các trường là bắt buộc và phải có kiểu dữ liệu đúng." });
  }

  try {
    // Gọi getDataUri với tệp hình ảnh
    const fileUri = getDataUri(req.file); // Đảm bảo req.file đã được multer xử lý
    const cloudinaryResult = await cloudinary.uploader.upload(fileUri.content);

    const newRoomCategory = new RoomCategory({
      roomName,
      hotelId,
      roomPrice,
      maxOccupancy,
      quantity,
      description,
      photo: cloudinaryResult.secure_url // Lưu URL của ảnh
    });

    await newRoomCategory.save();
    return res.status(201).json({ success: true, data: newRoomCategory });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Có lỗi xảy ra khi tạo danh mục phòng." });
  }
};



// Lấy tất cả các danh mục phòng
export const getAllRoomCategories = async (req, res) => {
  try {
    const roomCategories = await RoomCategory.find().populate(
      "hotelId",
      "title"
    ); // Lấy tên hotel

    res.status(200).json(roomCategories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh mục phòng.", error });
  }
};

// Lấy danh mục phòng theo hotelId
export const getRoomCategoriesByHotelId = async (req, res) => {
  const { hotelId } = req.params;

  try {
    const roomCategories = await RoomCategory.find({ hotelId }).populate(
      "hotelId",
      "title"
    );

    if (!roomCategories.length) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy danh mục phòng cho khách sạn này." });
    }

    res.status(200).json(roomCategories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh mục phòng theo hotelId.", error });
  }
};

export const getRoomCategoryById = async (req, res) => {
  try {
    console.log("Fetching room by ID:", req.params.id); // In ra để kiểm tra
    const room = await RoomCategory.findById(req.params.id).populate(
      "hotelId",
      "title"
    ); // Thêm .populate()

    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// Cập nhật danh mục phòng theo ID
export const updateRoomCategory = async (req, res) => {
  const { id } = req.params;
  const {
    hotelId,
    roomName,
    roomPrice,
    maxOccupancy,
    quantity,
    description,
    status,
  } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!hotelId || !roomName || !roomPrice || !maxOccupancy || !quantity) {
    return res.status(400).json({ message: "Tất cả các trường là bắt buộc." });
  }

  try {
    let updatedData = {
      hotelId,
      roomName,
      roomPrice,
      maxOccupancy,
      quantity,
      description,
      status,
    };

    // Nếu có tệp hình ảnh mới, upload và cập nhật URL
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudinaryResult = await cloudinary.uploader.upload(fileUri.content);
      updatedData.photo = cloudinaryResult.secure_url; // Cập nhật URL hình ảnh
    }

    const updatedRoomCategory = await RoomCategory.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    ).populate("hotelId", "title"); // Populate để lấy tên khách sạn

    if (!updatedRoomCategory) {
      return res.status(404).json({ message: "Danh mục phòng không tồn tại." });
    }

    res.status(200).json(updatedRoomCategory);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật danh mục phòng.", error });
  }
};

// Xóa danh mục phòng theo ID
export const deleteRoomCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRoomCategory = await RoomCategory.findByIdAndDelete(id);

    if (!deletedRoomCategory) {
      return res.status(404).json({ message: "Danh mục phòng không tồn tại." });
    }

    res.status(200).json({ message: "Đã xóa danh mục phòng thành công." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa danh mục phòng.", error });
  }
};
