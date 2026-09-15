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

## Google AdSense

O projeto está preparado para carregar o AdSense apenas quando `VITE_ADSENSE_CLIENT` contiver um ID válido no formato `ca-pub-...`.

1. Cadastre e valide o domínio no Google AdSense.
2. Configure `VITE_ADSENSE_CLIENT=ca-pub-SEU_ID` no ambiente de produção da Vercel.
3. No AdSense, configure **Privacy & messaging** / Google CMP para EEE, Reino Unido e Suíça antes de servir anúncios personalizados nessas regiões.
4. Depois que o AdSense fornecer a linha do `ads.txt`, copie `public/ads.txt.example` para `public/ads.txt` e substitua o exemplo pela linha EXATA fornecida pela sua conta. Não publique um ID fictício.
5. O site possui páginas públicas em `/about`, `/privacy`, `/terms` e `/responsible-gambling`.
6. Evite inserir anúncios dentro da tabela/ladder ou junto de botões clicáveis. Prefira Auto Ads ou áreas visualmente separadas.

Observação: a preparação técnica não garante aprovação. O Google também avalia qualidade/originalidade do conteúdo, experiência de navegação e conformidade com as políticas para publishers.

## Conteúdos / Blog multilíngue

O projeto inclui uma central editorial em `/blog`, com artigos próprios do TraderTab em PT-BR, PT-PT, EN e ES. Cada artigo possui URL própria e metadados de título/descrição para indexação.

Conteúdos iniciais:
- Classificação Lay
- Classificação Back
- Race
- Como interpretar odds
- Parelho / Balanced
- Como usar os filtros do TraderTab


## AdSense configurado

Publisher ID configurado: `ca-pub-2309431199669812`.

- O snippet de verificação/AdSense está presente em `index.html`.
- `public/ads.txt` contém a linha oficial do publisher.
- `.env.production` e `.env.local` contêm `VITE_ADSENSE_CLIENT` para manter o loader React configurado.

Após publicar, valide no navegador:
- código-fonte da página contém `ca-pub-2309431199669812`;
- `/ads.txt` responde com `google.com, pub-2309431199669812, DIRECT, f08c47fec0942fa0`.
