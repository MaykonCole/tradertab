export const bucketRows = [
  { id: '0-15', goals: 5, minutes: '0–15', half: '1T' },
  { id: '16-22', goals: 7, minutes: '16–22', half: '1T' },
  { id: '23-29', goals: 3, minutes: '23–29', half: '1T' },
  { id: '30-40', goals: 6, minutes: '30–40', half: '1T' },
  { id: '41-45', goals: 3, minutes: '41–45', half: '1T' },
  { id: '45+', goals: 2, minutes: '45+', half: '1T+' },
  { id: '45-60FT', goals: 8, minutes: '46–60', half: '2T' },
  { id: '61-67FT', goals: 6, minutes: '61–67', half: '2T' },
  { id: '68-74FT', goals: 2, minutes: '68–74', half: '2T' },
  { id: '75-85FT', goals: 10, minutes: '75–85', half: '2T' },
  { id: '86-90FT', goals: 3, minutes: '86–90', half: '2T' },
  { id: '90+', goals: 7, minutes: '90+', half: '2T+' }
];

export const matchRows = [
  { date: '11/06', group: 'A', goals: 2, teams: { pt: 'México 2 x 0 África do Sul', en: 'Mexico 2 x 0 South Africa', es: 'México 2 x 0 Sudáfrica' } },
  { date: '11/06', group: 'A', goals: 3, teams: { pt: 'Coreia do Sul 2 x 1 Tchéquia', en: 'South Korea 2 x 1 Czechia', es: 'Corea del Sur 2 x 1 Chequia' } },
  { date: '12/06', group: 'B', goals: 2, teams: { pt: 'Canadá 1 x 1 Bósnia e Herzegovina', en: 'Canada 1 x 1 Bosnia and Herzegovina', es: 'Canadá 1 x 1 Bosnia y Herzegovina' } },
  { date: '12/06', group: 'D', goals: 5, teams: { pt: 'Estados Unidos 4 x 1 Paraguai', en: 'United States 4 x 1 Paraguay', es: 'Estados Unidos 4 x 1 Paraguay' } },
  { date: '13/06', group: 'B', goals: 2, teams: { pt: 'Catar 1 x 1 Suíça', en: 'Qatar 1 x 1 Switzerland', es: 'Catar 1 x 1 Suiza' } },
  { date: '13/06', group: 'C', goals: 2, teams: { pt: 'Brasil 1 x 1 Marrocos', en: 'Brazil 1 x 1 Morocco', es: 'Brasil 1 x 1 Marruecos' } },
  { date: '13/06', group: 'C', goals: 1, teams: { pt: 'Haiti 0 x 1 Escócia', en: 'Haiti 0 x 1 Scotland', es: 'Haití 0 x 1 Escocia' } },
  { date: '14/06', group: 'D', goals: 2, teams: { pt: 'Austrália 2 x 0 Turquia', en: 'Australia 2 x 0 Turkey', es: 'Australia 2 x 0 Turquía' } },
  { date: '14/06', group: 'E', goals: 8, teams: { pt: 'Alemanha 7 x 1 Curaçao', en: 'Germany 7 x 1 Curaçao', es: 'Alemania 7 x 1 Curazao' } },
  { date: '14/06', group: 'F', goals: 4, teams: { pt: 'Holanda 2 x 2 Japão', en: 'Netherlands 2 x 2 Japan', es: 'Países Bajos 2 x 2 Japón' } },
  { date: '14/06', group: 'E', goals: 1, teams: { pt: 'Costa do Marfim 1 x 0 Equador', en: 'Ivory Coast 1 x 0 Ecuador', es: 'Costa de Marfil 1 x 0 Ecuador' } },
  { date: '14/06', group: 'F', goals: 6, teams: { pt: 'Suécia 5 x 1 Tunísia', en: 'Sweden 5 x 1 Tunisia', es: 'Suecia 5 x 1 Túnez' } },
  { date: '15/06', group: 'H', goals: 0, teams: { pt: 'Espanha 0 x 0 Cabo Verde', en: 'Spain 0 x 0 Cape Verde', es: 'España 0 x 0 Cabo Verde' } },
  { date: '15/06', group: 'G', goals: 2, teams: { pt: 'Bélgica 1 x 1 Egito', en: 'Belgium 1 x 1 Egypt', es: 'Bélgica 1 x 1 Egipto' } },
  { date: '15/06', group: 'H', goals: 2, teams: { pt: 'Arábia Saudita 1 x 1 Uruguai', en: 'Saudi Arabia 1 x 1 Uruguay', es: 'Arabia Saudita 1 x 1 Uruguay' } },
  { date: '15/06', group: 'G', goals: 4, teams: { pt: 'Irã 2 x 2 Nova Zelândia', en: 'Iran 2 x 2 New Zealand', es: 'Irán 2 x 2 Nueva Zelanda' } },
  { date: '16/06', group: 'I', goals: 4, teams: { pt: 'França 3 x 1 Senegal', en: 'France 3 x 1 Senegal', es: 'Francia 3 x 1 Senegal' } },
  { date: '16/06', group: 'I', goals: 5, teams: { pt: 'Iraque 1 x 4 Noruega', en: 'Iraq 1 x 4 Norway', es: 'Irak 1 x 4 Noruega' } },
  { date: '16/06', group: 'J', goals: 3, teams: { pt: 'Argentina 3 x 0 Argélia', en: 'Argentina 3 x 0 Algeria', es: 'Argentina 3 x 0 Argelia' } },
  { date: '16/06', group: 'J', goals: 4, teams: { pt: 'Áustria 3 x 1 Jordânia', en: 'Austria 3 x 1 Jordan', es: 'Austria 3 x 1 Jordania' } }
];

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
      bestBlockValue: '75-85 FT',
      bestBlockDetail: '10 gols',
      stoppage: 'Acréscimos',
      stoppageValue: '9 gols',
      stoppageDetail: '45+ e 90+ somados'
    },
    chart: { eyebrow: 'Distribuição por momento', title: 'Onde os gols estão acontecendo' },
    side: { eyebrow: 'Resumo executivo', title: 'Padrões principais' },
    split: { first: '1T + 45+', second: '2T + 90+' },
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
      'O bloco 75-85 FT lidera com 10 gols.',
      'O 2T concentra 58,1% dos gols quando somamos 45-90+.',
      'Acréscimos 45+ e 90+ somam 9 gols, mantendo alta relevância operacional.',
      'Pós-hidratação FT segue baixo, enquanto 16-22 e 45-60 FT ganharam força com os novos jogos.'
    ],
    insights: [
      { title: 'Melhores janelas de pressão', tone: 'hot', text: 'O bloco 75-85 FT é o mais forte da amostra. Ele mistura substituições, queda física e necessidade de resultado, aumentando a chance de jogo aberto.' },
      { title: 'Acréscimos não podem ser ignorados', tone: 'default', text: '45+ e 90+ juntos representam 14,5% dos gols. Para leitura de tempo final, considerar o acréscimo real é essencial.' },
      { title: 'Pós-hidratação ainda fraco', tone: 'cold', text: 'Os blocos 23-29 e 68-74 somam apenas 5 gols. Até agora, a retomada depois da pausa não aparece como pico principal.' }
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
      bestBlockValue: '75-85 FT',
      bestBlockDetail: '10 goals',
      stoppage: 'Stoppage time',
      stoppageValue: '9 goals',
      stoppageDetail: '45+ and 90+ combined'
    },
    chart: { eyebrow: 'Distribution by moment', title: 'Where goals are happening' },
    side: { eyebrow: 'Executive summary', title: 'Main patterns' },
    split: { first: '1H + 45+', second: '2H + 90+' },
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
      'The 75-85 FT block leads with 10 goals.',
      'The second half accounts for 58.1% of goals when 45-90+ is combined.',
      'Stoppage time at 45+ and 90+ adds up to 9 goals, keeping strong operational relevance.',
      'FT post-hydration remains low, while 16-22 and 45-60 FT gained strength with the new matches.'
    ],
    insights: [
      { title: 'Best pressure windows', tone: 'hot', text: 'The 75-85 FT block is the strongest in the sample. It combines substitutions, physical decline and score-pressure, increasing the chance of a more open match.' },
      { title: 'Stoppage time matters', tone: 'default', text: '45+ and 90+ together represent 14.5% of all goals. For end-game reading, the real added-time expectation is essential.' },
      { title: 'Post-hydration is still weak', tone: 'cold', text: 'The 23-29 and 68-74 blocks combine for only 5 goals. So far, the restart after the pause is not the main scoring peak.' }
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
      bestBlockValue: '75-85 FT',
      bestBlockDetail: '10 goles',
      stoppage: 'Descuentos',
      stoppageValue: '9 goles',
      stoppageDetail: '45+ y 90+ sumados'
    },
    chart: { eyebrow: 'Distribución por momento', title: 'Dónde están ocurriendo los goles' },
    side: { eyebrow: 'Resumen ejecutivo', title: 'Patrones principales' },
    split: { first: '1T + 45+', second: '2T + 90+' },
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
      'El bloque 75-85 FT lidera con 10 goles.',
      'El 2T concentra el 58,1% de los goles al sumar 45-90+.',
      'Los descuentos 45+ y 90+ suman 9 goles, manteniendo alta relevancia operativa.',
      'La poshidratación FT sigue baja, mientras 16-22 y 45-60 FT ganaron fuerza con los nuevos partidos.'
    ],
    insights: [
      { title: 'Mejores ventanas de presión', tone: 'hot', text: 'El bloque 75-85 FT es el más fuerte de la muestra. Mezcla cambios, caída física y presión por el resultado, aumentando la posibilidad de un partido más abierto.' },
      { title: 'Los descuentos no se pueden ignorar', tone: 'default', text: '45+ y 90+ juntos representan el 14,5% de los goles. Para lectura del tramo final, considerar el descuento real es esencial.' },
      { title: 'La poshidratación sigue débil', tone: 'cold', text: 'Los bloques 23-29 y 68-74 suman solo 5 goles. Hasta ahora, el regreso después de la pausa no aparece como el principal pico de goles.' }
    ]
  }
};
