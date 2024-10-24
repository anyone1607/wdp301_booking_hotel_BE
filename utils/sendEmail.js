// utils/sendEmail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Hàm gửi email xác nhận đặt phòng
const sendConfirmationEmail = async (booking) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Nhóm phòng theo tên và đếm số lượng
    const roomCount = booking.roomIds.reduce((acc, room) => {
        acc[room.roomName] = (acc[room.roomName] || 0) + 1;
        return acc;
    }, {});

    // Tạo chuỗi mô tả các loại phòng
    const roomDescriptions = Object.entries(roomCount)
        .map(([roomName, count]) => `${roomName} (${count})`)
        .join(', ');

    const extraServices = booking.extraIds.length > 0 
        ? booking.extraIds.map(extra => `${extra.extraName}`).join(', ')
        : 'Không có';

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: booking.email,
        subject: 'Xác nhận đặt phòng của bạn',
        html: `
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Xác nhận đặt phòng</title>
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
                        color: #007BFF;
                        font-size: 26px;
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    h2 {
                        color: #333;
                    }
                    p {
                        color: #555;
                        line-height: 1.6;
                    }
                    ul {
                        list-style: none;
                        padding: 0;
                    }
                    li {
                        margin: 5px 0;
                    }
                    footer {
                        margin-top: 20px;
                        font-size: 0.9em;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Cảm ơn bạn đã đặt phòng!</h1>
                    <p>Xin chào <strong>${booking.name}</strong>,</p>
                    <p>Chúng tôi vui mừng thông báo rằng bạn đã đặt thành công phòng tại <strong>${booking.hotelId.title}</strong>.</p>
                    <p><strong>Thông tin đặt phòng:</strong></p>
                    <ul>
                        <li>Loại phòng: ${roomDescriptions}</li>
                        <li>Dịch vụ thêm: ${extraServices}</li>
                        <li>Người lớn: ${booking.adult}</li>
                        <li>Trẻ em: ${booking.children}</li>
                        <li>Số điện thoại: ${booking.phone}</li>
                        <li>Tổng số tiền: ${booking.totalAmount} VND</li>
                        <li>Thời gian đặt: ${new Date(booking.bookAt).toLocaleString()}</li>
                        <li>Ngày trả phòng: ${new Date(booking.checkOut).toLocaleString()}</li>
                    </ul>
                    <p>Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đặt phòng.</p>
                    <footer>
                        <p><i>Bạn nhận được email này vì bạn đã đặt phòng tại hệ thống của chúng tôi.</i></p>
                    </footer>
                </div>
            </body>
            </html>
        `,
    };

    await transporter.sendMail(mailOptions);
};

// Hàm gửi phản hồi cho khách hàng
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
                color: #007BFF;
                font-size: 26px;
                text-align: center;
                margin-bottom: 20px;
            }
            h2 {
                color: #333;
            }
            p {
                color: #555;
                line-height: 1.6;
            }
            .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 14px;
                color: #777;
                border-top: 1px solid #eaeaea;
                padding-top: 15px;
            }
            .highlight {
                color: #007BFF;
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
                    Email: <strong>chungnkhe160935@fpt.edu.vn</strong>
                    Điện thoại: <strong>0961897090</strong>
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
