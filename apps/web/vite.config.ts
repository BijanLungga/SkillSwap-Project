import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/ws': {
        target: 'ws://localhost:5000',
        ws: true,
        configure: (proxy) => {
          proxy.on('error', (err: any) => {
            // Tangani ECONNRESET secara bersih saat socket ditutup oleh browser/backend
            if (err?.code === 'ECONNRESET' || err?.code === 'ECONNREFUSED') {
              return;
            }
            console.error('[vite ws proxy error]', err?.message || err);
          });
        }
      }
    }
  }
});

