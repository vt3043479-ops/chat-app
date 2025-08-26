import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';

const CallContext = createContext();

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};

export const CallProvider = ({ children }) => {
  const [isInCall, setIsInCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callType, setCallType] = useState(null); // 'voice' or 'video'
  const [isCallMuted, setIsCallMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [callStatus, setCallStatus] = useState('idle'); // 'idle', 'calling', 'ringing', 'connected'
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  
  const { socket } = useSocket();
  const { user } = useAuth();

  // WebRTC configuration
  const rtcConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  useEffect(() => {
    if (!socket) return;

    // Handle incoming call
    socket.on('incoming-call', (data) => {
      setIncomingCall(data);
      setCallStatus('ringing');
    });

    // Handle call answered
    socket.on('call-answered', async (data) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(data.answer);
        setCallStatus('connected');
      }
    });

    // Handle call rejected
    socket.on('call-rejected', () => {
      endCall();
    });

    // Handle call ended
    socket.on('call-ended', () => {
      endCall();
    });

    // Handle ICE candidates
    socket.on('ice-candidate', async (data) => {
      if (peerConnectionRef.current && data.candidate) {
        try {
          await peerConnectionRef.current.addIceCandidate(data.candidate);
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      }
    });

    return () => {
      socket.off('incoming-call');
      socket.off('call-answered');
      socket.off('call-rejected');
      socket.off('call-ended');
      socket.off('ice-candidate');
    };
  }, [socket]);

  const createPeerConnection = () => {
    const peerConnection = new RTCPeerConnection(rtcConfiguration);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('ice-candidate', {
          recipientId: incomingCall?.callerId || currentCallRecipient,
          candidate: event.candidate
        });
      }
    };

    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    return peerConnection;
  };

  const getMediaStream = async (video = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: video,
        audio: true
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  };

  const startCall = async (recipientId, type = 'video') => {
    try {
      setCallType(type);
      setCallStatus('calling');
      setIsInCall(true);
      
      // Get media stream
      const stream = await getMediaStream(type === 'video');
      localStreamRef.current = stream;
      
      // Create peer connection
      peerConnectionRef.current = createPeerConnection();
      
      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnectionRef.current.addTrack(track, stream);
      });
      
      // Create offer
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      
      // Send call invitation
      socket.emit('call-user', {
        recipientId,
        offer,
        callType: type
      });
      
      window.currentCallRecipient = recipientId;
      
    } catch (error) {
      console.error('Error starting call:', error);
      endCall();
    }
  };

  const answerCall = async () => {
    try {
      if (!incomingCall) return;
      
      setIsInCall(true);
      setCallType(incomingCall.callType);
      setCallStatus('connected');
      
      // Get media stream
      const stream = await getMediaStream(incomingCall.callType === 'video');
      localStreamRef.current = stream;
      
      // Create peer connection
      peerConnectionRef.current = createPeerConnection();
      
      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnectionRef.current.addTrack(track, stream);
      });
      
      // Set remote description
      await peerConnectionRef.current.setRemoteDescription(incomingCall.offer);
      
      // Create answer
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      
      // Send answer
      socket.emit('answer-call', {
        callerId: incomingCall.callerId,
        answer
      });
      
      setIncomingCall(null);
      
    } catch (error) {
      console.error('Error answering call:', error);
      rejectCall();
    }
  };

  const rejectCall = () => {
    if (incomingCall) {
      socket.emit('reject-call', {
        callerId: incomingCall.callerId
      });
    }
    setIncomingCall(null);
    setCallStatus('idle');
  };

  const endCall = () => {
    // Notify other party
    if (socket && (incomingCall?.callerId || window.currentCallRecipient)) {
      socket.emit('end-call', {
        recipientId: incomingCall?.callerId || window.currentCallRecipient
      });
    }
    
    // Clean up local resources
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    
    // Reset state
    setIsInCall(false);
    setIncomingCall(null);
    setCallType(null);
    setCallStatus('idle');
    setIsCallMuted(false);
    setIsVideoEnabled(true);
    window.currentCallRecipient = null;
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsCallMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const value = {
    isInCall,
    incomingCall,
    callType,
    callStatus,
    isCallMuted,
    isVideoEnabled,
    localVideoRef,
    remoteVideoRef,
    startCall,
    answerCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleVideo
  };

  return (
    <CallContext.Provider value={value}>
      {children}
    </CallContext.Provider>
  );
};
