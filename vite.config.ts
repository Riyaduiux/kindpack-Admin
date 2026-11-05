import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // In development the API is proxied, so VITE_API_URL can stay "/api/v1" (no CORS needed).
  const target = loadEnv(mode, process.cwd(), '').API_PROXY_TARGET || 'http://localhost:8080';
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': { target, changeOrigin: true },
        '/uploads': { target, changeOrigin: true },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router'],
            mui: ['@mui/material', '@emotion/react', '@emotion/styled'],
            grid: ['@mui/x-data-grid'],
          },
        },
      },
    },
  };
});
