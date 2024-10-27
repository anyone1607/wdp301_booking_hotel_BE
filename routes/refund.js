import express from 'express';
import {
    createRefund,
    getAllRefunds,
    getRefundByBookingId,
    updateRefundStatus,
    getRefundByIdBooking
} from '../Controllers/refundController.js';

const router = express.Router();

router.post('/', createRefund);
router.get('/', getAllRefunds);
router.get('/booking/:id', getRefundByIdBooking); 
router.get('/bookingId/:bookingId', getRefundByBookingId);
router.put('/:refundId', updateRefundStatus);

export default router;
