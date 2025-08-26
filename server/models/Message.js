const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: ''
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'call-start', 'call-end', 'media'],
    default: 'text'
  },
  type: {
    type: String,
    enum: ['text', 'media'],
    default: 'text'
  },
  mediaType: {
    type: String,
    enum: ['image', 'video', 'file', 'gif', 'sticker', 'audio']
  },
  mediaUrl: {
    type: String
  },
  mediaSize: {
    type: Number
  },
  mediaData: {
    type: mongoose.Schema.Types.Mixed
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  },
  editedAt: {
    type: Date,
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient querying
messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, isRead: 1 });

module.exports = mongoose.model('Message', messageSchema);
