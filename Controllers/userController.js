import User from "../models/User.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import fs from 'fs';

// Cập nhật người dùng với file tải lên
export const updateUser = async (req, res) => {
   const id = req.params.id;
   const updateData = { ...req.body };
   const file = req.file;
 
   try {
     if (file) {
       const fileUri = getDataUri(file); // Lấy dữ liệu URI từ tệp
       const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
         folder: "users",
       });
       updateData.avatar = cloudResponse.secure_url; // Lưu URL của ảnh đã upload
     }
 
     const updatedUser = await User.findByIdAndUpdate(id, { $set: updateData }, { new: true });
 
     if (!updatedUser) {
       return res.status(404).json({ success: false, message: "User not found" });
     }
 
     res.status(200).json({
       success: true,
       message: "Successfully updated",
       data: updatedUser,
     });
   } catch (error) {
     console.error("Update error:", error);
     res.status(500).json({ success: false, message: "Failed to update user", error: error.message });
   }
 };
 

// Tạo người dùng mới
export const createUser = async (req, res) => {
  const newUser = new User(req.body);

  try {
    const savedUser = await newUser.save();
    res.status(201).json({
      success: true,
      message: "Successfully created user",
      data: savedUser,
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ success: false, message: "Failed to create user. Try again!" });
  }
};

// Xóa người dùng
export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "Successfully deleted user" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};

// Lấy thông tin người dùng đơn lẻ
export const getSingleUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "Successfully retrieved user", data: user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve user" });
  }
};

// Lấy tất cả người dùng
export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, message: "Successfully retrieved users", data: users });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve users" });
  }
};

// Ban người dùng
export const banUser = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User status updated successfully", data: updatedUser });
  } catch (error) {
    console.error("Ban user error:", error);
    res.status(500).json({ success: false, message: "Failed to update user status" });
  }
};
