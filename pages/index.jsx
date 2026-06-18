import Head from 'next/head';
import App from '../src/App';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Moment of Goal</title>
        <meta name="description" content="Dashboard de gols por momento do jogo." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <App />
    </>
  );
}
