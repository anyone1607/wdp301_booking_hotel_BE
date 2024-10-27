import express from 'express';
import { sendConfirmationEmail } from '../utils/sendEmail.js'; // Import hàm gửi email

const router = express.Router();

// Route gửi email xác nhận
router.post('/send-confirmation', async (req, res) => {
  const booking = req.body; // Lấy dữ liệu booking từ request body
  try {
    await sendConfirmationEmail(booking); // Gọi hàm gửi email
    res.status(200).json({ message: 'Confirmation email sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send confirmation email.', error: error.message });
  }
});

export default router;
