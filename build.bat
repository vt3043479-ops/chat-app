@echo off
echo 🚀 Starting build process...

echo 📦 Installing root dependencies...
call npm install

echo 📦 Installing client dependencies...
cd client
call npm install
echo 🔨 Building client...
call npm run build
cd ..

echo 📦 Installing server dependencies...
cd server
call npm install --omit=dev
cd ..

echo ✅ Build completed successfully!
echo 📁 Client build output: client/dist/
echo 🚀 Ready for deployment!
