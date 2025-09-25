// Simple API handler for Vercel
// Note: This is a basic setup - Socket.IO has limitations on Vercel
const express = require('express');
const cors = require('cors');

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || "*",
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'API is running on Vercel'
  });
});

// Note: For full functionality including Socket.IO, 
// consider deploying to Railway, Render, or Heroku instead
app.get('/api/*', (req, res) => {
  res.status(501).json({ 
    error: 'Socket.IO and real-time features have limitations on Vercel',
    recommendation: 'Deploy to Railway, Render, or Heroku for full functionality'
  });
});

module.exports = app;