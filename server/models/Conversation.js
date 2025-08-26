const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // For group chats (future feature)
  isGroup: {
    type: Boolean,
    default: false
  },
  groupName: {
    type: String,
    default: ''
  },
  groupAvatar: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Ensure participants array has exactly 2 users for 1-on-1 chats
conversationSchema.pre('save', function(next) {
  if (!this.isGroup && this.participants.length !== 2) {
    return next(new Error('1-on-1 conversation must have exactly 2 participants'));
  }
  next();
});

// Index for efficient querying
conversationSchema.index({ participants: 1, lastActivity: -1 });
conversationSchema.index({ lastActivity: -1 });

module.exports = mongoose.model('Conversation', conversationSchema);
