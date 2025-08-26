import React from 'react';
import { useCall } from '../contexts/CallContext';
import { Phone, PhoneOff, Video } from 'lucide-react';

const IncomingCallModal = () => {
  const { incomingCall, answerCall, rejectCall } = useCall();

  if (!incomingCall) return null;

  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 call-overlay flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {/* Caller Avatar */}
          <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-semibold">
              {getInitials(incomingCall.callerName)}
            </span>
          </div>

          {/* Caller Info */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {incomingCall.callerName}
          </h3>
          
          <div className="flex items-center justify-center space-x-2 mb-6">
            {incomingCall.callType === 'video' ? (
              <Video className="w-5 h-5 text-gray-500" />
            ) : (
              <Phone className="w-5 h-5 text-gray-500" />
            )}
            <p className="text-gray-500">
              Incoming {incomingCall.callType} call
            </p>
          </div>

          {/* Ringing Animation */}
          <div className="mb-8">
            <div className="relative">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <div className="absolute inset-0 w-16 h-16 bg-green-500 rounded-full mx-auto animate-ping opacity-20"></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-8">
            {/* Reject Button */}
            <button
              onClick={rejectCall}
              className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors shadow-lg"
            >
              <PhoneOff className="w-8 h-8 text-white" />
            </button>

            {/* Answer Button */}
            <button
              onClick={answerCall}
              className="w-16 h-16 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-colors shadow-lg"
            >
              <Phone className="w-8 h-8 text-white" />
            </button>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            <p>Swipe to answer or decline</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
