import RoomCategory from '../models/RoomCategory.js';
import Hotel from '../models/Hotel.js';

// Tạo một danh mục phòng mới
export const createRoomCategory = async (req, res) => {
    const { hotelId, roomName, roomPrice, maxOccupancy, quantity, description, status } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!hotelId || !roomName || typeof roomPrice !== 'number' || typeof maxOccupancy !== 'number' || typeof quantity !== 'number') {
        return res.status(400).json({ message: "Tất cả các trường là bắt buộc và phải có kiểu dữ liệu đúng." });
    }

    try {
        const newRoomCategory = new RoomCategory({
            hotelId,
            roomName,
            roomPrice,
            maxOccupancy,
            quantity,
            description,
            status: status || "active",
        });

        await newRoomCategory.save();

        // Populate để lấy tên khách sạn
        const populatedRoomCategory = await RoomCategory.findById(newRoomCategory._id).populate('hotelId', 'title');

        res.status(201).json(populatedRoomCategory);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo danh mục phòng.', error: error.message });
    }
};


// Lấy tất cả các danh mục phòng
export const getAllRoomCategories = async (req, res) => {
    try {
        const roomCategories = await RoomCategory.find().populate('hotelId', 'title'); // Lấy tên hotel

        res.status(200).json(roomCategories);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh mục phòng.', error });
    }
};

// Lấy danh mục phòng theo hotelId
export const getRoomCategoriesByHotelId = async (req, res) => {
    const { hotelId } = req.params;

    try {
        const roomCategories = await RoomCategory.find({ hotelId }).populate('hotelId', 'title');

        if (!roomCategories.length) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục phòng cho khách sạn này.' });
        }

        res.status(200).json(roomCategories);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh mục phòng theo hotelId.', error });
    }
};

// Lấy một danh mục phòng theo ID
export const getRoomCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const roomCategory = await RoomCategory.findById(id).populate('hotelId', 'title');

        if (!roomCategory) {
            return res.status(404).json({ message: 'Danh mục phòng không tồn tại.' });
        }

        res.status(200).json(roomCategory);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh mục phòng theo ID.', error });
    }
};

// Cập nhật danh mục phòng theo ID
export const updateRoomCategory = async (req, res) => {
    const { id } = req.params;
    const { hotelId, roomName, roomPrice, maxOccupancy, quantity, description, status } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!hotelId || !roomName || !roomPrice || !maxOccupancy || !quantity) {
        return res.status(400).json({ message: "Tất cả các trường là bắt buộc." });
    }

    try {
        const updatedRoomCategory = await RoomCategory.findByIdAndUpdate(
            id,
            { hotelId, roomName, roomPrice, maxOccupancy, quantity, description, status },
            { new: true }
        ).populate('hotelId', 'title'); // Populate để lấy tên khách sạn

        if (!updatedRoomCategory) {
            return res.status(404).json({ message: 'Danh mục phòng không tồn tại.' });
        }

        res.status(200).json(updatedRoomCategory);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật danh mục phòng.', error });
    }
};

// Xóa danh mục phòng theo ID
export const deleteRoomCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedRoomCategory = await RoomCategory.findByIdAndDelete(id);

        if (!deletedRoomCategory) {
            return res.status(404).json({ message: 'Danh mục phòng không tồn tại.' });
        }

        res.status(200).json({ message: 'Đã xóa danh mục phòng thành công.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa danh mục phòng.', error });
    }
};
