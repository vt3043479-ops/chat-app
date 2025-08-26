import React, { useState } from 'react';
import { Search, Heart, Smile, Zap, Coffee, Music, Star, Sun, Moon, Cloud, Flame, Sparkles } from 'lucide-react';

const StickerPicker = ({ isOpen, onClose, onSelect }) => {
  const [selectedMood, setSelectedMood] = useState('happy');
  const [searchTerm, setSearchTerm] = useState('');

  // Mood-based sticker categories
  const moodCategories = {
    happy: {
      icon: Smile,
      color: 'from-yellow-400 to-orange-400',
      stickers: [
        { id: 1, emoji: '😊', name: 'Happy Face', tags: ['smile', 'joy'] },
        { id: 2, emoji: '😀', name: 'Grinning', tags: ['smile', 'happy'] },
        { id: 3, emoji: '😃', name: 'Big Smile', tags: ['joy', 'excited'] },
        { id: 4, emoji: '😄', name: 'Laughing', tags: ['laugh', 'happy'] },
        { id: 5, emoji: '😁', name: 'Beaming', tags: ['joy', 'bright'] },
        { id: 6, emoji: '🥰', name: 'Smiling Hearts', tags: ['love', 'happy'] },
        { id: 7, emoji: '😇', name: 'Angel', tags: ['innocent', 'pure'] },
        { id: 8, emoji: '🤗', name: 'Hugging', tags: ['hug', 'warm'] },
        { id: 9, emoji: '🎉', name: 'Party', tags: ['celebration', 'fun'] },
        { id: 10, emoji: '🌟', name: 'Star', tags: ['shine', 'bright'] },
        { id: 11, emoji: '✨', name: 'Sparkles', tags: ['magic', 'shine'] },
        { id: 12, emoji: '🎈', name: 'Balloon', tags: ['party', 'celebration'] },
        { id: 13, emoji: '🌈', name: 'Rainbow', tags: ['colorful', 'joy'] },
        { id: 14, emoji: '🦋', name: 'Butterfly', tags: ['beautiful', 'nature'] },
        { id: 15, emoji: '🌻', name: 'Sunflower', tags: ['bright', 'sunny'] },
        { id: 16, emoji: '🎊', name: 'Confetti', tags: ['celebration', 'party'] },
        { id: 17, emoji: '🌺', name: 'Hibiscus', tags: ['flower', 'tropical'] },
        { id: 18, emoji: '🌸', name: 'Cherry Blossom', tags: ['spring', 'beauty'] },
        { id: 19, emoji: '🎵', name: 'Music Note', tags: ['music', 'happy'] },
        { id: 20, emoji: '🎶', name: 'Musical Notes', tags: ['song', 'melody'] },
        { id: 21, emoji: '🌞', name: 'Sun', tags: ['bright', 'warm'] },
        { id: 22, emoji: '🍀', name: 'Four Leaf Clover', tags: ['luck', 'fortune'] },
        { id: 23, emoji: '🎯', name: 'Target', tags: ['goal', 'success'] },
        { id: 24, emoji: '🏆', name: 'Trophy', tags: ['winner', 'achievement'] },
      ]
    },
    love: {
      icon: Heart,
      color: 'from-pink-400 to-red-400',
      stickers: [
        { id: 25, emoji: '❤️', name: 'Red Heart', tags: ['love', 'passion'] },
        { id: 26, emoji: '💕', name: 'Two Hearts', tags: ['love', 'romance'] },
        { id: 27, emoji: '💖', name: 'Sparkling Heart', tags: ['love', 'sparkle'] },
        { id: 28, emoji: '💗', name: 'Growing Heart', tags: ['love', 'growing'] },
        { id: 29, emoji: '💓', name: 'Beating Heart', tags: ['heartbeat', 'love'] },
        { id: 30, emoji: '💞', name: 'Revolving Hearts', tags: ['love', 'romance'] },
        { id: 31, emoji: '💘', name: 'Heart Arrow', tags: ['cupid', 'love'] },
        { id: 32, emoji: '💝', name: 'Gift Heart', tags: ['present', 'love'] },
        { id: 33, emoji: '💟', name: 'Heart Decoration', tags: ['love', 'cute'] },
        { id: 34, emoji: '♥️', name: 'Heart Suit', tags: ['love', 'classic'] },
        { id: 35, emoji: '💌', name: 'Love Letter', tags: ['message', 'romance'] },
        { id: 36, emoji: '💋', name: 'Kiss', tags: ['kiss', 'lips'] },
        { id: 37, emoji: '🌹', name: 'Rose', tags: ['romantic', 'flower'] },
        { id: 38, emoji: '🌷', name: 'Tulip', tags: ['flower', 'spring'] },
        { id: 39, emoji: '🦢', name: 'Swan', tags: ['elegant', 'love'] },
        { id: 40, emoji: '💐', name: 'Bouquet', tags: ['flowers', 'gift'] },
        { id: 41, emoji: '🍫', name: 'Chocolate', tags: ['sweet', 'gift'] },
        { id: 42, emoji: '🍰', name: 'Cake', tags: ['celebration', 'sweet'] },
        { id: 43, emoji: '🎁', name: 'Gift', tags: ['present', 'surprise'] },
        { id: 44, emoji: '💍', name: 'Ring', tags: ['engagement', 'marriage'] },
        { id: 45, emoji: '👑', name: 'Crown', tags: ['queen', 'princess'] },
        { id: 46, emoji: '🦄', name: 'Unicorn', tags: ['magical', 'fantasy'] },
        { id: 47, emoji: '🌙', name: 'Crescent Moon', tags: ['romantic', 'night'] },
        { id: 48, emoji: '⭐', name: 'Star', tags: ['wish', 'dream'] },
      ]
    },
    excited: {
      icon: Zap,
      color: 'from-purple-400 to-blue-400',
      stickers: [
        { id: 49, emoji: '🤩', name: 'Star Eyes', tags: ['amazed', 'wow'] },
        { id: 50, emoji: '🥳', name: 'Party Face', tags: ['celebration', 'party'] },
        { id: 51, emoji: '🎉', name: 'Party Popper', tags: ['celebration', 'confetti'] },
        { id: 52, emoji: '🎊', name: 'Confetti Ball', tags: ['party', 'celebration'] },
        { id: 53, emoji: '⚡', name: 'Lightning', tags: ['energy', 'power'] },
        { id: 54, emoji: '🚀', name: 'Rocket', tags: ['fast', 'space'] },
        { id: 55, emoji: '🔥', name: 'Fire', tags: ['hot', 'energy'] },
        { id: 56, emoji: '💥', name: 'Explosion', tags: ['boom', 'impact'] },
        { id: 57, emoji: '🌟', name: 'Glowing Star', tags: ['shine', 'bright'] },
        { id: 58, emoji: '✨', name: 'Sparkles', tags: ['magic', 'excitement'] },
        { id: 59, emoji: '🎆', name: 'Fireworks', tags: ['celebration', 'spectacular'] },
        { id: 60, emoji: '🎇', name: 'Sparkler', tags: ['celebration', 'light'] },
        { id: 61, emoji: '🌈', name: 'Rainbow', tags: ['colorful', 'amazing'] },
        { id: 62, emoji: '🎪', name: 'Circus', tags: ['fun', 'entertainment'] },
        { id: 63, emoji: '🎭', name: 'Theater', tags: ['drama', 'performance'] },
        { id: 64, emoji: '🎨', name: 'Art Palette', tags: ['creative', 'artistic'] },
        { id: 65, emoji: '🏆', name: 'Trophy', tags: ['winner', 'achievement'] },
        { id: 66, emoji: '🥇', name: 'Gold Medal', tags: ['first', 'champion'] },
        { id: 67, emoji: '🎯', name: 'Direct Hit', tags: ['bullseye', 'success'] },
        { id: 68, emoji: '💎', name: 'Diamond', tags: ['precious', 'valuable'] },
        { id: 69, emoji: '🌪️', name: 'Tornado', tags: ['whirlwind', 'energy'] },
        { id: 70, emoji: '🌊', name: 'Wave', tags: ['ocean', 'power'] },
        { id: 71, emoji: '🔮', name: 'Crystal Ball', tags: ['magic', 'mystical'] },
        { id: 72, emoji: '🎸', name: 'Guitar', tags: ['music', 'rock'] },
      ]
    },
    chill: {
      icon: Coffee,
      color: 'from-green-400 to-teal-400',
      stickers: [
        { id: 73, emoji: '😌', name: 'Relieved', tags: ['calm', 'peaceful'] },
        { id: 74, emoji: '😎', name: 'Cool', tags: ['sunglasses', 'chill'] },
        { id: 75, emoji: '🧘‍♀️', name: 'Woman Meditating', tags: ['zen', 'peace'] },
        { id: 76, emoji: '🧘‍♂️', name: 'Man Meditating', tags: ['meditation', 'calm'] },
        { id: 77, emoji: '☕', name: 'Coffee', tags: ['relax', 'drink'] },
        { id: 78, emoji: '🍵', name: 'Tea', tags: ['hot', 'soothing'] },
        { id: 79, emoji: '🌿', name: 'Herb', tags: ['nature', 'fresh'] },
        { id: 80, emoji: '🍃', name: 'Leaves', tags: ['wind', 'nature'] },
        { id: 81, emoji: '🌱', name: 'Seedling', tags: ['growth', 'nature'] },
        { id: 82, emoji: '🌊', name: 'Wave', tags: ['ocean', 'calm'] },
        { id: 83, emoji: '🏖️', name: 'Beach', tags: ['vacation', 'relax'] },
        { id: 84, emoji: '🌅', name: 'Sunrise', tags: ['morning', 'peaceful'] },
        { id: 85, emoji: '🌄', name: 'Mountain Sunrise', tags: ['nature', 'serene'] },
        { id: 86, emoji: '🕯️', name: 'Candle', tags: ['peaceful', 'light'] },
        { id: 87, emoji: '🧸', name: 'Teddy Bear', tags: ['comfort', 'cozy'] },
        { id: 88, emoji: '🛋️', name: 'Couch', tags: ['comfort', 'relax'] },
        { id: 89, emoji: '🛁', name: 'Bathtub', tags: ['relax', 'spa'] },
        { id: 90, emoji: '🧖‍♀️', name: 'Woman Mage', tags: ['mystical', 'calm'] },
        { id: 91, emoji: '🦋', name: 'Butterfly', tags: ['peaceful', 'nature'] },
        { id: 92, emoji: '🐨', name: 'Koala', tags: ['sleepy', 'cute'] },
        { id: 93, emoji: '🐢', name: 'Turtle', tags: ['slow', 'peaceful'] },
        { id: 94, emoji: '🎋', name: 'Bamboo', tags: ['zen', 'nature'] },
        { id: 95, emoji: '🍀', name: 'Four Leaf Clover', tags: ['luck', 'nature'] },
        { id: 96, emoji: '🌸', name: 'Cherry Blossom', tags: ['spring', 'peaceful'] },
      ]
    },
    funny: {
      icon: Star,
      color: 'from-orange-400 to-yellow-400',
      stickers: [
        { id: 97, emoji: '😂', name: 'Tears of Joy', tags: ['funny', 'lol'] },
        { id: 98, emoji: '🤣', name: 'Rolling on Floor', tags: ['hilarious', 'laughter'] },
        { id: 99, emoji: '😆', name: 'Laughing', tags: ['funny', 'happy'] },
        { id: 100, emoji: '🤪', name: 'Zany Face', tags: ['silly', 'fun'] },
        { id: 101, emoji: '😜', name: 'Winking Tongue', tags: ['playful', 'silly'] },
        { id: 102, emoji: '😝', name: 'Squinting Tongue', tags: ['funny', 'teasing'] },
        { id: 103, emoji: '🙃', name: 'Upside Down', tags: ['silly', 'weird'] },
        { id: 104, emoji: '🤡', name: 'Clown', tags: ['funny', 'joke'] },
        { id: 105, emoji: '🤭', name: 'Hand Over Mouth', tags: ['giggle', 'secret'] },
        { id: 106, emoji: '🤫', name: 'Shushing', tags: ['quiet', 'secret'] },
        { id: 107, emoji: '🤓', name: 'Nerd Face', tags: ['smart', 'geeky'] },
        { id: 108, emoji: '🥸', name: 'Disguised Face', tags: ['funny', 'disguise'] },
        { id: 109, emoji: '🦄', name: 'Unicorn', tags: ['magical', 'fun'] },
        { id: 110, emoji: '🐒', name: 'Monkey', tags: ['playful', 'funny'] },
        { id: 111, emoji: '🙈', name: 'See No Evil', tags: ['monkey', 'shy'] },
        { id: 112, emoji: '🙉', name: 'Hear No Evil', tags: ['monkey', 'ignore'] },
        { id: 113, emoji: '🙊', name: 'Speak No Evil', tags: ['monkey', 'quiet'] },
        { id: 114, emoji: '🐸', name: 'Frog', tags: ['funny', 'green'] },
        { id: 115, emoji: '🐷', name: 'Pig', tags: ['cute', 'funny'] },
        { id: 116, emoji: '🤖', name: 'Robot', tags: ['funny', 'tech'] },
        { id: 117, emoji: '👽', name: 'Alien', tags: ['funny', 'space'] },
        { id: 118, emoji: '🎪', name: 'Circus', tags: ['fun', 'entertainment'] },
        { id: 119, emoji: '🎭', name: 'Theater Masks', tags: ['drama', 'comedy'] },
        { id: 120, emoji: '🍌', name: 'Banana', tags: ['funny', 'fruit'] },
      ]
    },
    sleepy: {
      icon: Moon,
      color: 'from-indigo-400 to-purple-400',
      stickers: [
        { id: 121, emoji: '😴', name: 'Sleeping Face', tags: ['tired', 'sleep'] },
        { id: 122, emoji: '😪', name: 'Sleepy Face', tags: ['drowsy', 'tired'] },
        { id: 123, emoji: '🥱', name: 'Yawning Face', tags: ['tired', 'sleepy'] },
        { id: 124, emoji: '💤', name: 'Zzz', tags: ['sleep', 'snoring'] },
        { id: 125, emoji: '🌙', name: 'Crescent Moon', tags: ['night', 'peaceful'] },
        { id: 126, emoji: '🌛', name: 'First Quarter Moon Face', tags: ['night', 'sleepy'] },
        { id: 127, emoji: '🌜', name: 'Last Quarter Moon Face', tags: ['night', 'dreamy'] },
        { id: 128, emoji: '🌚', name: 'New Moon Face', tags: ['night', 'dark'] },
        { id: 129, emoji: '⭐', name: 'Star', tags: ['night', 'dream'] },
        { id: 130, emoji: '🌟', name: 'Glowing Star', tags: ['night', 'bright'] },
        { id: 131, emoji: '✨', name: 'Sparkles', tags: ['dreamy', 'magic'] },
        { id: 132, emoji: '🌌', name: 'Milky Way', tags: ['night', 'space'] },
        { id: 133, emoji: '🌃', name: 'Night with Stars', tags: ['city', 'night'] },
        { id: 134, emoji: '🌉', name: 'Bridge at Night', tags: ['night', 'peaceful'] },
        { id: 135, emoji: '🛏️', name: 'Bed', tags: ['sleep', 'rest'] },
        { id: 136, emoji: '🛌', name: 'Person in Bed', tags: ['sleeping', 'rest'] },
        { id: 137, emoji: '🧸', name: 'Teddy Bear', tags: ['comfort', 'sleep'] },
        { id: 138, emoji: '🦉', name: 'Owl', tags: ['night', 'wise'] },
        { id: 139, emoji: '🦇', name: 'Bat', tags: ['night', 'dark'] },
        { id: 140, emoji: '☁️', name: 'Cloud', tags: ['soft', 'dreamy'] },
        { id: 141, emoji: '🌫️', name: 'Fog', tags: ['misty', 'dreamy'] },
        { id: 142, emoji: '🕯️', name: 'Candle', tags: ['dim', 'peaceful'] },
        { id: 143, emoji: '🔮', name: 'Crystal Ball', tags: ['dreams', 'mystical'] },
        { id: 144, emoji: '🎭', name: 'Theater Masks', tags: ['dreams', 'fantasy'] },
      ]
    }
  };

  const handleStickerSelect = (sticker) => {
    onSelect(sticker, 'sticker');
  };

  const filteredStickers = selectedMood 
    ? moodCategories[selectedMood].stickers.filter(sticker =>
        searchTerm === '' ||
        sticker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sticker.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-16 left-4 right-4">
      <div className="glass rounded-2xl shadow-xl border border-white/20 max-h-80 w-full max-w-md mx-auto overflow-hidden">
        {/* Compact Header */}
        <div className="p-3 border-b border-white/20 bg-white/90">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-slate-800 flex items-center">
              <span className="text-lg mr-2">🎭</span>
              Mood Stickers
            </h3>
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Compact Search */}
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white/70 border border-white/40 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 placeholder-slate-400 text-xs"
            />
          </div>

          {/* Compact Mood Categories */}
          <div className="flex space-x-1 overflow-x-auto scrollbar-thin">
            {Object.entries(moodCategories).map(([mood, category]) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`flex-shrink-0 flex items-center space-x-1 px-2.5 py-1.5 rounded-full transition-all duration-200 text-xs font-medium ${
                    selectedMood === mood
                      ? `bg-gradient-to-r ${category.color} text-white shadow-md`
                      : 'bg-white/50 hover:bg-white/70 text-slate-600'
                  }`}
                >
                  <IconComponent className="w-3 h-3" />
                  <span className="capitalize">{mood}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Compact Stickers Grid */}
        <div className="h-48 overflow-y-auto scrollbar-thin p-3">
          {filteredStickers.length > 0 ? (
            <div className="grid grid-cols-5 gap-2">
              {filteredStickers.map((sticker) => (
                <button
                  key={sticker.id}
                  onClick={() => handleStickerSelect(sticker)}
                  className="aspect-square bg-white/50 hover:bg-white/80 rounded-xl flex flex-col items-center justify-center p-2 hover-lift hover:shadow-md transition-all duration-200 group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                    {sticker.emoji}
                  </span>
                  <span className="text-xs text-slate-600 font-medium text-center leading-tight mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {sticker.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 font-medium text-sm">No stickers found</p>
                <p className="text-slate-400 text-xs">Try a different mood</p>
              </div>
            </div>
          )}
        </div>

        {/* Compact Footer */}
        <div className="px-3 py-2 border-t border-white/20 bg-white/90">
          <p className="text-xs text-slate-500 text-center">
            🎨 Express your mood!
          </p>
        </div>
      </div>
    </div>
  );
};

export default StickerPicker;
