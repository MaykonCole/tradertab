# Login gratuito do TraderTab

O projeto usa:

- **Firebase Authentication** para Google e e-mail/senha.
- **Cloud Firestore** para data de nascimento, idade calculada, país, clube do coração opcional e ordem das colunas.
- **Vercel** apenas para publicar o front-end.

A aplicação não grava nem recebe a senha para persistência. O cadastro, a
validação, a recuperação e a sessão são tratados pelo Firebase Authentication.

## 1. Criar o projeto

1. Acesse `https://console.firebase.google.com`.
2. Crie um projeto chamado `tradertab`.
3. Pode deixar o Google Analytics desativado.
4. Em **Visão geral do projeto > Adicionar app**, escolha **Web**.
5. Registre o app e copie os dados de `firebaseConfig`.

## 2. Ativar o login

1. Abra **Authentication > Sign-in method**.
2. Ative **Google** e escolha o e-mail de suporte.
3. Ative **E-mail/senha**.
4. Em **Authentication > Settings > Authorized domains**, adicione:
   - o domínio de produção, por exemplo `tradertab.com.br`;
   - o domínio gerado pela Vercel;
   - `localhost`, somente para desenvolvimento.

## 3. Criar o armazenamento dos perfis

1. Abra **Firestore Database > Create database**.
2. Selecione o modo de produção e uma região próxima.
3. Em **Rules**, substitua o conteúdo pelo arquivo `firestore.rules`.
4. Publique as regras.

Cada usuário terá somente um documento:

```text
users/{uid}
  email
  name
  photoUrl
  authProvider
  birthDate
  age
  countryCode
  country
  favoriteClub
  preferences.columnOrder
  createdAt
  updatedAt
```

As regras impedem que uma pessoa leia ou altere o perfil de outra.

## 4. Configurar as variáveis

Copie `.env.example` para `.env.local` e preencha:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Na Vercel, cadastre os mesmos nomes em **Settings > Environment Variables** e
publique novamente.

Essas chaves identificam o projeto web e podem aparecer no front-end. A
proteção real está no Firebase Authentication e nas regras do Firestore.

## 5. Testar

```bash
npm install
npm run dev
```

Valide estes cenários:

1. Visitante vê jogos, mas não vê filtros nem Race e não reorganiza colunas.
2. Login Google cria a conta e abre a etapa curta de perfil.
3. Cadastro por e-mail exige uma senha de no mínimo seis caracteres.
4. A ordem das colunas permanece após sair, entrar novamente ou trocar de
   dispositivo.
5. **Esqueci minha senha** envia o e-mail de recuperação.

## Recomendação de produção

Comece no plano gratuito Spark. Antes de divulgar amplamente, ative verificação
de e-mail, App Check e alertas de orçamento/uso no console do Google.
