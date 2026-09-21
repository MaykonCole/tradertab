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


## Vídeo HistoryOdd sem Fast Origin Transfer

O vídeo da landing page é carregado **diretamente pelo navegador** a partir de `VITE_HISTORYODD_VIDEO_URL`.
Ele não deve ser proxyado por uma Vercel Function, pois cada byte do MP4 passando pelo Compute gera Fast Origin Transfer.

- Recomendado em produção: hospedar o MP4 em Cloudflare R2, Bunny, S3/CloudFront ou outra CDN de objetos e configurar `VITE_HISTORYODD_VIDEO_URL`.
- Enquanto essa variável estiver vazia, o frontend usa diretamente o arquivo atual do Google Drive, sem passar pela Vercel.
- A API `/api/historyodd-video-progress` continua ativa apenas para validar o progresso/Trial; ela trafega somente pequenos JSONs.
- O checkpoint do progresso agora é adaptativo (~10 segundos de vídeo por validação: 10s em 1x, 8s em 1.25x, ~6,7s em 1.5x e 5s em 2x), reduzindo Function Invocations sem enfraquecer a validação anti-skip.
