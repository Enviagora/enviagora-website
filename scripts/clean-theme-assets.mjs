// Remove os arquivos gerados pelo build do tema (prefixo `enviagora-home`) de
// `assets/` antes de um novo build, para não acumular chunks com hash antigo.
// Só toca no que o build gera — os assets do Dawn e os fixos da marca ficam.
import { readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = fileURLToPath(new URL('../assets/', import.meta.url));
let removed = 0;
for (const name of readdirSync(dir)) {
  if (name.startsWith('enviagora-home')) {
    rmSync(join(dir, name));
    removed++;
  }
}
console.log(`clean-theme-assets: ${removed} arquivo(s) gerado(s) removido(s)`);
