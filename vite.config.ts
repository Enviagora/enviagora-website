import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Dois alvos de build:
 *
 * - `vite build` (padrão): SPA estático em `dist/` — usado no dev/bolt para preview.
 * - `vite build --mode theme`: gera a home do tema Shopify direto em `assets/`
 *   (a pasta de assets do tema, na raiz do repo). Tudo sai com prefixo
 *   `enviagora-home` e base relativa, então chunks e imagens se resolvem a partir
 *   da URL do próprio JS no CDN do Shopify. `emptyOutDir: false` preserva os
 *   assets do Dawn; o script `clean-theme-assets` apaga só os arquivos gerados.
 */
export default defineConfig(({ mode }) => {
  const theme = mode === 'theme';

  return {
    plugins: [react()],
    base: theme ? './' : '/',
    publicDir: theme ? false : 'public',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      target: 'es2020',
      // A cena 3D (three/r3f) é lazy-loaded em chunk próprio — o tamanho é esperado.
      chunkSizeWarningLimit: 1200,
      ...(theme
        ? {
            outDir: 'assets',
            emptyOutDir: false,
            assetsDir: '', // a pasta de assets do Shopify é plana
            cssCodeSplit: false,
            copyPublicDir: false,
            rollupOptions: {
              input: fileURLToPath(new URL('./src/main.tsx', import.meta.url)),
              output: {
                entryFileNames: 'enviagora-home.js',
                chunkFileNames: 'enviagora-home-[name]-[hash].js',
                assetFileNames: (info: { name?: string }) =>
                  info.name?.endsWith('.css') ? 'enviagora-home.css' : 'enviagora-home-[name]-[hash][extname]',
                manualChunks: {
                  motion: ['framer-motion'],
                  gsap: ['gsap'],
                },
              },
            },
          }
        : {
            // Separa libs de animação em chunks próprios para não travar o first paint.
            rollupOptions: {
              output: {
                manualChunks: {
                  motion: ['framer-motion'],
                  gsap: ['gsap'],
                },
              },
            },
          }),
    },
  };
});
