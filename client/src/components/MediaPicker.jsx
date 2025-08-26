import React, { useState, useRef } from 'react';
import { 
  Image, 
  Video, 
  FileText, 
  Camera, 
  Upload, 
  X, 
  Play,
  Download,
  Eye
} from 'lucide-react';

const MediaPicker = ({ isOpen, onClose, onMediaSelect }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const processedFiles = fileArray.map(file => ({
      file,
      id: Date.now() + Math.random(),
      type: file.type.startsWith('image/') ? 'image' : 
            file.type.startsWith('video/') ? 'video' : 'file',
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file)
    }));
    
    setSelectedFiles(prev => [...prev, ...processedFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeFile = (id) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== id));
  };

  const handleSend = () => {
    if (selectedFiles.length > 0) {
      onMediaSelect(selectedFiles);
      setSelectedFiles([]);
      onClose();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Compact Modal */}
      <div className="relative w-full max-w-lg max-h-[70vh] overflow-y-auto glass rounded-2xl shadow-xl">
        {/* Compact Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <h2 className="text-lg font-bold text-slate-800 flex items-center">
            <span className="text-xl mr-2">📎</span>
            Share Media
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center hover:bg-white/50 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Compact Content */}
        <div className="p-4 space-y-4">
          {/* Compact Quick Actions */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center space-y-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-200 hover-lift"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Image className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Photos</span>
            </button>

            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex flex-col items-center space-y-2 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-all duration-200 hover-lift"
            >
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Camera</span>
            </button>

            <button
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.accept = '*/*';
                input.onchange = (e) => handleFileSelect(e.target.files);
                input.click();
              }}
              className="flex flex-col items-center space-y-2 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all duration-200 hover-lift"
            >
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Files</span>
            </button>
          </div>

          {/* Compact Drag & Drop Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 mb-1">
              Drag & drop files here
            </p>
            <p className="text-xs text-slate-500">
              or click to browse
            </p>
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800">
                Selected Files ({selectedFiles.length})
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto scrollbar-modern">
                {selectedFiles.map((fileItem) => (
                  <div key={fileItem.id} className="relative bg-white/80 rounded-2xl p-4 border border-white/40 hover:shadow-md transition-all duration-200">
                    <button
                      onClick={() => removeFile(fileItem.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>

                    {fileItem.type === 'image' && (
                      <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden mb-3">
                        <img 
                          src={fileItem.url} 
                          alt={fileItem.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {fileItem.type === 'video' && (
                      <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden mb-3 relative">
                        <video 
                          src={fileItem.url}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                            <Play className="w-6 h-6 text-white ml-1" />
                          </div>
                        </div>
                      </div>
                    )}

                    {fileItem.type === 'file' && (
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-slate-600" />
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="font-semibold text-slate-800 text-sm truncate">
                        {fileItem.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatFileSize(fileItem.size)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              onClick={onClose}
              className="btn-secondary flex-1 py-3"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={selectedFiles.length === 0}
              className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Send {selectedFiles.length > 0 && `(${selectedFiles.length})`}
            </button>
          </div>
        </div>

        {/* Hidden File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*,video/*"
          capture="environment"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default MediaPicker;
