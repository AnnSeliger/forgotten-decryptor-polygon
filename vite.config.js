import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/forgotten-decryptor-polygon/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    // Убедитесь, что 404.html копируется
    rollupOptions: {
      input: {
        main: './index.html',
        404: './public/404.html'
      }
    }
  }
});