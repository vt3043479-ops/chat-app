import React from 'react';
import { useCall } from '../contexts/CallContext';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';

const CallModal = () => {
  const {
    callType,
    callStatus,
    isCallMuted,
    isVideoEnabled,
    localVideoRef,
    remoteVideoRef,
    endCall,
    toggleMute,
    toggleVideo
  } = useCall();

  return (
    <div className="fixed inset-0 z-50 call-overlay flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-4xl h-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                {callType === 'video' ? 'Video Call' : 'Voice Call'}
              </h3>
              <p className="text-sm text-gray-300 capitalize">{callStatus}</p>
            </div>
            <button
              onClick={endCall}
              className="p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 relative bg-black rounded-lg mx-4 mb-4 overflow-hidden">
          {callType === 'video' ? (
            <>
              {/* Remote Video */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              
              {/* Local Video (Picture-in-Picture) */}
              <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {!isVideoEnabled && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <VideoOff className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Voice Call UI */
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white">
                <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-16 h-16" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Voice Call</h3>
                <p className="text-gray-300 capitalize">{callStatus}</p>
                {callStatus === 'calling' && (
                  <div className="mt-4">
                    <div className="animate-pulse text-sm">Calling...</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Connection Status Overlay */}
          {callStatus === 'calling' && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>Connecting...</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-4">
          <div className="flex items-center justify-center space-x-4">
            {/* Mute Button */}
            <button
              onClick={toggleMute}
              className={`p-4 rounded-full transition-colors ${
                isCallMuted 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isCallMuted ? (
                <MicOff className="w-6 h-6 text-white" />
              ) : (
                <Mic className="w-6 h-6 text-white" />
              )}
            </button>

            {/* Video Toggle (only for video calls) */}
            {callType === 'video' && (
              <button
                onClick={toggleVideo}
                className={`p-4 rounded-full transition-colors ${
                  !isVideoEnabled 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {isVideoEnabled ? (
                  <Video className="w-6 h-6 text-white" />
                ) : (
                  <VideoOff className="w-6 h-6 text-white" />
                )}
              </button>
            )}

            {/* End Call Button */}
            <button
              onClick={endCall}
              className="p-4 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
            >
              <PhoneOff className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallModal;
