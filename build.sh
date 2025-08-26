#!/bin/bash

# Build script for deployment platforms
echo "🚀 Starting build process..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
echo "🔨 Building client..."
npm run build
cd ..

# Install server dependencies (production only)
echo "📦 Installing server dependencies..."
cd server
npm install --omit=dev
cd ..

echo "✅ Build completed successfully!"
echo "📁 Client build output: client/dist/"
echo "🚀 Ready for deployment!"
