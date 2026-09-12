import express from 'express';
import { getConversations, createConversation, getConversationById, updateConversation, deleteConversation } from '../controllers/conversationController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken); // Protect all conversation routes

router.get('/', getConversations);
router.post('/', createConversation);
router.get('/:id', getConversationById);
router.put('/:id', updateConversation);
router.delete('/:id', deleteConversation);

export default router;