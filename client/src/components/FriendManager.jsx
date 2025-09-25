import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Check, X, Users, Clock, Send, Trash2, UserMinus, Edit3 } from 'lucide-react';
import axios from 'axios';
import ConfirmDialog from './ConfirmDialog';

const FriendManager = ({ isOpen, onClose, onFriendsUpdate }) => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState(new Set());
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [friendToRemove, setFriendToRemove] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchFriends();
      fetchFriendRequests();
      fetchSentRequests();
    }
  }, [isOpen]);

  const fetchFriends = async () => {
    try {
      const response = await axios.get('/api/friends');
      setFriends(response.data.friends);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get('/api/friends/requests');
      setFriendRequests(response.data.requests);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const fetchSentRequests = async () => {
    try {
      const response = await axios.get('/api/friends/sent');
      setSentRequests(response.data.sentRequests);
    } catch (error) {
      console.error('Error fetching sent requests:', error);
    }
  };

  const searchUsers = async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/api/friends/search?query=${encodeURIComponent(query)}`);
      setSearchResults(response.data.users);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      await axios.post(`/api/friends/request/${userId}`);
      // Update search results to reflect the sent request
      setSearchResults(prev => 
        prev.map(user => 
          user._id === userId 
            ? { ...user, friendshipStatus: 'pending' }
            : user
        )
      );
      fetchSentRequests();
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const acceptFriendRequest = async (requestId) => {
    try {
      await axios.put(`/api/friends/accept/${requestId}`);
      fetchFriends();
      fetchFriendRequests();
      // Notify parent component to refresh friends list
      if (onFriendsUpdate) {
        onFriendsUpdate();
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const declineFriendRequest = async (requestId) => {
    try {
      await axios.put(`/api/friends/decline/${requestId}`);
      fetchFriendRequests();
    } catch (error) {
      console.error('Error declining friend request:', error);
    }
  };

  const removeFriend = async (friendId) => {
    try {
      await axios.delete(`/api/friends/${friendId}`);
      fetchFriends();
      // Remove from selected friends if it was selected
      setSelectedFriends(prev => {
        const newSet = new Set(prev);
        newSet.delete(friendId);
        return newSet;
      });
      // Notify parent component to refresh friends list
      if (onFriendsUpdate) {
        onFriendsUpdate();
      }
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  const removeMultipleFriends = async () => {
    try {
      const promises = Array.from(selectedFriends).map(friendId =>
        axios.delete(`/api/friends/${friendId}`)
      );
      await Promise.all(promises);
      fetchFriends();
      setSelectedFriends(new Set());
      setEditMode(false);
      // Notify parent component to refresh friends list
      if (onFriendsUpdate) {
        onFriendsUpdate();
      }
    } catch (error) {
      console.error('Error removing multiple friends:', error);
    }
  };

  const handleRemoveFriend = (friendId, friendName) => {
    setFriendToRemove({ id: friendId, name: friendName });
    setShowConfirmDialog(true);
  };

  const confirmRemoveFriend = () => {
    if (friendToRemove) {
      removeFriend(friendToRemove.id);
      setFriendToRemove(null);
    }
  };

  const handleBulkRemove = () => {
    setShowConfirmDialog(true);
  };

  const toggleFriendSelection = (friendId) => {
    setSelectedFriends(prev => {
      const newSet = new Set(prev);
      if (newSet.has(friendId)) {
        newSet.delete(friendId);
      } else {
        newSet.add(friendId);
      }
      return newSet;
    });
  };

  const selectAllFriends = () => {
    if (selectedFriends.size === friends.length) {
      setSelectedFriends(new Set());
    } else {
      setSelectedFriends(new Set(friends.map(friend => friend._id)));
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setSelectedFriends(new Set());
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchUsers(query);
  };

  const getInitials = (username) => {
    return username.charAt(0).toUpperCase();
  };

  const getFriendshipStatusButton = (user) => {
    switch (user.friendshipStatus) {
      case 'pending':
        return (
          <button
            disabled
            className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm flex items-center space-x-1"
          >
            <Clock className="w-4 h-4" />
            <span>Pending</span>
          </button>
        );
      case 'accepted':
        return (
          <button
            disabled
            className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm flex items-center space-x-1"
          >
            <Check className="w-4 h-4" />
            <span>Friends</span>
          </button>
        );
      default:
        return (
          <button
            onClick={() => sendFriendRequest(user._id)}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm flex items-center space-x-1 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add</span>
          </button>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-slate-800">Friends</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'search'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Search className="w-4 h-4 inline mr-2" />
            Search
          </button>
          <button
            onClick={() => {
              setActiveTab('friends');
              setEditMode(false);
              setSelectedFriends(new Set());
            }}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'friends'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'requests'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Requests ({friendRequests.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'search' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users by username or email..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                </div>
              )}

              <div className="space-y-3">
                {searchResults.map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          getInitials(user.username)
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{user.username}</h3>
                        <p className="text-sm text-slate-600">{user.email}</p>
                      </div>
                    </div>
                    {getFriendshipStatusButton(user)}
                  </div>
                ))}
              </div>

              {searchQuery && !loading && searchResults.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  No users found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}

          {activeTab === 'friends' && (
            <div className="space-y-4">
              {/* Edit Controls */}
              {friends.length > 0 && (
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    {editMode ? (
                      <>
                        <button
                          onClick={selectAllFriends}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm transition-colors"
                        >
                          {selectedFriends.size === friends.length ? 'Deselect All' : 'Select All'}
                        </button>
                        <span className="text-sm text-slate-600">
                          {selectedFriends.size} selected
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-medium text-slate-700">
                        Manage your friends
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {editMode ? (
                      <>
                        {selectedFriends.size > 0 && (
                          <button
                            onClick={handleBulkRemove}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm flex items-center space-x-1 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Remove ({selectedFriends.size})</span>
                          </button>
                        )}
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1 bg-slate-500 hover:bg-slate-600 text-white rounded-full text-sm transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditMode(true)}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm flex items-center space-x-1 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Friends List */}
              <div className="space-y-3">
                {friends.map((friend) => (
                  <div
                    key={friend._id}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                      editMode
                        ? selectedFriends.has(friend._id)
                          ? 'bg-red-50 border-2 border-red-200'
                          : 'bg-slate-50 hover:bg-slate-100 cursor-pointer'
                        : 'bg-slate-50'
                    }`}
                    onClick={editMode ? () => toggleFriendSelection(friend._id) : undefined}
                  >
                    <div className="flex items-center space-x-3">
                      {editMode && (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedFriends.has(friend._id)}
                            onChange={() => toggleFriendSelection(friend._id)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>
                      )}
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {friend.avatar ? (
                          <img src={friend.avatar} alt={friend.username} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          getInitials(friend.username)
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{friend.username}</h3>
                        <p className="text-sm text-slate-600">{friend.email}</p>
                      </div>
                    </div>
                    {!editMode && (
                      <button
                        onClick={() => handleRemoveFriend(friend._id, friend.username)}
                        className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-full text-sm flex items-center space-x-1 transition-colors"
                      >
                        <UserMinus className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {friends.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="font-medium mb-2">No friends yet</p>
                  <p className="text-sm">Search for users to add them as friends!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">Received Requests</h3>
                <div className="space-y-3">
                  {friendRequests.map((request) => (
                    <div key={request._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                          {request.requester.avatar ? (
                            <img src={request.requester.avatar} alt={request.requester.username} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            getInitials(request.requester.username)
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">{request.requester.username}</h3>
                          <p className="text-sm text-slate-600">{request.requester.email}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => acceptFriendRequest(request._id)}
                          className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm flex items-center space-x-1 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => declineFriendRequest(request._id)}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm flex items-center space-x-1 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span>Decline</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {friendRequests.length === 0 && (
                  <div className="text-center py-4 text-slate-500">
                    No pending friend requests
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 mb-3">Sent Requests</h3>
                <div className="space-y-3">
                  {sentRequests.map((request) => (
                    <div key={request._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                          {request.recipient.avatar ? (
                            <img src={request.recipient.avatar} alt={request.recipient.username} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            getInitials(request.recipient.username)
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">{request.recipient.username}</h3>
                          <p className="text-sm text-slate-600">{request.recipient.email}</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm flex items-center space-x-1">
                        <Send className="w-4 h-4" />
                        <span>Sent</span>
                      </div>
                    </div>
                  ))}
                </div>

                {sentRequests.length === 0 && (
                  <div className="text-center py-4 text-slate-500">
                    No sent requests
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          setFriendToRemove(null);
        }}
        onConfirm={friendToRemove ? confirmRemoveFriend : removeMultipleFriends}
        title={friendToRemove ? "Remove Friend" : "Remove Multiple Friends"}
        message={
          friendToRemove
            ? `Are you sure you want to remove ${friendToRemove.name} from your friends list?`
            : `Are you sure you want to remove ${selectedFriends.size} friend${selectedFriends.size > 1 ? 's' : ''} from your list?`
        }
        confirmText="Remove"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default FriendManager;
