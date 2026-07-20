# Moment of Goal Dashboard

Projeto Vite + React para exibir estatísticas de gols por momento da Copa.

## Rodar localmente

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Substituição do repositório tradertab

Este pacote foi preparado para substituir a aplicação antiga do `tradertab`, mantendo os arquivos de regras do GitHub:

- `.github/workflows/*`
- `.husky/*`
- `.editorconfig`
- `.gitignore`
- `.secretlintrc.json`
- `commitlint.config.js`

Não inclui `node_modules` nem `.git`.

## Google Sheets

O dashboard lê os jogos em tempo real pelo aplicativo Web do Google Apps Script configurado em `src/main.jsx`.
A leitura usa apenas GET. O token de gravação não é incluído no site.
