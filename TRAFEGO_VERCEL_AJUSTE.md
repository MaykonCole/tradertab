# Ajuste de tráfego Vercel — HistoryOdd

O vídeo da landing page agora é incorporado diretamente do YouTube:

`https://www.youtube.com/watch?v=tkFjmj77r9k&t=65s`

Fluxo atual:

`Navegador -> YouTube -> vídeo`

A Vercel não faz proxy, streaming nem download do arquivo de vídeo. Portanto, a mídia não gera Fast Origin Transfer no projeto.

A lógica de Trial também foi simplificada:

- usuário logado no TraderTab: botão de Trial de 7 dias fica disponível diretamente;
- visitante: botão de Trial de 3 dias abre o formulário de e-mail;
- o backend continua validando autenticação e delegando ao serviço de licenças a regra que impede reutilização do Trial;
- foram removidas as APIs e tokens de acompanhamento de progresso do vídeo.

Com isso, assistir ao vídeo não gera Functions recorrentes nem tráfego pesado na Vercel.
