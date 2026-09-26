# TraderTab — página em construção

A raiz `/` mostra apenas “Under Construction” sobre fundo preto.
O painel `/admin` permanece disponível, com o proxy `/api/license-admin-proxy` necessário à sua operação.
As demais rotas e APIs antigas foram removidas deste pacote.

Para publicar na Vercel: importe este projeto, use `npm run build` e deixe o diretório de saída `dist`.
A página não faz referência aos conteúdos antigos. O painel precisa do URL do License Server e do ADMIN_TOKEN fornecidos no próprio formulário.
