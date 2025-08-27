import React, { useState } from 'react';
import { Search, UserPlus, X, Loader } from 'lucide-react';
import axios from 'axios';

const QuickAddFriend = ({ isOpen, onClose, onFriendAdded }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

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

  const sendFriendRequest = async (userId, username) => {
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
      
      // Add to recent searches
      setRecentSearches(prev => {
        const newRecent = prev.filter(item => item.id !== userId);
        return [{ id: userId, username }, ...newRecent].slice(0, 5);
      });

      if (onFriendAdded) {
        onFriendAdded();
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
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
            <Loader className="w-3 h-3 animate-spin" />
            <span>Sent</span>
          </button>
        );
      case 'accepted':
        return (
          <button
            disabled
            className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm"
          >
            Friends
          </button>
        );
      default:
        return (
          <button
            onClick={() => sendFriendRequest(user._id, user.username)}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm flex items-center space-x-1 transition-colors"
          >
            <UserPlus className="w-3 h-3" />
            <span>Add</span>
          </button>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-slate-800">Add Friends</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          )}

          {!loading && searchQuery && searchResults.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p>No users found for "{searchQuery}"</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="p-4 space-y-3">
              {searchResults.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        getInitials(user.username)
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">{user.username}</h4>
                      <p className="text-xs text-slate-600">{user.email}</p>
                    </div>
                  </div>
                  {getFriendshipStatusButton(user)}
                </div>
              ))}
            </div>
          )}

          {!searchQuery && recentSearches.length > 0 && (
            <div className="p-4">
              <h4 className="text-sm font-medium text-slate-700 mb-3">Recent Searches</h4>
              <div className="space-y-2">
                {recentSearches.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSearchQuery(item.username)}
                    className="w-full text-left p-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    {item.username}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!searchQuery && recentSearches.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <UserPlus className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm">Start typing to search for friends</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickAddFriend;
