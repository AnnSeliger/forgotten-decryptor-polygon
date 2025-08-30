import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/forgotten-decryptor-polygon/', // ✅ Base для GitHub Pages
  plugins: [react()],
  server: {
    open: true,
    host: true,
    strictBase: false, // Добавлено: отключает строгое соответствие base
    proxy: {
      '/ipfs': {
        target: 'https://gateway.pinata.cloud/ipfs/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ipfs/, ''),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.error('Proxy error:', err);
          });
        },
      },
    },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    sourcemap: false,
  },
});