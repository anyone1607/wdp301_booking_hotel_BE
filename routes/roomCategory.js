import express from 'express';
import {
    createRoomCategory,
    getAllRoomCategories,
    getRoomCategoryById,
    updateRoomCategory,
    deleteRoomCategory,
    getRoomCategoriesByHotelId

} from '../Controllers/roomCategoryController.js';
import singleUpload from '../middleware/mutler.js';

const router = express.Router();

// Tạo một danh mục phòng mới
router.post('/',singleUpload, createRoomCategory);

router.get('/hotel/:hotelId', getRoomCategoriesByHotelId);


// Lấy tất cả danh mục phòng
router.get('/', getAllRoomCategories);

// Lấy danh mục phòng theo ID
router.get('/:id', getRoomCategoryById);

// Cập nhật danh mục phòng theo ID
router.put('/:id',singleUpload, updateRoomCategory);

// Xóa danh mục phòng theo ID
router.delete('/:id', deleteRoomCategory);

export default router;
