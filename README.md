# Real-time Chat Application

A modern real-time chat application with text messaging, voice calls, and video chat capabilities built with React, Node.js, Socket.IO, and WebRTC.

## Features

- **Real-time Messaging**: Instant text messaging with Socket.IO
- **Voice & Video Calls**: WebRTC-powered voice and video calling
- **User Authentication**: JWT-based authentication system
- **Online Presence**: See who's online in real-time
- **Typing Indicators**: Know when someone is typing
- **Read Receipts**: See when messages are read
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Socket.IO Client** - Real-time communication
- **WebRTC** - Voice/video calling
- **React Router** - Navigation
- **Axios** - HTTP client

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd realtime-chat-app
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Copy the example environment file in the server directory:
   ```bash
   cp server/.env.example server/.env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/chatapp
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Ubuntu/Debian
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```

## Running the Application

### Development Mode

Start both the server and client in development mode:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:4000`
- Frontend client on `http://localhost:5173`

### Individual Services

You can also run the services individually:

```bash
# Start only the backend server
npm run server:dev

# Start only the frontend client
npm run client:dev
```

### Production Mode

1. **Build the client**
   ```bash
   npm run build
   ```

2. **Start the server**
   ```bash
   npm start
   ```

## Usage

1. **Register/Login**
   - Open `http://localhost:5173` in your browser
   - Create a new account or login with existing credentials

2. **Start Chatting**
   - Select a user from the sidebar to start a conversation
   - Type messages in the input field and press Enter to send
   - See typing indicators and read receipts in real-time

3. **Voice/Video Calls**
   - Click the phone icon for voice calls
   - Click the video icon for video calls
   - Accept or reject incoming calls
   - Use mute/unmute and video on/off controls during calls

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/search` - Search users
- `GET /api/users/:userId` - Get user by ID
- `PUT /api/users/profile` - Update user profile

### Messages
- `GET /api/messages/conversation/:userId` - Get conversation messages
- `GET /api/messages/conversations` - Get all conversations
- `POST /api/messages/send` - Send a message
- `PUT /api/messages/read/:userId` - Mark messages as read

## Socket.IO Events

### Client to Server
- `send-message` - Send a message
- `typing-start` - Start typing indicator
- `typing-stop` - Stop typing indicator
- `mark-messages-read` - Mark messages as read
- `call-user` - Initiate a call
- `answer-call` - Answer a call
- `reject-call` - Reject a call
- `end-call` - End a call
- `ice-candidate` - WebRTC ICE candidate

### Server to Client
- `new-message` - Receive a new message
- `message-sent` - Message sent confirmation
- `user-online` - User came online
- `user-offline` - User went offline
- `user-typing` - User is typing
- `user-stopped-typing` - User stopped typing
- `incoming-call` - Incoming call
- `call-answered` - Call was answered
- `call-rejected` - Call was rejected
- `call-ended` - Call was ended

## WebRTC Configuration

The application uses Google's STUN servers for NAT traversal:
- `stun:stun.l.google.com:19302`
- `stun:stun1.l.google.com:19302`

For production use with users behind restrictive firewalls, consider setting up TURN servers.

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the `MONGODB_URI` in your `.env` file

2. **WebRTC Not Working**
   - Ensure you're using HTTPS in production
   - Check browser permissions for camera/microphone
   - Verify STUN/TURN server configuration

3. **Socket.IO Connection Issues**
   - Check CORS configuration
   - Verify the `CLIENT_URL` in your `.env` file

### Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS 11+)
- **Edge**: Full support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please create an issue in the repository.
