import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const required = [
  'index.html',
  'src/App.jsx',
  'src/main.jsx',
  'src/data.js',
  'src/styles.css',
  'pages/_app.jsx',
  'pages/index.jsx',
  'package.json',
  'package-lock.json'
];
const forbidden = ['components', 'infra', 'tests', 'jest.config.js', 'jsonconfig.json'];

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
if (!pkg.dependencies?.next) fail('Next precisa estar em dependencies para a Vercel atual detectar o framework.');
if (!pkg.scripts?.build?.includes('next build')) fail('Script build precisa usar Next para compatibilidade com a Vercel atual.');
if (!pkg.scripts?.['vite:build']?.includes('vite build')) fail('Script vite:build precisa continuar disponível para build Vite local.');

const srcFiles = await readdir(path.join(root, 'src'));
if (!srcFiles.includes('App.jsx') || !srcFiles.includes('main.jsx') || !srcFiles.includes('data.js') || !srcFiles.includes('styles.css')) {
  fail('A pasta src precisa conter App.jsx, main.jsx, data.js e styles.css.');
}

console.log('[check-project] Estrutura OK: moment-of-goal com camada Next para publicar na Vercel atual.');
