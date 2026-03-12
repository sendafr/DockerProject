import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  // All /api requests are forwarded to Django backend
      
server: {
  port: 5173,
    strictPort: true,
    proxy: { '/api': { 
      target: 'http://127.0.0.1:8000',
       changeOrigin: true ,
       secure: false,
      } 
    },
  },

  resolve: {
    alias: {
      '@': '/src',   // Use @/components instead of ../../components
    },
  },
});