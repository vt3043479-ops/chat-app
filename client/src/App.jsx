import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { CallProvider } from './contexts/CallContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <CallProvider>
          <Router>
            <div className="h-screen w-full">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/chat" 
                  element={
                    <ProtectedRoute>
                      <Chat />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/" element={<Navigate to="/chat" replace />} />
              </Routes>
            </div>
          </Router>
        </CallProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
