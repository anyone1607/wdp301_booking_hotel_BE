import express from 'express';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hàm gửi email xác nhận
const sendConfirmationEmail = async (booking) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const templatePath = path.join(__dirname, 'emailTemplate.html');
    let html = fs.readFileSync(templatePath, 'utf-8');

    html = html.replace('{{fullName}}', booking.fullName)
               .replace('{{tourName}}', booking.tourName)
               .replace('{{tourId}}', booking._id)
               .replace('{{adult}}', booking.adult)
               .replace('{{children}}', booking.children)
               .replace('{{baby}}', booking.baby)
               .replace('{{bookAt}}', booking.bookAt)
               .replace('{{price}}', booking.price);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: booking.userEmail,
        subject: 'Booking Confirmation',
        html: html,
    };

    await transporter.sendMail(mailOptions);
};

// utils/sendEmail.js
const sendReply = async (contact, replyMessage) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Phản hồi từ Khách sạn</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #0056b3;
                font-size: 26px;
                text-align: center;
                margin-bottom: 20px;
            }
            h2 {
                font-size: 20px;
                margin-top: 20px;
                margin-bottom: 15px;
                color: #333;
            }
            p {
                color: #555;
                line-height: 1.6;
                margin-bottom: 15px;
            }
            .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 14px;
                color: #777;
                border-top: 1px solid #eaeaea;
                padding-top: 15px;
            }
            .footer strong {
                color: #0056b3;
            }
            .contact-info {
                margin-top: 20px;
                font-size: 14px;
                line-height: 1.4;
                text-align: left;
            }
            .highlight {
                color: #0056b3;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Cảm ơn bạn đã liên hệ với chúng tôi!</h1>
            <h2>Kính gửi <strong>${contact.name}</strong>,</h2>
            <p>Chúng tôi xin cảm ơn bạn đã liên hệ với chúng tôi và chúng tôi đã nhận được yêu cầu của bạn.</p>
            <p><strong>Thông điệp của bạn:</strong> ${contact.message}</p>
            <h3><strong>${replyMessage}</strong>,</h3>
            <p>Nếu bạn có bất kỳ câu hỏi nào khác, vui lòng liên hệ với chúng tôi qua số điện thoại <strong class="highlight">(+123) 456-7890</strong> hoặc gửi email tới <strong class="highlight">support@hotelbooking.com</strong>.</p>
            <p>Chúng tôi luôn sẵn sàng hỗ trợ bạn!</p>
            <div class="footer">
                <p>Trân trọng,<br>Đội ngũ Khách sạn Booking</p>
                <div class="contact-info">
                    <strong>Tên Khách Sạn</strong><br>
                    Địa chỉ: Dòng địa chỉ 1<br>
                    Thành phố, Quốc gia<br>
                    Điện thoại: <strong>(+123) 456-7890</strong>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: contact.email,
        subject: 'Phản hồi từ Khách sạn Booking',
        html: mailContent,
    };

    await transporter.sendMail(mailOptions);
};




export { sendConfirmationEmail, sendReply };



