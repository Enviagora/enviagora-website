import { StrictMode } from 'react';
import { createRoot, hydrateRoot, type Root } from 'react-dom/client';
import App from './App';
import './index.css';

let root: Root | null = null;

// No tema Shopify a seção `enviagora-home` renderiza #enviagora-home já com o
// HTML pré-renderizado (snippet enviagora-home-ssr) → o React hidrata.
// No dev/bolt (index.html) o ponto de montagem é #root, vazio → render normal.
function mount() {
  const el = document.getElementById('enviagora-home') ?? document.getElementById('root');
  if (!el || el.dataset.mounted) return;
  el.dataset.mounted = 'true';

  const app = (
    <StrictMode>
      <App />
    </StrictMode>
  );

  if (el.firstElementChild) {
    root = hydrateRoot(el, app, {
      // Divergência entre o HTML e o primeiro render: o React refaz o trecho no
      // cliente (a página continua funcionando). Fica no console para depurar.
      onRecoverableError: (err) => console.warn('[enviagora] hidratação:', err),
    });
  } else {
    root = createRoot(el);
    root.render(app);
  }
}

mount();

// Editor de tema: ao salvar um setting, o Shopify troca o HTML da seção sem
// recarregar a página — desmonta o app antigo e monta no novo nó.
document.addEventListener('shopify:section:unload', () => {
  root?.unmount();
  root = null;
});
document.addEventListener('shopify:section:load', mount);
