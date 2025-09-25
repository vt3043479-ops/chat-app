import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' 
          ? 'https://your-app-name.vercel.app' 
          : 'http://localhost:4000',
        changeOrigin: true
      },
      '/socket.io': {
        target: process.env.NODE_ENV === 'production' 
          ? 'https://your-app-name.vercel.app' 
          : 'http://localhost:4000',
        changeOrigin: true,
        ws: true
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
})
