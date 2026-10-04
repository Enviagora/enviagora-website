import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// No tema Shopify a seção `enviagora-home` renderiza #enviagora-home;
// no dev/bolt (index.html) o ponto de montagem é #root.
function mount() {
  const el = document.getElementById('enviagora-home') ?? document.getElementById('root');
  if (!el || el.dataset.mounted) return;
  el.dataset.mounted = 'true';
  createRoot(el).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

mount();

// Editor de tema: ao salvar um setting, o Shopify substitui o HTML da seção
// sem recarregar a página — remonta o app no novo nó.
document.addEventListener('shopify:section:load', mount);
