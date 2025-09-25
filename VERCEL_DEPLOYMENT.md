# Vercel Deployment Guide

## Prerequisites

1. **MongoDB Database**: Set up a MongoDB database (preferably MongoDB Atlas for cloud deployment)
2. **Vercel Account**: Create an account at [vercel.com](https://vercel.com)
3. **Environment Variables**: Prepare your environment variables

## Step 1: Set up MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Create a new cluster (free tier is sufficient for testing)
3. Create a database user with read/write permissions
4. Get your connection string (it should look like: `mongodb+srv://username:password@cluster.mongodb.net/chatapp?retryWrites=true&w=majority`)

## Step 2: Deploy to Vercel

### Option A: Deploy via GitHub (Recommended)

1. Push your code to GitHub (already done)
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository: `vt3043479-ops/chat-app`
5. Configure the following settings:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave empty)
   - **Build Command**: `npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm run install:all`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel
```

## Step 3: Configure Environment Variables

In your Vercel project dashboard, go to Settings → Environment Variables and add:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `MONGODB_URI` | Your MongoDB connection string | Production |
| `JWT_SECRET` | A secure random string (minimum 32 characters) | Production |
| `CLIENT_URL` | Your Vercel app URL (e.g., https://your-app.vercel.app) | Production |
| `NODE_ENV` | `production` | Production |

### Example Values:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
CLIENT_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

## Step 4: Update Frontend Configuration

After deployment, update the Vite config with your actual Vercel URL:

1. Replace `'https://your-app-name.vercel.app'` in `client/vite.config.js` with your actual Vercel app URL
2. Commit and push the changes

## Step 5: Test Your Deployment

1. Visit your Vercel app URL
2. Test user registration and login
3. Test real-time messaging
4. Check browser console for any errors

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**: 
   - Ensure your MongoDB URI is correct
   - Check that your IP is whitelisted in MongoDB Atlas
   - Verify database user permissions

2. **CORS Errors**:
   - Make sure `CLIENT_URL` environment variable matches your Vercel domain
   - Check that both HTTP and WebSocket connections are properly configured

3. **Socket.IO Connection Issues**:
   - Vercel serverless functions have limitations with persistent connections
   - Consider using Vercel's Edge Runtime or a dedicated server for production

4. **Build Failures**:
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are properly listed in package.json

## Production Considerations

1. **Database**: Use MongoDB Atlas or another cloud MongoDB service
2. **File Uploads**: Consider using cloud storage (AWS S3, Cloudinary) instead of local storage
3. **Real-time Features**: For heavy real-time usage, consider deploying the backend to a service that supports persistent connections (Railway, Render, or Heroku)
4. **Monitoring**: Set up error tracking (Sentry) and analytics
5. **Security**: Review and strengthen JWT secrets, add input validation, and implement proper rate limiting

## Alternative Deployment Options

If you encounter limitations with Vercel's serverless functions for real-time features:

1. **Railway**: Excellent for full-stack apps with persistent connections
2. **Render**: Good alternative with free tier
3. **Heroku**: Classic choice for Node.js apps
4. **DigitalOcean App Platform**: Cost-effective for production apps

## Support

- Check Vercel documentation: https://vercel.com/docs
- MongoDB Atlas documentation: https://docs.atlas.mongodb.com/
- Socket.IO deployment guide: https://socket.io/docs/v4/deployment/