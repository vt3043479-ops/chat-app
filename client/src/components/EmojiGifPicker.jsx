import React, { useState, useEffect } from 'react';
import { Search, Smile, Heart, Zap, Coffee, Music, Star, Sun } from 'lucide-react';

const EmojiGifPicker = ({ isOpen, onClose, onSelect, type = 'emoji' }) => {
  const [activeTab, setActiveTab] = useState('emoji');
  const [searchTerm, setSearchTerm] = useState('');
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Emoji categories with actual emojis
  const emojiCategories = {
    recent: {
      icon: '🕒',
      emojis: ['😀', '😂', '🥰', '😍', '🤔', '👍', '❤️', '🔥', '💯', '🎉', '👏', '🙌']
    },
    smileys: {
      icon: '😀',
      emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐']
    },
    hearts: {
      icon: '❤️',
      emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️', '💌', '💋', '💍', '💎']
    },
    animals: {
      icon: '🐶',
      emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔']
    },
    food: {
      icon: '🍕',
      emojis: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯']
    },
    activities: {
      icon: '⚽',
      emojis: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️‍♀️', '🏋️', '🏋️‍♂️', '🤼‍♀️', '🤼', '🤼‍♂️', '🤸‍♀️', '🤸', '🤸‍♂️', '⛹️‍♀️', '⛹️', '⛹️‍♂️', '🤺', '🤾‍♀️', '🤾', '🤾‍♂️', '🏌️‍♀️', '🏌️', '🏌️‍♂️', '🏇', '🧘‍♀️', '🧘', '🧘‍♂️', '🏄‍♀️', '🏄', '🏄‍♂️', '🏊‍♀️', '🏊', '🏊‍♂️', '🤽‍♀️', '🤽', '🤽‍♂️', '🚣‍♀️', '🚣', '🚣‍♂️', '🧗‍♀️', '🧗', '🧗‍♂️', '🚵‍♀️', '🚵', '🚵‍♂️', '🚴‍♀️', '🚴', '🚴‍♂️', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️', '🎪', '🤹‍♀️', '🤹', '🤹‍♂️', '🎭', '🩰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🥁', '🪘', '🎹', '🎷', '🎺', '🪗', '🎸', '🪕', '🎻', '🎲', '♠️', '♥️', '♦️', '♣️', '♟️', '🃏', '🀄', '🎴']
    }
  };

  // Mock GIF data - in a real app, you'd use Giphy API
  const mockGifs = [
    { id: 1, url: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif', title: 'Happy' },
    { id: 2, url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif', title: 'Excited' },
    { id: 3, url: 'https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif', title: 'Love' },
    { id: 4, url: 'https://media.giphy.com/media/3o6Zt4HU9uwXmXSAuI/giphy.gif', title: 'Funny' },
    { id: 5, url: 'https://media.giphy.com/media/l0HlvtIPzPdt2usKs/giphy.gif', title: 'Cool' },
    { id: 6, url: 'https://media.giphy.com/media/26u4lOMA8JKSnL9Uk/giphy.gif', title: 'Dance' },
  ];

  useEffect(() => {
    if (activeTab === 'gif') {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setGifs(mockGifs);
        setLoading(false);
      }, 500);
    }
  }, [activeTab]);

  const handleEmojiSelect = (emoji) => {
    onSelect(emoji, 'emoji');
  };

  const handleGifSelect = (gif) => {
    onSelect(gif, 'gif');
  };

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-16 left-4 right-4">
      <div className="glass rounded-2xl shadow-xl border border-white/20 max-h-72 w-full max-w-md mx-auto overflow-hidden">
        {/* Compact Header Tabs */}
        <div className="flex border-b border-white/20 bg-white/90">
          <button
            onClick={() => setActiveTab('emoji')}
            className={`flex-1 px-3 py-2 text-xs font-semibold transition-colors ${
              activeTab === 'emoji'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50/50'
            }`}
          >
            😀 Emojis
          </button>
          <button
            onClick={() => setActiveTab('gif')}
            className={`flex-1 px-3 py-2 text-xs font-semibold transition-colors ${
              activeTab === 'gif'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50/50'
            }`}
          >
            🎬 GIFs
          </button>
        </div>

        {/* Compact Search */}
        <div className="p-3 border-b border-white/20">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder={`Search ${activeTab}s...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white/70 border border-white/40 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 placeholder-slate-400 text-xs"
            />
          </div>
        </div>

        {/* Compact Content */}
        <div className="h-44 overflow-y-auto scrollbar-thin">
          {activeTab === 'emoji' && (
            <div className="p-3">
              {/* Compact Emoji Categories */}
              <div className="flex space-x-1 mb-3 overflow-x-auto scrollbar-thin">
                {Object.entries(emojiCategories).map(([key, category]) => (
                  <button
                    key={key}
                    className="flex-shrink-0 w-7 h-7 bg-white/50 hover:bg-white/80 rounded-full flex items-center justify-center transition-colors"
                    title={key}
                  >
                    <span className="text-sm">{category.icon}</span>
                  </button>
                ))}
              </div>

              {/* Compact Emoji Grid */}
              <div className="grid grid-cols-10 gap-1">
                {Object.values(emojiCategories).flatMap(category =>
                  category.emojis
                    .filter(emoji =>
                      searchTerm === '' ||
                      emoji.includes(searchTerm)
                    )
                    .slice(0, 50) // Limit for performance
                    .map((emoji, index) => (
                      <button
                        key={`${emoji}-${index}`}
                        onClick={() => handleEmojiSelect(emoji)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-white/60 rounded-md transition-colors text-sm hover-lift"
                      >
                        {emoji}
                      </button>
                    ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'gif' && (
            <div className="p-3">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {gifs
                    .filter(gif =>
                      searchTerm === '' ||
                      gif.title.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((gif) => (
                      <button
                        key={gif.id}
                        onClick={() => handleGifSelect(gif)}
                        className="aspect-square bg-slate-100 rounded-xl overflow-hidden hover-lift hover:shadow-md transition-all duration-200"
                      >
                        <img
                          src={gif.url}
                          alt={gif.title}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmojiGifPicker;
