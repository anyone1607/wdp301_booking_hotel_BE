import express from 'express';
import { deleteUser, getAllUser, getSingleUser, updateUser } from '../Controllers/userController.js';
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js';
import upload from '../middleware/upload.js';
import { banUser } from '../Controllers/userController.js';
const router = express.Router();

// Update user with file upload
router.put('/:id',  upload.single('avatar'), updateUser);

// Delete user
router.delete('/:id', deleteUser);

// Get single user
router.get('/:id',  getSingleUser);

// Get all users
router.get('/',  getAllUser);

// Ban user
router.put('/:id/ban', banUser);

export default router;
