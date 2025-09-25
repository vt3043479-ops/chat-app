const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const userRoutes = require('./routes/users');
const friendRoutes = require('./routes/friends');
const socketHandler = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
};

app.use(cors(corsOptions));

// Socket.IO setup
const io = socketIo(server, {
  cors: corsOptions
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(express.json());

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

// MongoDB connection with debug logging
console.log('Attempting to connect to MongoDB...');
mongoose.set('strictQuery', true);

// Connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  family: 4 // Use IPv4, skip trying IPv6
};

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chat';
console.log('MongoDB URI:', mongoURI);

mongoose.connect(mongoURI, mongoOptions)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    // Test the connection by listing databases
    mongoose.connection.db.admin().listDatabases()
      .then(result => {
        console.log('Available databases:', result.databases.map(db => db.name));
      })
      .catch(err => {
        console.error('Error listing databases:', err);
      });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if cannot connect to database
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/friends', friendRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app build directory
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
} else {
  // Health check for development
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });
}

// Socket.IO handling
socketHandler(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };
