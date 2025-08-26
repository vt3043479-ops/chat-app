import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import CallModal from '../components/CallModal';
import IncomingCallModal from '../components/IncomingCallModal';
import { useCall } from '../contexts/CallContext';
import axios from 'axios';

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const { messages, setMessages } = useSocket();
  const { isInCall, incomingCall } = useCall();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await axios.get(`/api/messages/conversation/${userId}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleUserSelect = (clickedUser) => {
    // Toggle behavior: if clicking the same user, hide the chat
    if (selectedUser && (selectedUser._id === clickedUser._id || selectedUser.id === clickedUser.id)) {
      setSelectedUser(null);
      setMessages([]); // Clear messages when hiding chat
    } else {
      // Show chat for new user
      setSelectedUser(clickedUser);
      fetchMessages(clickedUser.id || clickedUser._id);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Chat Container */}
      <div className="flex w-full h-full bg-white/60 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          users={users}
          selectedUser={selectedUser}
          onUserSelect={handleUserSelect}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <ChatWindow
              selectedUser={selectedUser}
              messages={messages.filter(msg =>
                (msg.sender._id === user.id && msg.recipient._id === selectedUser._id) ||
                (msg.sender._id === selectedUser._id && msg.recipient._id === user.id)
              )}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50/50 to-blue-50/30">
              <div className="text-center fade-in">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl hover-lift">
                  <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-4">Welcome to Friendship Fiesta</h3>
                <p className="text-slate-600 font-medium text-lg mb-2">Your conversations live here</p>
                <p className="text-slate-500">Select a friend from the sidebar to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Call Modals */}
      {isInCall && <CallModal />}
      {incomingCall && <IncomingCallModal />}
    </div>
  );
};

export default Chat;
