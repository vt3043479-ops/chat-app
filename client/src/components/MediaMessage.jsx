import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Download, 
  Eye, 
  FileText, 
  Image as ImageIcon, 
  Video,
  X,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

const MediaMessage = ({ media, isOwnMessage }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);

  if (!media || !media.type) {
    return null;
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const MediaViewer = ({ media, onClose }) => (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative max-w-4xl max-h-full">
        {/* Controls */}
        <div className="absolute top-4 right-4 flex space-x-2 z-10">
          <button
            onClick={() => setZoom(prev => Math.min(prev + 0.25, 3))}
            className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(prev - 0.25, 0.5))}
            className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDownload(media.url, media.name)}
            className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Content */}
        <div className="flex items-center justify-center">
          {media.type === 'image' && (
            <img
              src={media.url}
              alt={media.name}
              className="max-w-full max-h-full object-contain rounded-lg transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
            />
          )}
          {media.type === 'video' && (
            <video
              src={media.url}
              controls
              className="max-w-full max-h-full object-contain rounded-lg"
              style={{ transform: `scale(${zoom})` }}
            />
          )}
        </div>

        {/* Info */}
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg">
          <p className="font-semibold">{media.name}</p>
          <p className="text-sm opacity-75">{formatFileSize(media.size)}</p>
        </div>
      </div>
    </div>
  );

  if (media.type === 'image') {
    return (
      <>
        <div className={`relative group cursor-pointer ${
          isOwnMessage ? 'ml-auto' : 'mr-auto'
        } max-w-xs lg:max-w-sm`}>
          <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover-lift">
            <img
              src={media.url}
              alt={media.name}
              className="w-full h-auto object-cover"
              onClick={() => setShowFullscreen(true)}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                <button
                  onClick={() => setShowFullscreen(true)}
                  className="p-2 bg-white/90 text-slate-700 rounded-full hover:bg-white transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDownload(media.url, media.name)}
                  className="p-2 bg-white/90 text-slate-700 rounded-full hover:bg-white transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Caption */}
          {media.name && (
            <p className="text-xs text-slate-500 mt-1 px-2">{media.name}</p>
          )}
        </div>

        {showFullscreen && (
          <MediaViewer media={media} onClose={() => setShowFullscreen(false)} />
        )}
      </>
    );
  }

  if (media.type === 'video') {
    return (
      <>
        <div className={`relative group ${
          isOwnMessage ? 'ml-auto' : 'mr-auto'
        } max-w-xs lg:max-w-sm`}>
          <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover-lift">
            <video
              src={media.url}
              className="w-full h-auto object-cover cursor-pointer"
              poster={media.thumbnail}
              onClick={() => setShowFullscreen(true)}
            />
            


            {/* Controls */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => handleDownload(media.url, media.name)}
                className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Caption */}
          {media.name && (
            <p className="text-xs text-slate-500 mt-1 px-2">{media.name}</p>
          )}
        </div>

        {showFullscreen && (
          <MediaViewer media={media} onClose={() => setShowFullscreen(false)} />
        )}
      </>
    );
  }

  if (media.type === 'file') {
    return (
      <div className={`${
        isOwnMessage ? 'ml-auto' : 'mr-auto'
      } max-w-xs lg:max-w-sm`}>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-200 hover-lift">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-slate-600" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 text-sm truncate">
                {media.name}
              </p>
              <p className="text-xs text-slate-500">
                {formatFileSize(media.size)}
              </p>
            </div>
            
            <button
              onClick={() => handleDownload(media.url, media.name)}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors flex-shrink-0"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (media.type === 'gif') {
    return (
      <div className={`${
        isOwnMessage ? 'ml-auto' : 'mr-auto'
      } max-w-xs lg:max-w-sm`}>
        <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover-lift">
          <img
            src={media.url}
            alt={media.title || 'GIF'}
            className="w-full h-auto object-cover"
          />
          
          {/* GIF Label */}
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 bg-black/50 text-white text-xs font-semibold rounded-full">
              GIF
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (media.type === 'sticker') {
    return (
      <div className={`${
        isOwnMessage ? 'ml-auto' : 'mr-auto'
      } max-w-32`}>
        <div className="bg-transparent p-2 hover-lift transition-all duration-200 hover:scale-110">
          <span className="text-6xl block text-center">
            {media.emoji}
          </span>
        </div>
      </div>
    );
  }

  return null;
};

export default MediaMessage;
