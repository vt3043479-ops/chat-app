const express = require('express');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get conversation messages
router.get('/conversation/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: userId },
        { sender: userId, recipient: req.user._id }
      ],
      isDeleted: false
    })
    .populate('sender', 'username avatar')
    .populate('recipient', 'username avatar')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    // Mark messages as read
    await Message.updateMany(
      {
        sender: userId,
        recipient: req.user._id,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({ 
      messages: messages.reverse(), // Reverse to show oldest first
      page: parseInt(page),
      hasMore: messages.length === parseInt(limit)
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all conversations
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
      isActive: true
    })
    .populate('participants', 'username avatar isOnline lastSeen')
    .populate('lastMessage')
    .sort({ lastActivity: -1 });

    // Format conversations for frontend
    const formattedConversations = conversations.map(conv => {
      const otherParticipant = conv.participants.find(
        p => p._id.toString() !== req.user._id.toString()
      );

      return {
        id: conv._id,
        participant: otherParticipant,
        lastMessage: conv.lastMessage,
        lastActivity: conv.lastActivity,
        unreadCount: 0 // Will be calculated separately if needed
      };
    });

    res.json({ conversations: formattedConversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send message (also handled via Socket.IO)
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { recipientId, content, messageType = 'text' } = req.body;

    if (!recipientId || !content) {
      return res.status(400).json({ error: 'Recipient and content are required' });
    }

    // Create message
    const message = new Message({
      sender: req.user._id,
      recipient: recipientId,
      content,
      messageType
    });

    await message.save();
    await message.populate('sender', 'username avatar');
    await message.populate('recipient', 'username avatar');

    // Update or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, recipientId] },
      isGroup: false
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [req.user._id, recipientId],
        lastMessage: message._id,
        lastActivity: new Date()
      });
    } else {
      conversation.lastMessage = message._id;
      conversation.lastActivity = new Date();
    }

    await conversation.save();

    res.status(201).json({ message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark messages as read
router.put('/read/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    await Message.updateMany(
      {
        sender: userId,
        recipient: req.user._id,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
