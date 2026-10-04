// Pré-renderiza a home (React → HTML) para o tema Shopify.
//
// Gera `snippets/enviagora-home-ssr.liquid`, que a seção `enviagora-home`
// imprime dentro de #enviagora-home. Assim a página já chega com o conteúdo
// (pinta antes do JS, melhor para SEO e LCP) e o React só "hidrata" esse HTML.
//
// Roda depois de `vite build --mode theme` (ver `npm run build:theme`): os
// arquivos de imagem referenciados precisam existir em assets/.
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';

process.env.NODE_ENV = 'production';

const root = fileURLToPath(new URL('..', import.meta.url));
const at = (p) => fileURLToPath(new URL(p, new URL('..', import.meta.url)));

await build({
  root,
  mode: 'theme',
  logLevel: 'warn',
  build: { ssr: 'src/entry-server.tsx' },
});

const { render } = await import(pathToFileURL(at('dist-ssr/entry-server.mjs')).href);
const html = render();
rmSync(at('dist-ssr'), { recursive: true, force: true });

if (html.includes('{% endraw %}')) throw new Error('HTML contém "{% endraw %}" — quebraria o snippet.');

// Marcadores de asset → filtro asset_url do Shopify (fora do bloco raw).
const missing = new Set();
const body = html.replace(/__EA_ASSET__(.+?)__EA_END__/g, (_, file) => {
  if (!existsSync(at(`assets/${file}`))) missing.add(file);
  return `{% endraw %}{{ '${file}' | asset_url }}{% raw %}`;
});
if (body.includes('__EA_ASSET__')) throw new Error('Sobrou marcador de asset sem conversão no HTML.');
if (missing.size) {
  throw new Error(`Assets usados no HTML e ausentes em assets/: ${[...missing].join(', ')}. Rode o build do cliente antes.`);
}

// Sem espaço/quebra de linha fora do HTML: o conteúdo de #enviagora-home tem de
// bater exatamente com o que o React renderiza, senão a hidratação falha.
const header =
  '{%- comment -%}\n  GERADO por `npm run build:theme` (scripts/prerender-theme.mjs) — não edite à mão.\n  HTML pré-renderizado da home; o React hidrata este conteúdo.\n{%- endcomment -%}';
const out = `${header}{% raw %}${body}{% endraw %}`;

const target = at('snippets/enviagora-home-ssr.liquid');
const prev = existsSync(target) ? readFileSync(target, 'utf8') : '';
if (prev !== out) writeFileSync(target, out);
console.log(`prerender-theme: snippets/enviagora-home-ssr.liquid (${(Buffer.byteLength(out) / 1024).toFixed(1)} KB)`);
