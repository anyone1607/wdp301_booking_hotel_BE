import express from 'express';
import { createMessage, getMessages, deleteMessage, sendReply } from '../controllers/contactController.js';


const router = express.Router();

router.post('/', createMessage);
router.get('/', getMessages);
router.delete('/:id', deleteMessage);
router.post('/reply', sendReply);
export default router;
