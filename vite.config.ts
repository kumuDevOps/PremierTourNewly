import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  const gmpKey = process.env.GOOGLE_MAPS_PLATFORM_KEY || "";
  return {
    plugins: [react(), tailwindcss()],
    define: {
      "process.env.GOOGLE_MAPS_PLATFORM_KEY": JSON.stringify(gmpKey)
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
      watch: {
        ignored: ['**/src/db/*.json', '**/seed_data*.json', '**/dist/**']
      },
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
