
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    proxy: {
      // All /api requests are forwarded to Django backend
      '/api': {
        target: 'src_authentic:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  resolve: {
    alias: {
      '@': '/src',   // Use @/components instead of ../../components
    },
  },
});