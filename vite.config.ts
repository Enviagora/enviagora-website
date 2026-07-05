import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuração do Vite — SPA estático, pronto para bolt.new e deploy em qualquer host.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    // A cena 3D (three/r3f) é lazy-loaded em chunk próprio — o tamanho é esperado.
    chunkSizeWarningLimit: 1200,
    // Separa libs de animação em chunks próprios para não travar o first paint.
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ['framer-motion'],
          gsap: ['gsap'],
        },
      },
    },
  },
});
