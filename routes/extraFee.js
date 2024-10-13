import express from 'express';
import {
    createExtrafee,
    getAllExtrafees,
    getExtrafeeById,
    updateExtrafee,
    deleteExtrafee,
    getExtraFeesByHotelId
} from '../Controllers/extraFeeController.js';

const router = express.Router();

// Tạo một phí phát sinh mới
router.post('/', createExtrafee);

// Lấy tất cả phí phát sinh
router.get('/', getAllExtrafees);

// Lấy phí phát sinh theo ID
router.get('/:id', getExtrafeeById);
router.get('/hotel/:hotelId', getExtraFeesByHotelId);
// Cập nhật phí phát sinh theo ID
router.put('/:id', updateExtrafee);

// Xóa phí phát sinh theo ID
router.delete('/:id', deleteExtrafee);

export default router;
