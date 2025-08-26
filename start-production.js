#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Real-time Chat Application in Production Mode...\n');

// Check if build exists
const buildPath = path.join(__dirname, 'client', 'dist');
if (!fs.existsSync(buildPath)) {
  console.error('❌ Client build not found. Please run "npm run build" first.');
  process.exit(1);
}

// Start the server
const serverPath = path.join(__dirname, 'server');
const serverProcess = spawn('npm', ['start'], {
  cwd: serverPath,
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'production'
  }
});

serverProcess.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down gracefully...');
  serverProcess.kill('SIGTERM');
});

console.log('✅ Production server started successfully!');
console.log('📱 Client: Served from server/public (built files)');
console.log('🔧 Server: Running on http://localhost:4000');
console.log('💾 Database: MongoDB connection required');
console.log('\n📋 To stop the server, press Ctrl+C\n');
