import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const { user, token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token && user) {
      // Initialize socket connection
      const newSocket = io('http://localhost:4000', {
        auth: {
          token: token
        }
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
        setSocket(newSocket);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      // Handle online users
      newSocket.on('online-users', (users) => {
        setOnlineUsers(users);
      });

      newSocket.on('user-online', (userData) => {
        setOnlineUsers(prev => {
          const filtered = prev.filter(u => u.userId !== userData.userId);
          return [...filtered, { ...userData, status: 'online' }];
        });
      });

      newSocket.on('user-offline', (userData) => {
        setOnlineUsers(prev => 
          prev.filter(u => u.userId !== userData.userId)
        );
      });

      // Handle messages
      newSocket.on('new-message', (message) => {
        setMessages(prev => [...prev, message]);
      });

      newSocket.on('message-sent', (message) => {
        setMessages(prev => [...prev, message]);
      });

      newSocket.on('message-error', (error) => {
        console.error('Message error:', error);
      });

      // Handle typing indicators
      newSocket.on('user-typing', (data) => {
        setTypingUsers(prev => new Set([...prev, data.userId]));
      });

      newSocket.on('user-stopped-typing', (data) => {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });
      });

      // Handle read receipts
      newSocket.on('messages-read', (data) => {
        setMessages(prev => 
          prev.map(msg => 
            msg.sender._id === user.id && msg.recipient._id === data.readBy
              ? { ...msg, isRead: true, readAt: data.readAt }
              : msg
          )
        );
      });

      return () => {
        newSocket.close();
        setSocket(null);
        setOnlineUsers([]);
        setMessages([]);
        setTypingUsers(new Set());
      };
    }
  }, [isAuthenticated, token, user]);

  const sendMessage = (recipientId, content, mediaData = null, messageType = 'text') => {
    if (socket && recipientId && (content?.trim() || mediaData)) {
      const messagePayload = {
        recipientId,
        content: content?.trim() || '',
        messageType: mediaData ? 'media' : messageType,
        mediaData
      };
      socket.emit('send-message', messagePayload);
    }
  };

  const startTyping = (recipientId) => {
    if (socket) {
      socket.emit('typing-start', { recipientId });
    }
  };

  const stopTyping = (recipientId) => {
    if (socket) {
      socket.emit('typing-stop', { recipientId });
    }
  };

  const markMessagesAsRead = (senderId) => {
    if (socket) {
      socket.emit('mark-messages-read', { senderId });
    }
  };

  const value = {
    socket,
    onlineUsers,
    messages,
    conversations,
    typingUsers,
    sendMessage,
    startTyping,
    stopTyping,
    markMessagesAsRead,
    setMessages,
    setConversations
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
