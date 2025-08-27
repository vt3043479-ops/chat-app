const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'blocked'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicate friend requests
friendSchema.index({ requester: 1, recipient: 1 }, { unique: true });

// Update the updatedAt field before saving
friendSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to get friends list
friendSchema.statics.getFriends = async function(userId) {
  const friends = await this.find({
    $or: [
      { requester: userId, status: 'accepted' },
      { recipient: userId, status: 'accepted' }
    ]
  }).populate('requester recipient', 'username email avatar');
  
  return friends.map(friend => {
    // Return the friend (not the current user)
    return friend.requester._id.toString() === userId.toString() 
      ? friend.recipient 
      : friend.requester;
  });
};

// Static method to get pending friend requests
friendSchema.statics.getPendingRequests = async function(userId) {
  return await this.find({
    recipient: userId,
    status: 'pending'
  }).populate('requester', 'username email avatar');
};

// Static method to get sent requests
friendSchema.statics.getSentRequests = async function(userId) {
  return await this.find({
    requester: userId,
    status: 'pending'
  }).populate('recipient', 'username email avatar');
};

// Static method to check friendship status
friendSchema.statics.getFriendshipStatus = async function(userId1, userId2) {
  const friendship = await this.findOne({
    $or: [
      { requester: userId1, recipient: userId2 },
      { requester: userId2, recipient: userId1 }
    ]
  });
  
  if (!friendship) return 'none';
  return friendship.status;
};

module.exports = mongoose.model('Friend', friendSchema);
