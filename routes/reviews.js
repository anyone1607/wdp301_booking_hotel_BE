import express from 'express'
import { createReview, getAllReviews } from '../Controllers/reviewController.js'
import { verifyUser } from '../utils/verifyToken.js'

const router = express.Router()

router.post('/:tourId',  createReview)
// Route để lấy tất cả các review
router.get('/',  getAllReviews);

export default router