import worldCup2026Data from './worldCup2026Data.json';

const formatDisplayDate = (isoDate) => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}`;
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const bucketDefinitions = worldCup2026Data.bucketDefinitions || worldCup2026Data.bucketRows || [];

const getMatchGoals = (match) => {
  if (Array.isArray(match.goals)) return match.goals;

  const scoreTotal = toNumber(match.score?.home) + toNumber(match.score?.away);
  return Array.from({ length: toNumber(match.totalGoals, scoreTotal) }, (_, index) => ({
    id: `legacy-${index + 1}`,
    bucketId: 'unknown'
  }));
};

const goalEvents = worldCup2026Data.matches.flatMap((match) =>
  getMatchGoals(match).map((goal) => ({ ...goal, match }))
);

export const bucketRows = bucketDefinitions.map((bucket) => ({
  id: bucket.id,
  goals: goalEvents.filter((goal) => goal.bucketId === bucket.id).length,
  minutes: bucket.minutes,
  half: bucket.half
}));

const buildMatchTitle = (match, lang) => {
  if (match.teams?.[lang]) return match.teams[lang];

  const home = match.home?.[lang] || match.home?.pt || '';
  const away = match.away?.[lang] || match.away?.pt || '';
  const homeScore = toNumber(match.score?.home);
  const awayScore = toNumber(match.score?.away);

  return `${home} ${homeScore} x ${awayScore} ${away}`.trim();
};

export const matchRows = worldCup2026Data.matches.map((match) => {
  const goals = getMatchGoals(match);

  return {
    date: match.displayDate || formatDisplayDate(match.date),
    group: match.group,
    round: match.round || 'round1',
    goals: goals.length,
    goalMinutes: goals.map((goal) => goal.minuteLabel || String(goal.minute)).filter(Boolean),
    teams: {
      pt: buildMatchTitle(match, 'pt'),
      en: buildMatchTitle(match, 'en'),
      es: buildMatchTitle(match, 'es')
    }
  };
});

export const sourceMeta = worldCup2026Data.meta;

export const getDashboardData = (round = 'all') => {
  const matches = round === 'all'
    ? worldCup2026Data.matches
    : worldCup2026Data.matches.filter((match) => (match.round || 'round1') === round);

  const events = matches.flatMap((match) =>
    getMatchGoals(match).map((goal) => ({ ...goal, match }))
  );

  const filteredBucketRows = bucketDefinitions.map((bucket) => ({
    id: bucket.id,
    goals: events.filter((goal) => goal.bucketId === bucket.id).length,
    minutes: bucket.minutes,
    half: bucket.half
  }));

  const filteredMatchRows = [...matches].sort((a, b) => a.date.localeCompare(b.date) || a.group.localeCompare(b.group)).map((match) => {
    const goals = getMatchGoals(match);
    return {
      date: match.displayDate || formatDisplayDate(match.date),
      group: match.group,
      round: match.round || 'round1',
      goals: goals.length,
      goalMinutes: goals.map((goal) => goal.minuteLabel || String(goal.minute)).filter(Boolean),
      teams: {
        pt: buildMatchTitle(match, 'pt'),
        en: buildMatchTitle(match, 'en'),
        es: buildMatchTitle(match, 'es')
      }
    };
  });

  return { bucketRows: filteredBucketRows, matchRows: filteredMatchRows };
};

export const translations = {
  pt: {
    languageName: 'Português',
    locale: 'pt-BR',
    goalsAnalyzed: 'gols analisados',
    group: 'Grupo',
    hero: {
      eyebrow: 'Copa do Mundo 2026 • análise temporal',
      title: 'Mapa profissional dos gols por momento do jogo',
      description: 'Dashboard para destrinchar os gols por blocos de tempo, comparando início, hidratação, trecho médio, final de tempo e acréscimos. A divisão do 1º tempo foi espelhada para o FT.',
      rank: 'Ranking por força',
      timeline: 'Ordem do jogo',
      sample: 'Amostra atual',
      games: 'jogos',
      goals: 'gols',
      avg: 'média de',
      goalsPerGame: 'gols/jogo'
    },
    stats: {
      totalGoals: 'Total de gols',
      completedBase: 'Base já concluída',
      secondHalfGoals: 'Gols no 2T',
      ofTotal: 'do total',
      bestBlock: 'Melhor bloco',
      bestBlockValue: '',
      bestBlockDetail: '{bestGoals} gols',
      stoppage: 'Acréscimos',
      stoppageValue: '',
      stoppageDetail: '45+ e 90+ somados'
    },
    chart: { eyebrow: 'Distribuição por momento', title: 'Onde os gols estão acontecendo' },
    side: { eyebrow: 'Resumo executivo', title: 'Padrões principais' },
    split: { first: '1T + 45+', second: '2T + 90+' },
    quarters: {
      eyebrow: 'División en 4 períodos',
      title: 'Porcentaje de goles por fase del partido',
      goals: 'goles',
      periods: {
        first: { label: '0 a 22', description: 'Inicio del 1T hasta prehidratación' },
        second: { label: '22 hasta el final HT', description: 'Después de 22 minutos + cierre y añadido del 1T' },
        third: { label: '45 a 67', description: 'Inicio del 2T hasta prehidratación FT' },
        fourth: { label: '67 hasta el final FT', description: 'Después de 67 minutos + cierre y añadido del 2T' }
      }
    },
    quarters: {
      eyebrow: 'Divisão em 4 períodos',
      title: 'Percentual dos gols por fase do jogo',
      goals: 'gols',
      periods: {
        first: { label: '0 a 22', description: 'Início do 1T até pré-hidratação' },
        second: { label: '22 até o final HT', description: 'Pós 22 minutos + final e acréscimos do 1T' },
        third: { label: '45 a 67', description: 'Início do 2T até pré-hidratação FT' },
        fourth: { label: '67 até o final FT', description: 'Pós 67 minutos + final e acréscimos do 2T' }
      }
    },
    timelinePanel: { eyebrow: 'Mapa temporal', title: 'Linha do jogo' },
    table: {
      eyebrow: 'Tabela completa',
      title: 'Blocos, leitura e percentual',
      block: 'Bloco',
      moment: 'Momento',
      time: 'Tempo',
      goals: 'Gols',
      percent: '%',
      practical: 'Leitura prática'
    },
    matches: { eyebrow: 'Jogos base', title: 'Partidas consideradas', date: 'Data', group: 'Grupo', match: 'Jogo', goals: 'Gols' },
    buckets: {
      '0-15': { label: '0-15', phase: 'Início do Jogo', intent: 'Entrada, ajuste inicial e leitura de postura' },
      '16-22': { label: '16-22', phase: 'Pré Hidratação', intent: 'Ritmo estabilizado antes da parada técnica' },
      '23-29': { label: '23-29', phase: 'Pós Hidratação', intent: 'Retorno da pausa, reorganização e retomada' },
      '30-40': { label: '30-40', phase: 'Médio', intent: 'Trecho de consolidação e pressão sustentada' },
      '41-45': { label: '41-45', phase: 'Finalizando 1T', intent: 'Final seco do primeiro tempo' },
      '45+': { label: '45+', phase: 'Acréscimos 1T', intent: 'Tempo extra do 1T, risco de desatenção' },
      '45-60FT': { label: '45-60 FT', phase: 'Início FT', intent: 'Reentrada, ajustes do intervalo e pressão inicial' },
      '61-67FT': { label: '61-67 FT', phase: 'Pré Hidratação FT', intent: 'Antes da pausa, desgaste começando a pesar' },
      '68-74FT': { label: '68-74 FT', phase: 'Pós Hidratação FT', intent: 'Retorno da pausa e reorganização final' },
      '75-85FT': { label: '75-85 FT', phase: 'Médio FT', intent: 'Trecho de maior tensão, substituições e cansaço' },
      '86-90FT': { label: '86-90 FT', phase: 'Finalizando FT', intent: 'Pressão final antes dos acréscimos' },
      '90+': { label: '90+', phase: 'Acréscimos FT', intent: 'Jogo aberto, desespero ou administração frágil' }
    },
    notes: [
      'O bloco {bestLabel} lidera com {bestGoals} gols.',
      'O 2T concentra {secondHalfPct}% dos gols na amostra atual.',
      'Acréscimos 45+ e 90+ somam {stoppageGoals} gols, mantendo alta relevância operacional.',
      '45-60 FT registrou {ftOpeningGoals} gols; a pós-hidratação reúne {postHydrationGoals} gols na amostra atual.'
    ],
    insights: [
      { title: 'Melhores janelas de pressão', tone: 'hot', text: 'O bloco {bestLabel} é o mais forte da amostra atualizada, com {bestGoals} gols. Ele mistura substituições, queda física e necessidade de resultado, aumentando a chance de jogo aberto.' },
      { title: 'Acréscimos não podem ser ignorados', tone: 'default', text: '45+ e 90+ juntos representam {stoppagePct}% dos gols. Para leitura de tempo final, considerar o acréscimo real é essencial.' },
      { title: 'Pós-hidratação ainda fraco', tone: 'cold', text: 'Os blocos 23-29 e 68-74 somam {postHydrationGoals} gols. Até agora, a retomada depois da pausa não aparece como pico principal.' }
    ]
  },
  en: {
    languageName: 'English',
    locale: 'en-US',
    goalsAnalyzed: 'goals analyzed',
    group: 'Group',
    hero: {
      eyebrow: 'World Cup 2026 • time-based analysis',
      title: 'Professional goal map by match moment',
      description: 'Dashboard to break down goals by time blocks, comparing opening phases, hydration windows, middle phases, end-of-half pressure and stoppage time. The first-half split is mirrored for full time.',
      rank: 'Ranked by strength',
      timeline: 'Match order',
      sample: 'Current sample',
      games: 'matches',
      goals: 'goals',
      avg: 'average of',
      goalsPerGame: 'goals/match'
    },
    stats: {
      totalGoals: 'Total goals',
      completedBase: 'Completed sample',
      secondHalfGoals: 'Second-half goals',
      ofTotal: 'of total',
      bestBlock: 'Best block',
      bestBlockValue: '',
      bestBlockDetail: '{bestGoals} goals',
      stoppage: 'Stoppage time',
      stoppageValue: '',
      stoppageDetail: '45+ and 90+ combined'
    },
    chart: { eyebrow: 'Distribution by moment', title: 'Where goals are happening' },
    side: { eyebrow: 'Executive summary', title: 'Main patterns' },
    split: { first: '1H + 45+', second: '2H + 90+' },
    quarters: {
      eyebrow: '4-period split',
      title: 'Goal percentage by match phase',
      goals: 'goals',
      periods: {
        first: { label: '0 to 22', description: 'Start of 1H through pre-hydration' },
        second: { label: '22 to HT end', description: 'After 22 minutes + 1H closing and stoppage time' },
        third: { label: '45 to 67', description: 'Start of 2H through FT pre-hydration' },
        fourth: { label: '67 to FT end', description: 'After 67 minutes + 2H closing and stoppage time' }
      }
    },
    timelinePanel: { eyebrow: 'Temporal map', title: 'Match timeline' },
    table: {
      eyebrow: 'Full table',
      title: 'Blocks, reading and percentage',
      block: 'Block',
      moment: 'Moment',
      time: 'Time',
      goals: 'Goals',
      percent: '%',
      practical: 'Practical reading'
    },
    matches: { eyebrow: 'Base matches', title: 'Matches included', date: 'Date', group: 'Group', match: 'Match', goals: 'Goals' },
    buckets: {
      '0-15': { label: '0-15', phase: 'Opening phase', intent: 'Entry phase, initial adjustment and posture reading' },
      '16-22': { label: '16-22', phase: 'Pre-hydration', intent: 'Stabilized rhythm before the technical break' },
      '23-29': { label: '23-29', phase: 'Post-hydration', intent: 'Restart after the pause, reorganization and tempo recovery' },
      '30-40': { label: '30-40', phase: 'Middle phase', intent: 'Consolidation stretch and sustained pressure' },
      '41-45': { label: '41-45', phase: 'Closing 1H', intent: 'Regular end of the first half' },
      '45+': { label: '45+', phase: '1H stoppage time', intent: 'Extra first-half time, concentration-risk window' },
      '45-60FT': { label: '45-60 FT', phase: 'FT opening', intent: 'Restart, half-time adjustments and early pressure' },
      '61-67FT': { label: '61-67 FT', phase: 'FT pre-hydration', intent: 'Before the pause, fatigue starts to weigh in' },
      '68-74FT': { label: '68-74 FT', phase: 'FT post-hydration', intent: 'Restart after the pause and final reorganization' },
      '75-85FT': { label: '75-85 FT', phase: 'FT middle phase', intent: 'High-tension stretch, substitutions and fatigue' },
      '86-90FT': { label: '86-90 FT', phase: 'Closing FT', intent: 'Final pressure before stoppage time' },
      '90+': { label: '90+', phase: 'FT stoppage time', intent: 'Open game, desperation or fragile game management' }
    },
    notes: [
      'The {bestLabel} block leads with {bestGoals} goals.',
      'The second half accounts for {secondHalfPct}% of goals in the current sample.',
      'Stoppage time at 45+ and 90+ adds up to {stoppageGoals} goals, keeping strong operational relevance.',
      '45-60 FT recorded {ftOpeningGoals} goals; post-hydration combines {postHydrationGoals} goals in the current sample.'
    ],
    insights: [
      { title: 'Best pressure windows', tone: 'hot', text: 'The {bestLabel} block is the strongest in the updated sample, with {bestGoals} goals. It combines substitutions, physical decline and score-pressure, increasing the chance of a more open match.' },
      { title: 'Stoppage time matters', tone: 'default', text: '45+ and 90+ together represent {stoppagePct}% of all goals. For end-game reading, the real added-time expectation is essential.' },
      { title: 'Post-hydration is still weak', tone: 'cold', text: 'The 23-29 and 68-74 blocks combine for {postHydrationGoals} goals. So far, the restart after the pause is not the main scoring peak.' }
    ]
  },
  es: {
    languageName: 'Español',
    locale: 'es-ES',
    goalsAnalyzed: 'goles analizados',
    group: 'Grupo',
    hero: {
      eyebrow: 'Copa del Mundo 2026 • análisis temporal',
      title: 'Mapa profesional de goles por momento del partido',
      description: 'Dashboard para desglosar los goles por bloques de tiempo, comparando inicio, hidratación, tramo medio, cierre de tiempo y descuentos. La división del primer tiempo fue reflejada para el FT.',
      rank: 'Ranking por fuerza',
      timeline: 'Orden del partido',
      sample: 'Muestra actual',
      games: 'partidos',
      goals: 'goles',
      avg: 'media de',
      goalsPerGame: 'goles/partido'
    },
    stats: {
      totalGoals: 'Total de goles',
      completedBase: 'Base ya finalizada',
      secondHalfGoals: 'Goles en el 2T',
      ofTotal: 'del total',
      bestBlock: 'Mejor bloque',
      bestBlockValue: '',
      bestBlockDetail: '{bestGoals} goles',
      stoppage: 'Descuentos',
      stoppageValue: '',
      stoppageDetail: '45+ y 90+ sumados'
    },
    chart: { eyebrow: 'Distribución por momento', title: 'Dónde están ocurriendo los goles' },
    side: { eyebrow: 'Resumen ejecutivo', title: 'Patrones principales' },
    split: { first: '1T + 45+', second: '2T + 90+' },
    quarters: {
      eyebrow: 'División en 4 períodos',
      title: 'Porcentaje de goles por fase del partido',
      goals: 'goles',
      periods: {
        first: { label: '0 a 22', description: 'Inicio del 1T hasta la prehidratación' },
        second: { label: '22 hasta el final HT', description: 'Después de 22 minutos + cierre y añadido del 1T' },
        third: { label: '45 a 67', description: 'Inicio del 2T hasta la prehidratación FT' },
        fourth: { label: '67 hasta el final FT', description: 'Después de 67 minutos + cierre y añadido del 2T' }
      }
    },
    timelinePanel: { eyebrow: 'Mapa temporal', title: 'Línea del partido' },
    table: {
      eyebrow: 'Tabla completa',
      title: 'Bloques, lectura y porcentaje',
      block: 'Bloque',
      moment: 'Momento',
      time: 'Tiempo',
      goals: 'Goles',
      percent: '%',
      practical: 'Lectura práctica'
    },
    matches: { eyebrow: 'Partidos base', title: 'Partidos considerados', date: 'Fecha', group: 'Grupo', match: 'Partido', goals: 'Goles' },
    buckets: {
      '0-15': { label: '0-15', phase: 'Inicio del partido', intent: 'Entrada, ajuste inicial y lectura de postura' },
      '16-22': { label: '16-22', phase: 'Prehidratación', intent: 'Ritmo estabilizado antes de la pausa técnica' },
      '23-29': { label: '23-29', phase: 'Poshidratación', intent: 'Regreso de la pausa, reorganización y retomada' },
      '30-40': { label: '30-40', phase: 'Tramo medio', intent: 'Tramo de consolidación y presión sostenida' },
      '41-45': { label: '41-45', phase: 'Cierre 1T', intent: 'Final normal del primer tiempo' },
      '45+': { label: '45+', phase: 'Descuentos 1T', intent: 'Tiempo añadido del 1T, riesgo de desconcentración' },
      '45-60FT': { label: '45-60 FT', phase: 'Inicio FT', intent: 'Reinicio, ajustes del descanso y presión inicial' },
      '61-67FT': { label: '61-67 FT', phase: 'Prehidratación FT', intent: 'Antes de la pausa, el desgaste empieza a pesar' },
      '68-74FT': { label: '68-74 FT', phase: 'Poshidratación FT', intent: 'Regreso de la pausa y reorganización final' },
      '75-85FT': { label: '75-85 FT', phase: 'Tramo medio FT', intent: 'Tramo de mayor tensión, cambios y cansancio' },
      '86-90FT': { label: '86-90 FT', phase: 'Cierre FT', intent: 'Presión final antes de los descuentos' },
      '90+': { label: '90+', phase: 'Descuentos FT', intent: 'Partido abierto, desesperación o gestión frágil' }
    },
    notes: [
      'El bloque {bestLabel} lidera con {bestGoals} goles.',
      'El 2T concentra el {secondHalfPct}% de los goles en la muestra actual.',
      'Los descuentos 45+ y 90+ suman {stoppageGoals} goles, manteniendo alta relevancia operativa.',
      '45-60 FT registró {ftOpeningGoals} goles; la poshidratación reúne {postHydrationGoals} goles en la muestra actual.'
    ],
    insights: [
      { title: 'Mejores ventanas de presión', tone: 'hot', text: 'El bloque {bestLabel} es el más fuerte de la muestra actualizada, con {bestGoals} goles. Mezcla cambios, caída física y presión por el resultado, aumentando la posibilidad de un partido más abierto.' },
      { title: 'Los descuentos no se pueden ignorar', tone: 'default', text: '45+ y 90+ juntos representan el {stoppagePct}% de los goles. Para lectura del tramo final, considerar el descuento real es esencial.' },
      { title: 'La poshidratación sigue débil', tone: 'cold', text: 'Los bloques 23-29 y 68-74 suman {postHydrationGoals} goles. Hasta ahora, el regreso después de la pausa no aparece como el principal pico de goles.' }
    ]
  }
};
