import DataUriParser from 'datauri/parser.js';
import path from 'path';

// Nếu bạn sử dụng multer với memoryStorage, bạn không cần fs ở đây
const getDataUri = (file) => {
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString(); // Sử dụng originalname từ file

    // Trả về data URI từ buffer
    return parser.format(extName, file.buffer); // Sử dụng file.buffer thay vì fs.readFileSync
};

export default getDataUri;
