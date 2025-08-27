const express = require('express');
const router = express.Router();
const Friend = require('../models/Friend');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all friends
router.get('/', auth, async (req, res) => {
  try {
    const friends = await Friend.getFriends(req.user.id);
    res.json({ friends });
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending friend requests (received)
router.get('/requests', auth, async (req, res) => {
  try {
    const requests = await Friend.getPendingRequests(req.user.id);
    res.json({ requests });
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get sent friend requests
router.get('/sent', auth, async (req, res) => {
  try {
    const sentRequests = await Friend.getSentRequests(req.user.id);
    res.json({ sentRequests });
  } catch (error) {
    console.error('Error fetching sent requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search users (excluding friends and self)
router.get('/search', auth, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim().length < 2) {
      return res.json({ users: [] });
    }

    // Get current friends
    const friends = await Friend.getFriends(req.user.id);
    const friendIds = friends.map(friend => friend._id.toString());
    friendIds.push(req.user.id); // Exclude self

    // Search users excluding friends and self
    const users = await User.find({
      _id: { $nin: friendIds },
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).select('username email avatar').limit(20);

    // Get friendship status for each user
    const usersWithStatus = await Promise.all(
      users.map(async (user) => {
        const status = await Friend.getFriendshipStatus(req.user.id, user._id);
        return {
          ...user.toObject(),
          friendshipStatus: status
        };
      })
    );

    res.json({ users: usersWithStatus });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send friend request
router.post('/request/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'Cannot send friend request to yourself' });
    }

    // Check if user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if friendship already exists
    const existingFriendship = await Friend.findOne({
      $or: [
        { requester: req.user.id, recipient: userId },
        { requester: userId, recipient: req.user.id }
      ]
    });

    if (existingFriendship) {
      return res.status(400).json({ 
        message: 'Friend request already exists or you are already friends' 
      });
    }

    // Create friend request
    const friendRequest = new Friend({
      requester: req.user.id,
      recipient: userId
    });

    await friendRequest.save();
    await friendRequest.populate('requester recipient', 'username email avatar');

    res.status(201).json({ 
      message: 'Friend request sent successfully',
      friendRequest 
    });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept friend request
router.put('/accept/:requestId', auth, async (req, res) => {
  try {
    const { requestId } = req.params;

    const friendRequest = await Friend.findOne({
      _id: requestId,
      recipient: req.user.id,
      status: 'pending'
    });

    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    friendRequest.status = 'accepted';
    await friendRequest.save();
    await friendRequest.populate('requester recipient', 'username email avatar');

    res.json({ 
      message: 'Friend request accepted',
      friendship: friendRequest 
    });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Decline friend request
router.put('/decline/:requestId', auth, async (req, res) => {
  try {
    const { requestId } = req.params;

    const friendRequest = await Friend.findOne({
      _id: requestId,
      recipient: req.user.id,
      status: 'pending'
    });

    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    friendRequest.status = 'declined';
    await friendRequest.save();

    res.json({ message: 'Friend request declined' });
  } catch (error) {
    console.error('Error declining friend request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove friend
router.delete('/:friendId', auth, async (req, res) => {
  try {
    const { friendId } = req.params;

    const friendship = await Friend.findOne({
      $or: [
        { requester: req.user.id, recipient: friendId },
        { requester: friendId, recipient: req.user.id }
      ]
    });

    if (!friendship) {
      return res.status(404).json({ message: 'Friendship not found' });
    }

    await Friend.deleteOne({ _id: friendship._id });

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Error removing friend:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
