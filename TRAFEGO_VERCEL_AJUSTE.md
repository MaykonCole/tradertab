# Ajuste de tráfego do vídeo HistoryOdd

## O que foi alterado

1. O MP4 deixou de passar por `/api/historyodd-video-stream`.
2. As Functions `api/historyodd-video-stream.js` e `api/_historyOddVideoStream.js` foram removidas.
3. O navegador agora carrega o vídeo diretamente da URL configurada em `VITE_HISTORYODD_VIDEO_URL`.
4. Sem configuração adicional, o projeto usa diretamente o arquivo atual do Google Drive, sem a Vercel no caminho do vídeo.
5. A validação do progresso/Trial continua em `/api/historyodd-video-progress`, trafegando apenas JSON pequeno.
6. Os checkpoints de progresso agora são adaptativos (~10 s de mídia por checkpoint) para reduzir Function Invocations.

## Recomendação para produção

Hospede o MP4 em uma CDN/objeto próprio para mídia (Cloudflare R2, Bunny, S3/CloudFront etc.) e configure na Vercel:

`VITE_HISTORYODD_VIDEO_URL=https://sua-cdn.exemplo/video.mp4`

Depois faça um novo deploy.

Evite apontar `VITE_HISTORYODD_VIDEO_URL` para qualquer rota `/api/...` da própria Vercel, pois isso volta a gerar Fast Origin Transfer.
