# Quick Setup Guide

Follow these steps to get your real-time chat application running quickly.

## Prerequisites Check

Make sure you have these installed:
- Node.js (v16+): `node --version`
- MongoDB (v4.4+): `mongod --version`
- npm: `npm --version`

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Start MongoDB
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Windows
net start MongoDB

# Or run manually
mongod
```

### 3. Start the Application
```bash
npm run dev
```

This starts both the server (port 4000) and client (port 5173).

### 4. Open Your Browser
Go to `http://localhost:5173`

### 5. Create Accounts and Test
1. Register a new account
2. Open another browser/incognito window
3. Register another account
4. Start chatting and test voice/video calls!

## Environment Configuration

The app works out of the box with default settings. If you need to customize:

1. Copy `server/.env.example` to `server/.env`
2. Update the values as needed:
   ```env
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/chatapp
   JWT_SECRET=your-secret-key
   CLIENT_URL=http://localhost:5173
   ```

## Troubleshooting

### MongoDB Issues
- **Connection failed**: Make sure MongoDB is running
- **Permission denied**: Check MongoDB data directory permissions

### Port Issues
- **Port 4000 in use**: Change `PORT` in `server/.env`
- **Port 5173 in use**: The client will automatically use the next available port

### WebRTC Issues
- **Camera/mic not working**: Check browser permissions
- **Calls not connecting**: Try refreshing both browser windows

## Testing the Features

### Text Messaging
1. Register two users in different browser windows
2. Select a user from the sidebar
3. Type messages and see real-time delivery
4. Notice typing indicators and read receipts

### Voice Calls
1. Click the phone icon in the chat header
2. Accept the call in the other window
3. Test mute/unmute functionality

### Video Calls
1. Click the video icon in the chat header
2. Accept the call in the other window
3. Test camera on/off and mute controls

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Customize the UI by modifying Tailwind classes
- Add more features like file sharing or group chats
- Deploy to production (see deployment section in README)

## Need Help?

- Check the browser console for errors
- Verify all services are running
- Ensure MongoDB is accessible
- Check network connectivity for WebRTC features
