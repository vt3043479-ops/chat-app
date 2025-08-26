const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

// Store active users and their socket connections
const activeUsers = new Map();

const socketHandler = (io) => {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`User ${socket.user.username} connected`);

    // Add user to active users
    activeUsers.set(socket.userId, {
      socketId: socket.id,
      user: socket.user,
      status: 'online'
    });

    // Update user online status in database
    await User.findByIdAndUpdate(socket.userId, {
      isOnline: true,
      socketId: socket.id,
      lastSeen: new Date()
    });

    // Join user to their personal room
    socket.join(socket.userId);

    // Broadcast user online status to all connected users
    socket.broadcast.emit('user-online', {
      userId: socket.userId,
      username: socket.user.username
    });

    // Send list of online users to the newly connected user
    const onlineUsers = Array.from(activeUsers.values()).map(user => ({
      userId: user.user._id,
      username: user.user.username,
      avatar: user.user.avatar,
      status: user.status
    }));
    socket.emit('online-users', onlineUsers);

    // Handle sending messages
    socket.on('send-message', async (data) => {
      try {
        const { recipientId, content, messageType = 'text', mediaData } = data;

        // Create message data
        const messageData = {
          sender: socket.userId,
          recipient: recipientId,
          content: content || '',
          messageType
        };

        // Add media data if present
        if (mediaData) {
          messageData.type = mediaData.type || 'media';
          messageData.mediaType = mediaData.mediaType;
          messageData.mediaUrl = mediaData.mediaUrl;
          messageData.mediaSize = mediaData.mediaSize;
          messageData.mediaData = mediaData.mediaData;
        }

        // Create and save message
        const message = new Message(messageData);
        await message.save();
        await message.populate('sender', 'username avatar');
        await message.populate('recipient', 'username avatar');

        // Update or create conversation
        let conversation = await Conversation.findOne({
          participants: { $all: [socket.userId, recipientId] },
          isGroup: false
        });

        if (!conversation) {
          conversation = new Conversation({
            participants: [socket.userId, recipientId],
            lastMessage: message._id,
            lastActivity: new Date()
          });
        } else {
          conversation.lastMessage = message._id;
          conversation.lastActivity = new Date();
        }

        await conversation.save();

        // Send message to recipient if online
        io.to(recipientId).emit('new-message', message);
        
        // Confirm message sent to sender
        socket.emit('message-sent', message);

      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('message-error', { error: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing-start', (data) => {
      const { recipientId } = data;
      io.to(recipientId).emit('user-typing', {
        userId: socket.userId,
        username: socket.user.username
      });
    });

    socket.on('typing-stop', (data) => {
      const { recipientId } = data;
      io.to(recipientId).emit('user-stopped-typing', {
        userId: socket.userId
      });
    });

    // Handle message read receipts
    socket.on('mark-messages-read', async (data) => {
      try {
        const { senderId } = data;
        
        await Message.updateMany(
          {
            sender: senderId,
            recipient: socket.userId,
            isRead: false
          },
          {
            isRead: true,
            readAt: new Date()
          }
        );

        // Notify sender that messages were read
        io.to(senderId).emit('messages-read', {
          readBy: socket.userId,
          readAt: new Date()
        });

      } catch (error) {
        console.error('Mark read error:', error);
      }
    });

    // WebRTC Signaling for voice/video calls
    socket.on('call-user', (data) => {
      const { recipientId, offer, callType } = data;
      
      io.to(recipientId).emit('incoming-call', {
        callerId: socket.userId,
        callerName: socket.user.username,
        offer,
        callType // 'voice' or 'video'
      });
    });

    socket.on('answer-call', (data) => {
      const { callerId, answer } = data;
      
      io.to(callerId).emit('call-answered', {
        answer,
        answeredBy: socket.userId
      });
    });

    socket.on('reject-call', (data) => {
      const { callerId } = data;
      
      io.to(callerId).emit('call-rejected', {
        rejectedBy: socket.userId
      });
    });

    socket.on('end-call', (data) => {
      const { recipientId } = data;
      
      io.to(recipientId).emit('call-ended', {
        endedBy: socket.userId
      });
    });

    socket.on('ice-candidate', (data) => {
      const { recipientId, candidate } = data;
      
      io.to(recipientId).emit('ice-candidate', {
        candidate,
        from: socket.userId
      });
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`User ${socket.user.username} disconnected`);

      // Remove from active users
      activeUsers.delete(socket.userId);

      // Update user offline status in database
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: false,
        lastSeen: new Date(),
        socketId: null
      });

      // Broadcast user offline status
      socket.broadcast.emit('user-offline', {
        userId: socket.userId,
        username: socket.user.username
      });
    });
  });
};

module.exports = socketHandler;
