import RoomCategory from '../models/RoomCategory.js';

// Tạo một danh mục phòng mới
export const createRoomCategory = async (req, res) => {
    const { hotelId, roomName, roomPrice, maxOccupancy, quantity, description, status } = req.body;

    try {
        const newRoomCategory = new RoomCategory({
            hotelId,
            roomName,
            roomPrice,
            maxOccupancy,
            quantity,
            description,
            status: status || "active", // Mặc định là active nếu không truyền vào
        });

        await newRoomCategory.save();
        res.status(201).json(newRoomCategory);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo danh mục phòng.', error });
    }
};

// Lấy tất cả các danh mục phòng
export const getAllRoomCategories = async (req, res) => {
    try {
        const roomCategories = await RoomCategory.find();
        res.status(200).json(roomCategories);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh mục phòng.', error });
    }
};

// Lấy danh mục phòng theo hotelId
export const getRoomCategoriesByHotelId = async (req, res) => {
    const { hotelId } = req.params;

    try {
        const roomCategories = await RoomCategory.find({ hotelId });

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
        const roomCategory = await RoomCategory.findById(id).exec;

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

    try {
        const updatedRoomCategory = await RoomCategory.findByIdAndUpdate(
            id,
            { hotelId, roomName, roomPrice, maxOccupancy, quantity, description, status },
            { new: true }
        ).exec;

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
