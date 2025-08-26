import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { Search, LogOut, Settings, User } from 'lucide-react';

const Sidebar = ({ users, selectedUser, onUserSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout } = useAuth();
  const { onlineUsers } = useSocket();

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isUserOnline = (userId) => {
    return onlineUsers.some(onlineUser => onlineUser.userId === userId);
  };

  const getInitials = (username) => {
    return username.charAt(0).toUpperCase();
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="chat-sidebar flex flex-col h-full w-80 min-w-80">
      {/* Modern Sidebar Header */}
      <div className="p-6 border-b border-white/10 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="avatar-lg hover-lift">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-xl">
                  {getInitials(user?.username || 'U')}
                </span>
              )}
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-xl">{user?.username}</h2>
              <div className="flex items-center space-x-2">
                <div className="status-online"></div>
                <p className="text-sm text-slate-600 font-medium">Active now</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-slate-600 hover:text-slate-800 hover:bg-white/60 rounded-full transition-all duration-200 hover-lift">
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 hover-lift"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modern Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-chat pl-12 hover:shadow-md focus:shadow-lg"
          />
        </div>
      </div>

      {/* Modern Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-chat">
        <div className="p-4">
          <h3 className="text-sm font-bold text-slate-700 px-2 py-3 mb-2">
            Messages ({filteredUsers.length})
          </h3>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 fade-in">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">
                {searchTerm ? 'No conversations found' : 'No conversations yet'}
              </p>
              <p className="text-slate-400 text-sm mt-1">
                Start a new conversation to begin chatting
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map((chatUser, index) => (
                <button
                  key={chatUser._id}
                  onClick={() => onUserSelect(chatUser)}
                  className={`chat-item w-full ${
                    selectedUser?._id === chatUser._id ? 'chat-item-active' : ''
                  } fade-in`}
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="relative">
                    <div className="avatar">
                      {chatUser.avatar ? (
                        <img
                          src={chatUser.avatar}
                          alt={chatUser.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold">
                          {getInitials(chatUser.username)}
                        </span>
                      )}
                    </div>
                    {isUserOnline(chatUser._id) && (
                      <div className="absolute -bottom-1 -right-1 status-online"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-base font-bold text-slate-800 truncate">
                        {chatUser.username}
                      </p>
                      <div className="flex items-center space-x-2">
                        {isUserOnline(chatUser._id) && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                        <span className="text-xs text-slate-500 font-medium">
                          2m
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-600 truncate font-medium">
                        {isUserOnline(chatUser._id) ? 'Active now' : 'Last seen recently'}
                      </p>
                      {/* Unread indicator */}
                      <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0"></div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
