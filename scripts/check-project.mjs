import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const required = ['index.html', 'src/main.jsx', 'src/data.js', 'src/styles.css', 'package.json', 'package-lock.json'];
const forbidden = ['pages', 'components', 'infra', 'tests', 'jest.config.js', 'jsonconfig.json'];

const fail = (message) => {
  console.error(`\n[check-project] ${message}`);
  process.exit(1);
};

for (const file of required) {
  if (!existsSync(path.join(root, file))) fail(`Arquivo obrigatório ausente: ${file}`);
}

for (const item of forbidden) {
  if (existsSync(path.join(root, item))) fail(`Arquivo/pasta antiga do tradertab ainda presente: ${item}`);
}

const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
if (pkg.name !== 'world-cup-goals-dashboard') fail('package.json ainda não é do moment-of-goal.');
if (!pkg.scripts?.build?.includes('vite build')) fail('Script build precisa usar Vite.');

const srcFiles = await readdir(path.join(root, 'src'));
if (!srcFiles.includes('main.jsx') || !srcFiles.includes('data.js') || !srcFiles.includes('styles.css')) {
  fail('A pasta src precisa conter main.jsx, data.js e styles.css.');
}

console.log('[check-project] Estrutura OK: moment-of-goal pronto para substituir o tradertab.');
