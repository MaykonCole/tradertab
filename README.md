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

## Login e perfil

O projeto inclui login com Google e e-mail/senha pelo Firebase Authentication.
Data de nascimento, idade calculada, país, clube do coração opcional e
preferências de colunas ficam no Firestore, protegidos pelo `uid` do usuário.

Consulte [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) para ativar o ambiente.

## Privacidade e cookies

- A Política de Privacidade está disponível em `#privacidade`.
- O rodapé permite reabrir as preferências de cookies.
- O Google Analytics só é inicializado após consentimento explícito.
- Cookies e armazenamentos necessários continuam ativos para login, idioma,
  tema e preferências funcionais.
- O arquivo `.env.local` é local e não deve ser versionado ou distribuído.
