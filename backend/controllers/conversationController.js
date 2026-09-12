import mongoose from 'mongoose';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';

// 1. Get all conversations for the logged-in user
export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (error) {
    console.error('Get Conversations Error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

// 2. Create a new conversation
export const createConversation = async (req, res) => {
  try {
    const { title } = req.body;
    const newConversation = new Conversation({
      userId: req.user.id,
      title: title || 'New Chat'
    });
    await newConversation.save();
    res.status(201).json(newConversation);
  } catch (error) {
    console.error('Create Conversation Error:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
};

// 3. Get single conversation with its messages
export const getConversationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 👇 NAYA SAFETY CHECK: Agar ID 'undefined' ya invalid MongoDB ObjectId ho toh yahin rok dein
    if (!id || id === 'undefined' || id === 'null' || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }

    const conversation = await Conversation.findOne({ _id: id, userId: req.user.id });
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messages = await Message.find({ conversationId: id }).sort({ createdAt: 1 });

    res.json({
      ...conversation.toObject(),
      messages
    });
  } catch (error) {
    console.error('Get Conversation Error:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
};

// Alias export for compatibility
export const getConversation = getConversationById;

// 4. Update conversation title/details
export const updateConversation = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || id === 'undefined' || id === 'null' || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }

    const updates = req.body;

    const conversation = await Conversation.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { $set: updates },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    console.error('Update Conversation Error:', error);
    res.status(500).json({ error: 'Failed to update conversation' });
  }
};

// 5. Delete conversation and its associated messages
export const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === 'undefined' || id === 'null' || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }

    const conversation = await Conversation.findOneAndDelete({ _id: id, userId: req.user.id });
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Delete all messages associated with this chat
    await Message.deleteMany({ conversationId: id });

    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Delete Conversation Error:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
};