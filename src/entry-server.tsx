import { renderToString } from 'react-dom/server';
import App from './App';

/** HTML estático da home, usado pelo script de pré-renderização do tema. */
export function render() {
  return renderToString(<App />);
}
