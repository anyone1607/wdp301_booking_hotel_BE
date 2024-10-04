import User from '../models/User.js';
import path from 'path';

// Update User
export const updateUser = async (req, res) => {
   const id = req.params.id;
   const updateData = { ...req.body };

   if (req.file) {
      const imagePath = 'user_images/' + req.file.filename;  // Đường dẫn tương đối đến ảnh
      updateData.avatar = imagePath;  // Lưu đường dẫn của tệp ảnh
   }

   try {
      const updatedUser = await User.findByIdAndUpdate(id, { $set: updateData }, { new: true });
      res.status(200).json({ success: true, message: 'Successfully updated', data: updatedUser });
   } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update' });
   }
};

// Create new User with file upload
export const createUser = async (req, res) => {
   const newUser = new User(req.body);
   console.log(req.body);
   // if (req.file) {
   //    const imagePath = 'user_images/' + req.file.filename; // Đường dẫn tương đối đến ảnh
   //    newUser.avatar = imagePath; // Lưu đường dẫn của tệp ảnh
   // }

   try {
      const savedUser = await newUser.save();
      res.status(200).json({ success: true, message: 'Successfully created', data: savedUser });
   } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create. Try again!' });
   }
};

// Xóa User
export const deleteUser = async (req, res) => {
   const id = req.params.id;

   try {
      await User.findByIdAndDelete(id);
      res.status(200).json({ success: true, message: 'Successfully deleted' });
   } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete' });
   }
};

// Lấy thông tin User đơn lẻ
export const getSingleUser = async (req, res) => {
   const id = req.params.id;

   try {
      const user = await User.findById(id);
      res.status(200).json({ success: true, message: 'Successfully', data: user });
   } catch (error) {
      res.status(404).json({ success: false, message: 'Not Found' });
   }
};

// Lấy tất cả Users
export const getAllUser = async (req, res) => {
   try {
      const users = await User.find({});
      res.status(200).json({ success: true, message: 'Successfully', data: users });
   } catch (error) {
      res.status(404).json({ success: false, message: 'Not Found' });
   }
};
export const banUser = async (req, res) => {
   const { id } = req.params;
   const { status } = req.body;
   try {
      const updatedUser = await User.findByIdAndUpdate(id, { status }, { new: true });
      if (!updatedUser) return res.status(404).json({ message: 'User not found' });
      res.status(200).json({ success: true, data: updatedUser });
   } catch (error) {
      res.status(400).json({ message: error.message });
   }
};
