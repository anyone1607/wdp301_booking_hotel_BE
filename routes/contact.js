// routes/contact.js
import express from "express";
import {
  createMessage,
  getMessages,
  deleteMessage,
} from "../controllers/contactController.js";
import { sendReply } from "../utils/sendEmail.js";
import Contact from "../models/contact.js"; // Đảm bảo rằng bạn sử dụng đúng mô hình

const router = express.Router();

// Tạo một tin nhắn mới
router.post("/", createMessage);

// Lấy tất cả tin nhắn
router.get("/", getMessages);

// Xóa một tin nhắn theo ID
router.delete("/:id", deleteMessage);

// Gửi phản hồi cho một tin nhắn
router.post("/reply", async (req, res) => {
  const { contactId, replyMessage } = req.body;
  try {
    // Tìm contact dựa trên contactId
    const contact = await Contact.findById(contactId); // Giả sử bạn có mô hình Contact
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    // Gọi hàm gửi phản hồi
    await sendReply(contact, replyMessage);
    res.status(200).json({ message: "Reply sent successfully" });
  } catch (error) {
    console.error("Error sending reply:", error);
    res.status(500).json({ error: "Failed to send reply" });
  }
});

export default router;
