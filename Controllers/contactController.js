import Contact from "../models/contact.js";
import nodemailer from 'nodemailer';
// Create a new message
export const createMessage = async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const newMessage = new Contact({ name, email, message });
        await newMessage.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
};

// Get all messages
export const getMessages = async (req, res) => {
    try {
        const messages = await Contact.find();
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

// Delete a message by ID
export const deleteMessage = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedMessage = await Contact.findByIdAndDelete(id);
        if (!deletedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete message' });
    }
};

const transporter = nodemailer.createTransport({
    service: 'Gmail',  
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendReply = async (req, res) => {
    const { contactId, replyMessage } = req.body;

    if (!contactId || !replyMessage) {
        return res.status(400).json({ error: 'contactId and replyMessage are required' });
    }

    try {
        const contact = await Contact.findById(contactId);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: contact.email,
            subject: 'Reply to Your Message',
            text: replyMessage
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Reply sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send reply' });
    }
};