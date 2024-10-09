import Extrafee from '../models/Extrafee.js';

// Tạo một phí phát sinh mới
export const createExtrafee = async (req, res) => {
    const { hotelId, extraName, extraPrice, status } = req.body;

    try {
        const newExtrafee = new Extrafee({
            hotelId,
            extraName,
            extraPrice,
            status,
        });

        await newExtrafee.save();
        res.status(201).json(newExtrafee);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo phí phát sinh.', error });
    }
};

// Lấy tất cả các phí phát sinh
export const getAllExtrafees = async (req, res) => {
    try {
        const extrafees = await Extrafee.find().populate('hotelId', 'hotelName'); // populate hotel name
        res.status(200).json(extrafees);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách phí phát sinh.', error });
    }
};

// Lấy một phí phát sinh theo ID
export const getExtrafeeById = async (req, res) => {
    const { id } = req.params;

    try {
        const extrafee = await Extrafee.findById(id).populate('hotelId', 'hotelName');

        if (!extrafee) {
            return res.status(404).json({ message: 'Phí phát sinh không tồn tại.' });
        }

        res.status(200).json(extrafee);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy phí phát sinh theo ID.', error });
    }
};

// Cập nhật phí phát sinh theo ID
export const updateExtrafee = async (req, res) => {
    const { id } = req.params;
    const { hotelId, extraName, extraPrice, status } = req.body;

    try {
        const updatedExtrafee = await Extrafee.findByIdAndUpdate(
            id,
            { hotelId, extraName, extraPrice, status },
            { new: true }
        ).populate('hotelId', 'hotelName');

        if (!updatedExtrafee) {
            return res.status(404).json({ message: 'Phí phát sinh không tồn tại.' });
        }

        res.status(200).json(updatedExtrafee);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật phí phát sinh.', error });
    }
};

// Xóa phí phát sinh theo ID
export const deleteExtrafee = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedExtrafee = await Extrafee.findByIdAndDelete(id);

        if (!deletedExtrafee) {
            return res.status(404).json({ message: 'Phí phát sinh không tồn tại.' });
        }

        res.status(200).json({ message: 'Đã xóa phí phát sinh thành công.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa phí phát sinh.', error });
    }
};
