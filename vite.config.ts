import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Alvos de build:
 *
 * - `vite build` (padrão): SPA estático em `dist/` — usado no dev/bolt para preview.
 * - `vite build --mode theme`: gera a home do tema Shopify direto em `assets/`
 *   (a pasta de assets do tema, na raiz do repo). Tudo sai com prefixo
 *   `enviagora-home` e base relativa, então chunks e imagens se resolvem a partir
 *   da URL do próprio JS no CDN do Shopify. `emptyOutDir: false` preserva os
 *   assets do Dawn; o script `clean-theme-assets` apaga só os arquivos gerados.
 * - `vite build --mode theme --ssr` (via `scripts/prerender-theme.mjs`): HTML
 *   pré-renderizado da home, salvo em `snippets/enviagora-home-ssr.liquid`.
 */
const themeAssetName = (info: { name?: string }) =>
  info.name?.endsWith('.css') ? 'enviagora-home.css' : 'enviagora-home-[name]-[hash][extname]';

export default defineConfig(({ mode, isSsrBuild }) => {
  const theme = mode === 'theme';
  const alias = { '@': fileURLToPath(new URL('./src', import.meta.url)) };

  /*
   * Pré-renderização (chamada por scripts/prerender-theme.mjs): gera um bundle
   * Node que devolve o HTML da home. Os assets saem com os MESMOS nomes do build
   * do cliente e viram marcadores __EA_ASSET__arquivo__EA_END__, trocados depois por
   * `{{ 'arquivo' | asset_url }}` no snippet Liquid.
   */
  if (theme && isSsrBuild) {
    return {
      plugins: [react()],
      base: './',
      publicDir: false,
      resolve: { alias },
      experimental: {
        renderBuiltUrl: (filename: string) => `__EA_ASSET__${filename}__EA_END__`,
      },
      build: {
        target: 'node18',
        assetsInlineLimit: 0, // igual ao build do cliente (mesmos arquivos)
        outDir: 'dist-ssr',
        emptyOutDir: true,
        assetsDir: '',
        copyPublicDir: false,
        rollupOptions: {
          output: {
            entryFileNames: 'entry-server.mjs',
            chunkFileNames: '[name]-[hash].mjs',
            assetFileNames: themeAssetName,
          },
        },
      },
    };
  }

  return {
    plugins: [react()],
    base: theme ? './' : '/',
    publicDir: theme ? false : 'public',
    resolve: { alias },
    build: {
      target: 'es2020',
      // A cena 3D (three/r3f) é lazy-loaded em chunk próprio — o tamanho é esperado.
      chunkSizeWarningLimit: 1200,
      ...(theme
        ? {
            outDir: 'assets',
            emptyOutDir: false,
            // Nada de imagem em base64 dentro do JS/HTML: cada asset vira um
            // arquivo no CDN (o HTML pré-renderizado fica enxuto).
            assetsInlineLimit: 0,
            assetsDir: '', // a pasta de assets do Shopify é plana
            cssCodeSplit: false,
            copyPublicDir: false,
            rollupOptions: {
              input: fileURLToPath(new URL('./src/main.tsx', import.meta.url)),
              output: {
                entryFileNames: 'enviagora-home.js',
                chunkFileNames: 'enviagora-home-[name]-[hash].js',
                assetFileNames: themeAssetName,
                manualChunks: {
                  motion: ['framer-motion'],
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
                },
              },
            },
          }),
    },
  };
});
