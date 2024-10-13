import multer from "multer";

// Tạo cấu hình lưu trữ cho multer
const storage = multer.memoryStorage(); // Bạn có thể thay đổi thành diskStorage nếu cần

// Tạo middleware xử lý việc upload một file duy nhất với kiểm tra định dạng
const singleUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Kiểm tra xem file có phải là hình ảnh không
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
}).single("file");

// Xuất middleware
export default singleUpload;
