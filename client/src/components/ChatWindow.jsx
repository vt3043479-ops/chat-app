import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { useCall } from '../contexts/CallContext';
import { Send, Phone, Video, MoreVertical, Smile, Paperclip, Image, Star, Play, Pause, Minus, Square, X } from 'lucide-react';
import MediaPicker from './MediaPicker';
import EmojiGifPicker from './EmojiGifPicker';
import StickerPicker from './StickerPicker';
import MediaMessage from './MediaMessage';

const ChatWindow = ({ selectedUser, messages }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [enableContinuousAnimation, setEnableContinuousAnimation] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  const { user } = useAuth();
  const { sendMessage, startTyping, stopTyping, typingUsers, markMessagesAsRead } = useSocket();
  const { startCall } = useCall();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Mark messages as read when chat window opens
    if (selectedUser && messages.length > 0) {
      markMessagesAsRead(selectedUser._id);
    }
  }, [selectedUser, messages, markMessagesAsRead]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedUser) {
      setLoading(true);
      sendMessage(selectedUser._id, newMessage.trim(), null, 'text');
      setNewMessage('');
      handleStopTyping();

      // Simulate send animation
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const handleMediaSelect = (mediaFiles) => {
    if (selectedUser && mediaFiles.length > 0) {
      mediaFiles.forEach(media => {
        const mediaMessage = {
          type: 'media',
          mediaType: media.type,
          mediaUrl: media.url,
          mediaSize: media.size,
          mediaData: media
        };
        sendMessage(selectedUser._id, media.name || '', mediaMessage, 'media');
      });
    }
    setShowMediaPicker(false);
  };

  const handleEmojiGifSelect = (item, type) => {
    if (type === 'emoji') {
      setNewMessage(prev => prev + item);
    } else if (type === 'gif') {
      const gifMessage = {
        type: 'media',
        mediaType: 'gif',
        mediaUrl: item.url,
        mediaData: item
      };
      sendMessage(selectedUser._id, item.title || 'GIF', gifMessage, 'media');
    }
    setShowEmojiPicker(false);
  };

  const handleStickerSelect = (sticker, type) => {
    const stickerMessage = {
      type: 'media',
      mediaType: 'sticker',
      mediaData: sticker
    };
    sendMessage(selectedUser._id, sticker.name || 'Sticker', stickerMessage, 'media');
    setShowStickerPicker(false);
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      startTyping(selectedUser._id);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 1000);
  };

  const handleStopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      stopTyping(selectedUser._id);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleVoiceCall = () => {
    startCall(selectedUser._id, 'voice');
  };

  const handleVideoCall = () => {
    startCall(selectedUser._id, 'video');
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setIsMaximized(false);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  };

  const handleRestore = () => {
    setIsMinimized(false);
    setIsMaximized(false);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getInitials = (username) => {
    return username.charAt(0).toUpperCase();
  };

  // Function to check if message contains only emojis
  const isEmojiOnlyMessage = (text) => {
    if (!text || text.trim() === '') return false;

    // Comprehensive emoji regex that covers most emoji ranges
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}-\u{2454}]|[\u{20D0}-\u{20FF}]|[\u{FE0F}]|[\u{200D}]/gu;

    // Remove all emojis and whitespace
    const withoutEmojis = text.replace(emojiRegex, '').replace(/\s/g, '');

    // Check if anything remains after removing emojis
    return withoutEmojis === '';
  };

  // Function to get emoji motion class based on emoji type
  const getEmojiMotionClass = (emoji) => {
    // Happy emojis
    if (['😀', '😃', '😄', '😁', '😊', '🙂', '😌', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋'].includes(emoji)) {
      return 'emoji-motion-happy';
    }

    // Love emojis
    if (['❤️', '💕', '💖', '💗', '💓', '💞', '💘', '💝', '💟', '♥️', '💌', '💋', '😍', '🥰', '😘'].includes(emoji)) {
      return 'emoji-motion-love';
    }

    // Excited emojis
    if (['🤩', '🥳', '🎉', '🎊', '🚀', '⚡', '🌟', '✨', '💥', '🔥', '🎯', '🏆', '🥇'].includes(emoji)) {
      return 'emoji-motion-excited';
    }

    // Laughing emojis
    if (['😂', '🤣', '😆', '😅', '🤪', '😜', '😝', '🤭', '🤡'].includes(emoji)) {
      return 'emoji-motion-laugh';
    }

    // Sad emojis
    if (['😢', '😭', '😔', '😞', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺'].includes(emoji)) {
      return 'emoji-motion-sad';
    }

    // Angry emojis
    if (['😠', '😡', '🤬', '😤', '💢', '👿', '😈', '🔥'].includes(emoji)) {
      return 'emoji-motion-angry';
    }

    // Surprised emojis
    if (['😮', '😯', '😲', '🤯', '😱', '🙀', '😨', '😰'].includes(emoji)) {
      return 'emoji-motion-surprised';
    }

    // Sleepy emojis
    if (['😴', '💤', '🥱', '😪', '🌙', '🌛', '🌜'].includes(emoji)) {
      return 'emoji-motion-sleepy';
    }

    // Party emojis
    if (['🎉', '🎊', '🥳', '🎈', '🎁', '🎂', '🍾', '🥂', '🎵', '🎶', '💃', '🕺'].includes(emoji)) {
      return 'emoji-motion-party';
    }

    // Cool emojis
    if (['😎', '🤓', '🧐', '🤠', '👑', '💎', '⭐', '🌟'].includes(emoji)) {
      return 'emoji-motion-cool';
    }

    // Thinking emojis
    if (['🤔', '🤨', '🧐', '💭', '🤷‍♀️', '🤷‍♂️', '🤷'].includes(emoji)) {
      return 'emoji-motion-thinking';
    }

    // Winking emojis
    if (['😉', '😜', '😝', '😛'].includes(emoji)) {
      return 'emoji-motion-wink';
    }

    // Default happy motion for other emojis
    return 'emoji-motion-happy';
  };

  // Function to wrap emojis in spans for styling with motion
  const formatMessageWithEmojis = (text) => {
    if (!text) return text;

    const emojiRegex = /([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}-\u{2454}]|[\u{20D0}-\u{20FF}]|[\u{FE0F}]|[\u{200D}])/gu;

    const parts = text.split(emojiRegex);

    return parts.map((part, index) => {
      if (part && emojiRegex.test(part)) {
        const motionClass = enableContinuousAnimation ? getEmojiMotionClass(part) : '';
        return (
          <span
            key={index}
            className={`message-emoji ${motionClass} emoji-entrance emoji-subtle`}
            style={{ animationDelay: `${index * 0.2}s` }}
            title={`${part} - ${enableContinuousAnimation ? 'Click to pause animation' : 'Hover for animation'}`}
            onClick={(e) => {
              if (enableContinuousAnimation) {
                e.target.style.animationPlayState =
                  e.target.style.animationPlayState === 'paused' ? 'running' : 'paused';
              }
            }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // Function to format emoji-only messages with motion
  const formatEmojiOnlyMessage = (text) => {
    if (!text) return text;

    const emojiRegex = /([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}-\u{2454}]|[\u{20D0}-\u{20FF}]|[\u{FE0F}]|[\u{200D}])/gu;

    const emojis = text.match(emojiRegex) || [];

    return emojis.map((emoji, index) => {
      const motionClass = enableContinuousAnimation ? getEmojiMotionClass(emoji) : '';
      return (
        <span
          key={index}
          className={`emoji-large ${motionClass} emoji-entrance emoji-subtle`}
          style={{
            animationDelay: `${index * 0.3}s`,
            marginRight: emojis.length > 1 ? '8px' : '0'
          }}
          title={`${emoji} - ${enableContinuousAnimation ? 'Click to pause animation' : 'Hover for animation'}`}
          onClick={(e) => {
            if (enableContinuousAnimation) {
              e.target.style.animationPlayState =
                e.target.style.animationPlayState === 'paused' ? 'running' : 'paused';
            }
          }}
        >
          {emoji}
        </span>
      );
    });
  };

  const isUserTyping = typingUsers.has(selectedUser._id);

  return (
    <div className={`flex flex-col chat-container transition-all duration-300 ${
      isMinimized
        ? 'h-16 w-full minimized'
        : isMaximized
          ? 'fixed inset-0 z-50 h-screen w-screen maximized'
          : 'h-full w-full'
    }`}>
      {/* Modern Chat Header */}
      <div className="chat-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 fade-in">
            <div className="relative">
              <div className="avatar-lg">
                {selectedUser.avatar ? (
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-xl">
                    {getInitials(selectedUser.username)}
                  </span>
                )}
              </div>
              {/* Online status indicator */}
              <div className="absolute -bottom-1 -right-1 status-online"></div>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-xl">{selectedUser.username}</h3>
              <div className="flex items-center space-x-2">
                {isUserTyping ? (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <span className="text-sm font-medium">Typing</span>
                    <div className="flex space-x-1">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-slate-600 font-medium">Active now</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Window Controls */}
            <div className="flex items-center space-x-1 mr-2">
              <button
                onClick={handleMinimize}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all duration-200"
                title="Minimize"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={handleMaximize}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all duration-200"
                title={isMaximized ? "Restore" : "Maximize"}
              >
                <Square className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setEnableContinuousAnimation(!enableContinuousAnimation)}
              className={`p-3 rounded-full transition-all duration-200 hover-lift hover:shadow-lg ${
                enableContinuousAnimation
                  ? 'text-orange-600 bg-orange-50 hover:bg-orange-100'
                  : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50'
              }`}
              title={enableContinuousAnimation ? "Disable emoji animations" : "Enable emoji animations"}
            >
              {enableContinuousAnimation ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button
              onClick={handleVoiceCall}
              className="p-3 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-all duration-200 hover-lift hover:shadow-lg"
              title="Voice call"
            >
              <Phone className="w-6 h-6" />
            </button>
            <button
              onClick={handleVideoCall}
              className="p-3 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 hover-lift hover:shadow-lg"
              title="Video call"
            >
              <Video className="w-6 h-6" />
            </button>
            <button className="p-3 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-full transition-all duration-200 hover-lift hover:shadow-lg">
              <MoreVertical className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Modern Messages Area */}
      {!isMinimized && (
        <div className="flex-1 overflow-y-auto chat-messages scrollbar-chat px-6 py-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center fade-in">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Smile className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Start the conversation!</h3>
              <p className="text-slate-600 font-medium">Send a message to begin chatting</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => {
              const isOwnMessage = message.sender._id === user.id;
              const showAvatar = index === 0 || messages[index - 1].sender._id !== message.sender._id;
              const showTimestamp = index === messages.length - 1 ||
                (index < messages.length - 1 && messages[index + 1].sender._id !== message.sender._id);

              return (
                <div
                  key={message._id}
                  className={`flex items-end space-x-3 ${isOwnMessage ? 'justify-end flex-row-reverse space-x-reverse' : 'justify-start'} ${
                    isOwnMessage ? 'message-send' : 'message-receive'
                  }`}
                >
                  {/* Avatar */}
                  {!isOwnMessage && (
                    <div className="avatar-sm flex-shrink-0">
                      {showAvatar && (
                        message.sender.avatar ? (
                          <img
                            src={message.sender.avatar}
                            alt={message.sender.username}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-sm font-bold">
                            {getInitials(message.sender.username)}
                          </span>
                        )
                      )}
                    </div>
                  )}

                  {/* Message Content */}
                  <div className="flex flex-col max-w-xs lg:max-w-md">
                    {/* Check if message has media */}
                    {message.type === 'media' || message.mediaData ? (
                      <div className="mb-2">
                        <MediaMessage
                          media={{
                            type: message.mediaType || message.mediaData?.type,
                            url: message.mediaUrl || message.mediaData?.url,
                            name: message.mediaData?.name || message.content,
                            size: message.mediaSize || message.mediaData?.size,
                            emoji: message.mediaData?.emoji,
                            title: message.mediaData?.title
                          }}
                          isOwnMessage={isOwnMessage}
                        />
                        {message.content && message.mediaType !== 'sticker' && (
                          <div className={`mt-2 ${
                            isEmojiOnlyMessage(message.content)
                              ? (isOwnMessage ? 'message-bubble-emoji-sent' : 'message-bubble-emoji-received')
                              : (isOwnMessage ? 'message-bubble-sent' : 'message-bubble-received')
                          } hover-lift`}>
                            <p className="text-sm font-medium leading-relaxed">
                              {isEmojiOnlyMessage(message.content)
                                ? formatEmojiOnlyMessage(message.content)
                                : formatMessageWithEmojis(message.content)
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={`${
                        isEmojiOnlyMessage(message.content)
                          ? (isOwnMessage ? 'message-bubble-emoji-sent' : 'message-bubble-emoji-received')
                          : (isOwnMessage ? 'message-bubble-sent' : 'message-bubble-received')
                      } hover-lift`}>
                        <p className="text-sm font-medium leading-relaxed">
                          {isEmojiOnlyMessage(message.content)
                            ? formatEmojiOnlyMessage(message.content)
                            : formatMessageWithEmojis(message.content)
                          }
                        </p>
                      </div>
                    )}

                    {/* Timestamp and Status */}
                    {showTimestamp && (
                      <div className={`flex items-center space-x-2 mt-1 px-2 ${
                        isOwnMessage ? 'justify-end' : 'justify-start'
                      }`}>
                        <span className="text-xs text-slate-500 font-medium">
                          {formatTime(message.createdAt)}
                        </span>
                        {isOwnMessage && (
                          <div className="flex items-center space-x-1">
                            {message.isRead ? (
                              <div className="flex space-x-0.5 message-tick">
                                <div className="w-3 h-3 text-blue-500">
                                  <svg viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                                  </svg>
                                </div>
                                <div className="w-3 h-3 text-blue-500 -ml-1">
                                  <svg viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                                  </svg>
                                </div>
                              </div>
                            ) : (
                              <div className="w-3 h-3 text-slate-400">
                                <svg viewBox="0 0 16 16" fill="currentColor">
                                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                                </svg>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
        </div>
      )}

      {/* Modern Message Input */}
      {!isMinimized && (
        <div className="relative">
        {/* Media Pickers */}
        <MediaPicker
          isOpen={showMediaPicker}
          onClose={() => setShowMediaPicker(false)}
          onMediaSelect={handleMediaSelect}
        />

        <EmojiGifPicker
          isOpen={showEmojiPicker}
          onClose={() => setShowEmojiPicker(false)}
          onSelect={handleEmojiGifSelect}
        />

        <StickerPicker
          isOpen={showStickerPicker}
          onClose={() => setShowStickerPicker(false)}
          onSelect={handleStickerSelect}
        />

        <div className="p-6 bg-white/90 backdrop-blur-sm border-t border-white/20">
          {/* Media Action Buttons */}
          <div className="flex items-center space-x-3 mb-4">
            <button
              type="button"
              onClick={() => setShowMediaPicker(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition-all duration-200 hover-lift"
            >
              <Paperclip className="w-4 h-4" />
              <span className="text-sm font-medium">Media</span>
            </button>

            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-600 rounded-full transition-all duration-200 hover-lift"
            >
              <Smile className="w-4 h-4" />
              <span className="text-sm font-medium">Emoji</span>
            </button>

            <button
              type="button"
              onClick={() => setShowStickerPicker(!showStickerPicker)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-full transition-all duration-200 hover-lift"
            >
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Stickers</span>
            </button>

            {/* Quick Test Buttons */}
            <button
              type="button"
              onClick={() => setNewMessage(prev => prev + '😀')}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              title="Add happy emoji"
            >
              😀
            </button>

            <button
              type="button"
              onClick={() => setNewMessage(prev => prev + '❤️')}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              title="Add heart emoji"
            >
              ❤️
            </button>
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={handleTyping}
                onBlur={handleStopTyping}
                placeholder="Type a message..."
                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 font-medium text-gray-800 pr-12"
              />
              {/* Quick Emoji Button */}
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all duration-200"
              >
                <Smile className="w-5 h-5" />
              </button>
            </div>

            <button
              type="submit"
              disabled={!newMessage.trim()}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-200 ${
                newMessage.trim()
                  ? 'bg-blue-500 hover:bg-blue-600 hover:shadow-lg hover:scale-110'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
        </div>
      )}

      {/* Minimized State - Show restore button */}
      {isMinimized && (
        <div className="flex items-center justify-between px-4 py-2 bg-white/90 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="avatar-sm">
              {selectedUser.avatar ? (
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-sm">
                  {getInitials(selectedUser.username)}
                </span>
              )}
            </div>
            <span className="font-medium text-slate-700">{selectedUser.username}</span>
          </div>
          <button
            onClick={handleRestore}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all duration-200"
            title="Restore"
          >
            <Square className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
