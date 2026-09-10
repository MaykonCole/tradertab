import React, { useEffect, useMemo, useRef, useState } from "react";
import historyOddIcon from "./assets/historyodd-icon.png";
import {
  ArrowUpDown,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Download,
  Filter,
  Gauge,
  LineChart,
  LockKeyhole,
  PlayCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Instagram,
} from "lucide-react";

const REGUA_SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbxuSAtXNbMuc_4t5Xas4d7ONzywWT5PUx1x1TNuu0WWXyGLci_aExuG__xAK1CDiwEE/exec";

const HISTORY_ODD_DOWNLOAD_URL =
  "https://github.com/MaykonCole/HistoryOdd-Releases/releases/latest/download/HistoryOdd-win-Setup.exe";

const HISTORY_ODD_PURCHASE_URL =
  "https://pay.kirvano.com/8a79d04a-5602-43c6-83b7-bf9a2f1127c2";
const HISTORY_ODD_INSTAGRAM_URL = "https://www.instagram.com/history_odd/";
const HISTORY_ODD_VIDEO_URL = "/api/historyodd-video-stream";
const HISTORY_ODD_PROGRESS_STORAGE = "historyodd-video-progress-v1";
const HISTORY_ODD_COMPLETION_STORAGE = "historyodd-video-completion-v1";

const copy = {
  pt: {
    eyebrow: "Histórico de mercado",
    title: "Histórico Odds",
    subtitle:
      "Leia o comportamento real das odds, identifique acelerações, correções e momentos em que o mercado começa a pagar mais rápido.",
    salesBadge: "HISTORYODD · LEITURA PROFISSIONAL DE MERCADO",
    salesTitleLead: "Veja o mercado se mover",
    salesTitleAccent: "antes de tomar sua decisão.",
    salesDescription:
      "O HistoryOdd transforma a variação das odds em uma leitura visual e objetiva. Acompanhe o percentual pago, o ritmo do mercado, movimentos e histórico em tempo real para operar com muito mais contexto.",
    watchTitle: "Assista ao vídeo completo e libere seu Trial",
    watchDescriptionLogged:
      "Você está logado: concluindo o vídeo pelo player abaixo, sua conta libera uma licença Trial de 14 dias.",
    watchDescriptionGuest:
      "Conclua o vídeo pelo player abaixo para liberar uma licença Trial de 7 dias. Depois, entre ou crie sua conta para ativar a licença.",
    loggedTrial: "LOGADO · 14 DIAS DE TRIAL",
    guestTrial: "VISITANTE · 7 DIAS DE TRIAL",
    videoProgress: "Progresso do vídeo",
    videoComplete: "Vídeo concluído · Trial liberado",
    videoPreparing: "Preparando validação do vídeo...",
    videoError: "Não foi possível validar o progresso agora. Recarregue a página e tente novamente.",
    mustWatchHere: "Para liberar o Trial, o vídeo precisa ser assistido por este player.",
    buyNow: "Adquirir Licença",
    buySubtext: "Acesso imediato após a confirmação do pagamento",
    downloadApp: "Baixar HistoryOdd",
    trialLocked: "Assista ao vídeo até o final para liberar",
    trialUnlocked14: "Ativar Trial de 14 dias",
    trialUnlocked7: "Ativar Trial de 7 dias",
    loginToActivate: "Entrar para ativar Trial de 7 dias",
    featureRealtime: "Leitura em tempo real",
    featureRealtimeText: "Acompanhe a odd e o percentual pago enquanto o mercado se movimenta.",
    featureMovement: "Movimento e contexto",
    featureMovementText: "Identifique aceleração, lateralização, correção e mudanças de ritmo.",
    featureHistory: "Histórico objetivo",
    featureHistoryText: "Compare períodos e entenda onde o mercado pagou mais ou menos.",
    memberOnlyTitle: "Entre para acessar o Histórico Odds",
    memberOnlyText: "A Landing Page e o vídeo são públicos. As réguas e o histórico completo continuam disponíveis para usuários logados.",
    memberOnlyButton: "Entrar gratuitamente",
    downloadHistoryOdd: "Download HistoryOdd",
    requestTrial: "Licença Gratuita",
    trialRequesting: "Ativando licença...",
    trialSuccess: "Licença Trial ativada com sucesso.",
    trialAlreadyUsed: "Este e-mail já utilizou a licença gratuita.",
    trialError: "Não foi possível ativar a licença gratuita agora. Tente novamente.",
    loggedTrialModalTitle: "Trial ativado com sucesso!",
    loggedTrialModalText: "Agora baixe o HistoryOdd pelo botão Baixar HistoryOdd e, no aplicativo, faça login usando este mesmo e-mail da sua conta para acessar a licença Trial.",
    understood: "Entendi",
    guestTrialModalTitle: "Escolha o e-mail da sua licença Trial",
    guestTrialModalText: "Você concluiu o vídeo como visitante e ganhou 7 dias de Trial. Se tivesse assistido logado no TraderTab, receberia 14 dias. Informe abaixo um e-mail válido ao qual você tenha acesso.",
    guestEmailLabel: "E-mail para a licença",
    guestEmailPlaceholder: "seuemail@exemplo.com",
    guestGenerateTrial: "Gerar Licença Trial",
    guestGeneratingTrial: "Gerando licença...",
    guestInvalidEmail: "Informe um e-mail válido.",
    date: "Data",
    team: "Time",
    teamPlaceholder: "Buscar por time",
    period: "Período",
    marketFilter: "Mercado",
    ordering: "Ordenação",
    orderDate: "Data",
    orderRecords: "Quant. Registros",
    highestAverage: "% Médio Maior",
    lowestAverage: "% Médio Menor",
    goals: "Gols",
    matchOdds: "Resultado da Partida",
    all: "Todos",
    ht: "1° Tempo",
    ft: "2° Tempo",
    clear: "Limpar filtros",
    refresh: "Atualizar",
    loading: "Carregando réguas da planilha...",
    loadError: "Não foi possível carregar as réguas.",
    noResultsTitle: "Nenhuma régua encontrada",
    noResultsText: "Ajuste os filtros ou atualize a leitura da planilha.",
    cardsFound: "réguas encontradas",
    recordedPoints: "pontos reais",
    market: "Mercado",
    collapse: "Ocultar régua",
    expand: "Exibir régua",
    paid: "% Pago",
    averagePaid: "% Pago médio",
    noOdd: "Sem odd",
    updatedAt: "Atualizado em",
    createdAt: "Criado em",
  },
  en: {
    eyebrow: "Market history",
    title: "Odds History",
    subtitle:
      "Read real odds behavior, spot accelerations, corrections and the moments when the market starts paying faster.",
    salesBadge: "HISTORYODD · PROFESSIONAL MARKET READING",
    salesTitleLead: "See the market move",
    salesTitleAccent: "before you make your decision.",
    salesDescription:
      "HistoryOdd turns odds variation into an objective visual reading. Follow paid percentage, market pace, movements and real-time history with much more context.",
    watchTitle: "Watch the full video and unlock your Trial",
    watchDescriptionLogged:
      "You are signed in: complete the video in the player below to unlock a 14-day Trial license for your account.",
    watchDescriptionGuest:
      "Complete the video in the player below to unlock a 7-day Trial. Then sign in or create your account to activate it.",
    loggedTrial: "SIGNED IN · 14-DAY TRIAL",
    guestTrial: "VISITOR · 7-DAY TRIAL",
    videoProgress: "Video progress",
    videoComplete: "Video completed · Trial unlocked",
    videoPreparing: "Preparing video validation...",
    videoError: "We could not validate progress right now. Reload the page and try again.",
    mustWatchHere: "To unlock the Trial, the video must be watched in this player.",
    buyNow: "Buy License",
    buySubtext: "Immediate access after payment confirmation",
    downloadApp: "Download HistoryOdd",
    trialLocked: "Watch the video until the end to unlock",
    trialUnlocked14: "Activate 14-day Trial",
    trialUnlocked7: "Activate 7-day Trial",
    loginToActivate: "Sign in to activate 7-day Trial",
    featureRealtime: "Real-time reading",
    featureRealtimeText: "Track odds and paid percentage while the market moves.",
    featureMovement: "Movement and context",
    featureMovementText: "Identify acceleration, ranging, correction and pace changes.",
    featureHistory: "Objective history",
    featureHistoryText: "Compare periods and understand where the market paid more or less.",
    memberOnlyTitle: "Sign in to access Odds History",
    memberOnlyText: "The Landing Page and video are public. Full ladders and history remain available to signed-in users.",
    memberOnlyButton: "Sign in free",
    downloadHistoryOdd: "Download HistoryOdd",
    requestTrial: "Free License",
    trialRequesting: "Activating license...",
    trialSuccess: "Trial license activated successfully.",
    trialAlreadyUsed: "This email has already used the free license.",
    trialError: "We could not activate the free license right now. Try again.",
    loggedTrialModalTitle: "Trial activated successfully!",
    loggedTrialModalText: "Now download HistoryOdd using the Download HistoryOdd button and sign in to the app with the same email from your account to access the Trial license.",
    understood: "Got it",
    guestTrialModalTitle: "Choose the email for your Trial license",
    guestTrialModalText: "You completed the video as a visitor and earned a 7-day Trial. If you had watched while signed in to TraderTab, you would receive 14 days. Enter a valid email address you can access.",
    guestEmailLabel: "License email",
    guestEmailPlaceholder: "you@example.com",
    guestGenerateTrial: "Generate Trial License",
    guestGeneratingTrial: "Generating license...",
    guestInvalidEmail: "Enter a valid email address.",
    date: "Date",
    team: "Team",
    teamPlaceholder: "Search team",
    period: "Period",
    marketFilter: "Market",
    ordering: "Ordering",
    orderDate: "Date",
    orderRecords: "Record count",
    highestAverage: "Highest avg. %",
    lowestAverage: "Lowest avg. %",
    goals: "Goals",
    matchOdds: "Match Odds",
    all: "All",
    ht: "HT",
    ft: "FT",
    clear: "Clear filters",
    refresh: "Refresh",
    loading: "Loading ladder records from the spreadsheet...",
    loadError: "The ladder records could not be loaded.",
    noResultsTitle: "No ladder found",
    noResultsText: "Adjust the filters or refresh the spreadsheet source.",
    cardsFound: "ladders found",
    recordedPoints: "real points",
    market: "Market",
    collapse: "Hide ladder",
    expand: "Show ladder",
    paid: "% Paid",
    averagePaid: "Avg. %",
    noOdd: "No odds",
    updatedAt: "Updated at",
    createdAt: "Created at",
  },
  es: {
    eyebrow: "Historial de mercado",
    title: "Histórico Odds",
    subtitle:
      "Lee el comportamiento real de las cuotas, detecta aceleraciones, correcciones y los momentos en que el mercado empieza a pagar más rápido.",
    salesBadge: "HISTORYODD · LECTURA PROFESIONAL DE MERCADO",
    salesTitleLead: "Mira cómo se mueve el mercado",
    salesTitleAccent: "antes de tomar tu decisión.",
    salesDescription:
      "HistoryOdd transforma la variación de cuotas en una lectura visual y objetiva. Sigue el porcentaje pagado, el ritmo, los movimientos y el historial en tiempo real.",
    watchTitle: "Mira el video completo y libera tu Trial",
    watchDescriptionLogged:
      "Estás conectado: completa el video en el reproductor para liberar una licencia Trial de 14 días.",
    watchDescriptionGuest:
      "Completa el video en el reproductor para liberar una licencia Trial de 7 días. Después inicia sesión o crea tu cuenta para activarla.",
    loggedTrial: "CONECTADO · TRIAL DE 14 DÍAS",
    guestTrial: "VISITANTE · TRIAL DE 7 DÍAS",
    videoProgress: "Progreso del video",
    videoComplete: "Video completado · Trial liberado",
    videoPreparing: "Preparando validación del video...",
    videoError: "No fue posible validar el progreso. Recarga la página e inténtalo de nuevo.",
    mustWatchHere: "Para liberar el Trial, el video debe verse en este reproductor.",
    buyNow: "Adquirir Licencia",
    buySubtext: "Acceso inmediato tras confirmar el pago",
    downloadApp: "Descargar HistoryOdd",
    trialLocked: "Mira el video hasta el final para liberar",
    trialUnlocked14: "Activar Trial de 14 días",
    trialUnlocked7: "Activar Trial de 7 días",
    loginToActivate: "Entrar para activar Trial de 7 días",
    featureRealtime: "Lectura en tiempo real",
    featureRealtimeText: "Sigue la cuota y el porcentaje pagado mientras se mueve el mercado.",
    featureMovement: "Movimiento y contexto",
    featureMovementText: "Identifica aceleración, lateralización, corrección y cambios de ritmo.",
    featureHistory: "Historial objetivo",
    featureHistoryText: "Compara periodos y entiende dónde el mercado pagó más o menos.",
    memberOnlyTitle: "Entra para acceder al Histórico Odds",
    memberOnlyText: "La Landing Page y el video son públicos. Las reglas y el historial completo siguen disponibles para usuarios conectados.",
    memberOnlyButton: "Entrar gratis",
    downloadHistoryOdd: "Descargar HistoryOdd",
    requestTrial: "Licencia Gratuita",
    trialRequesting: "Activando licencia...",
    trialSuccess: "Licencia Trial activada correctamente.",
    trialAlreadyUsed: "Este correo ya utilizó la licencia gratuita.",
    trialError: "No fue posible activar la licencia gratuita ahora. Inténtalo de nuevo.",
    loggedTrialModalTitle: "¡Trial activado correctamente!",
    loggedTrialModalText: "Ahora descarga HistoryOdd con el botón Descargar HistoryOdd e inicia sesión en la aplicación usando el mismo correo de tu cuenta para acceder a la licencia Trial.",
    understood: "Entendido",
    guestTrialModalTitle: "Elige el correo de tu licencia Trial",
    guestTrialModalText: "Completaste el video como visitante y ganaste 7 días de Trial. Si lo hubieras visto conectado a TraderTab, recibirías 14 días. Introduce un correo válido al que tengas acceso.",
    guestEmailLabel: "Correo para la licencia",
    guestEmailPlaceholder: "tucorreo@ejemplo.com",
    guestGenerateTrial: "Generar Licencia Trial",
    guestGeneratingTrial: "Generando licencia...",
    guestInvalidEmail: "Introduce un correo válido.",
    date: "Fecha",
    team: "Equipo",
    teamPlaceholder: "Buscar equipo",
    period: "Periodo",
    marketFilter: "Mercado",
    ordering: "Ordenación",
    orderDate: "Fecha",
    orderRecords: "Cant. registros",
    highestAverage: "% medio mayor",
    lowestAverage: "% medio menor",
    goals: "Goles",
    matchOdds: "Resultado del Partido",
    all: "Todos",
    ht: "Primer tiempo",
    ft: "Segundo tiempo",
    clear: "Limpiar filtros",
    refresh: "Actualizar",
    loading: "Cargando reglas desde la hoja...",
    loadError: "No fue posible cargar las reglas.",
    noResultsTitle: "No se encontró ninguna regla",
    noResultsText: "Ajusta los filtros o actualiza la lectura de la hoja.",
    cardsFound: "reglas encontradas",
    recordedPoints: "puntos reales",
    market: "Mercado",
    collapse: "Ocultar regla",
    expand: "Mostrar regla",
    paid: "% Pagado",
    averagePaid: "% Medio",
    noOdd: "Sin cuota",
    updatedAt: "Actualizado en",
    createdAt: "Creado en",
  },
};

const SHEET_MINUTES = [45, 50, 55, 60, 65, 70, 75, 80, 85, 90];

const getField = (row, ...keys) => {
  for (const key of keys) {
    const value = row?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }
  return "";
};

const parseNumber = (value) => {
  const text = String(value ?? "")
    .trim()
    .replace("%", "")
    .replace(",", ".");
  if (!text) return null;
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
};

const parseDate = (value) => {
  const text = String(value ?? "").trim();
  if (!text) return null;
  const br = text.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (br) return new Date(Number(br[3]), Number(br[2]) - 1, Number(br[1]));
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const toInputDate = (value) => {
  const date = parseDate(value);
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDate = (value, language) => {
  const date = parseDate(value);
  if (!date) return String(value ?? "");
  const locale =
    language === "en" ? "en-US" : language === "es" ? "es-ES" : "pt-BR";
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const formatDateTime = (value, language) => {
  if (!value) return "";
  const locale =
    language === "en" ? "en-US" : language === "es" ? "es-ES" : "pt-BR";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const oddText = (value) => {
  if (!Number.isFinite(value)) return "--";
  return value.toFixed(2);
};

const paidText = (value) => {
  if (!Number.isFinite(value)) return "";
  return `${value.toFixed(1)}%`;
};

const classifyMarket = (value) => {
  const text = String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return "other";

  if (
    text.includes("match odds") ||
    text.includes("matchodds") ||
    text.includes("resultado da partida") ||
    text.includes("resultado del partido") ||
    text.includes("moneyline")
  ) {
    return "matchOdds";
  }

  if (
    text.includes("under") ||
    text.includes("over") ||
    text.includes("menos") ||
    text.includes("mais") ||
    text.includes("gols") ||
    text.includes("goals") ||
    text.includes("goles")
  ) {
    return "goals";
  }

  return "other";
};

const marketLabel = (record, t) => {
  if (record.marketType === "matchOdds") return t.matchOdds;
  if (record.marketType === "goals") return t.goals;
  return record.market || t.market;
};

const normalizeReguaRow = (row) => {
  const period =
    String(getField(row, "Tempo", "tempo"))
      .trim()
      .toUpperCase() || "FT";
  const homeTeam = String(
    getField(row, "TimeCasa", "Casa", "homeTeam", "HomeTeam"),
  ).trim();
  const awayTeam = String(
    getField(row, "TimeFora", "Fora", "awayTeam", "AwayTeam"),
  ).trim();
  const market = String(
    getField(row, "Mercado", "market", "MercadoNome"),
  ).trim();
  const date = getField(row, "DataJogo", "Data", "dataJogo", "date");

  const points = SHEET_MINUTES.map((sheetMinute, index) => {
    const odd = parseNumber(getField(row, `Odd_${sheetMinute}`));
    const previousMinute = SHEET_MINUTES[index - 1];
    const paid =
      previousMinute === undefined
        ? null
        : parseNumber(getField(row, `Pago_${previousMinute}_${sheetMinute}`));

    return {
      id: String(sheetMinute),
      sheetMinute,
      displayMinute: period === "HT" ? sheetMinute - 45 : sheetMinute,
      odd,
      paid,
    };
  });

  const realPoints = points.filter((point) => Number.isFinite(point.odd));

  return {
    id:
      String(getField(row, "ReguaId", "ID", "id")).trim() ||
      `${homeTeam}-${awayTeam}-${market}-${period}-${date}`,
    reguaId: String(getField(row, "ReguaId", "ID", "id")).trim(),
    date,
    dateKey: toInputDate(date),
    match: `${homeTeam} x ${awayTeam}`.trim(),
    homeTeam,
    awayTeam,
    market,
    marketType: classifyMarket(market),
    period,
    user: getField(row, "Usuario", "user"),
    time: getField(row, "Horario", "Horário", "time"),
    createdAt: getField(row, "CriadoEm", "createdAt"),
    updatedAt: getField(row, "AtualizadoEm", "updatedAt"),
    points,
    realPoints,
    sourceRecordCount: 1,
  };
};

const normalizeKeyPart = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const recordTimestamp = (record) => {
  const candidates = [record?.updatedAt, record?.createdAt];
  for (const value of candidates) {
    if (!value) continue;
    const parsed = new Date(value).getTime();
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
};

const mergeReguaRecords = (records) => {
  const groups = new Map();

  records.forEach((record) => {
    // Uma régua representa um único jogo/data/período/mercado.
    // Usuários ou gravações diferentes do mesmo contexto alimentam a mesma régua.
    const key = [
      record.dateKey || toInputDate(record.date),
      normalizeKeyPart(record.homeTeam),
      normalizeKeyPart(record.awayTeam),
      normalizeKeyPart(record.period),
      // A tela agrupa pelo tipo visual do mercado. Ex.: diferentes nomes de
      // mercado classificados como "Gols" pertencem à mesma régua do jogo.
      normalizeKeyPart(record.marketType || record.market),
    ].join("|");

    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(record);
  });

  return Array.from(groups.entries()).map(([key, group]) => {
    if (group.length === 1) return group[0];

    const ordered = [...group].sort(
      (a, b) => recordTimestamp(a) - recordTimestamp(b),
    );
    const base = ordered[ordered.length - 1];

    const points = SHEET_MINUTES.map((sheetMinute) => {
      let selectedPoint = null;
      let sourceRecord = null;

      // Se houver sobreposição no mesmo minuto, prevalece a gravação mais recente.
      // Guardamos também de qual régua original o ponto veio para NÃO criar
      // percentuais artificiais entre registros diferentes durante a mesclagem.
      for (const record of ordered) {
        const point = record.points.find(
          (item) => item.sheetMinute === sheetMinute,
        );
        if (point && Number.isFinite(point.odd)) {
          selectedPoint = point;
          sourceRecord = record;
        }
      }

      return {
        id: String(sheetMinute),
        sheetMinute,
        displayMinute: base.period === "HT" ? sheetMinute - 45 : sheetMinute,
        odd: selectedPoint?.odd ?? null,
        paid: null,
        sourceRecord,
        sourcePoint: selectedPoint,
      };
    });

    // O percentual só é real quando os dois pontos consecutivos pertencem à
    // MESMA régua original. Nunca calculamos um percentual novo na fronteira
    // criada pela mesclagem (ex.: 55 de uma régua + 60 de outra régua).
    points.forEach((point, index) => {
      if (index === 0 || !point.sourceRecord) return;
      const previous = points[index - 1];
      if (
        !previous.sourceRecord ||
        previous.sourceRecord !== point.sourceRecord
      )
        return;

      // Mantém exatamente o percentual salvo na régua original, sem recalcular.
      point.paid = Number.isFinite(point.sourcePoint?.paid)
        ? point.sourcePoint.paid
        : null;
    });

    const users = Array.from(
      new Set(
        group
          .flatMap((record) => String(record.user || "").split("-"))
          .map((value) => value.trim())
          .filter(Boolean),
      ),
    );

    // Remove os metadados internos de origem antes de enviar os pontos para a UI.
    const mergedPoints = points.map(
      ({ sourceRecord, sourcePoint, ...point }) => point,
    );
    const realPoints = mergedPoints.filter((point) =>
      Number.isFinite(point.odd),
    );

    return {
      ...base,
      id: `merged-${key}`,
      reguaId: group
        .map((record) => record.reguaId)
        .filter(Boolean)
        .join("|"),
      user: users.join(" - "),
      points: mergedPoints,
      realPoints,
      sourceRecordCount: group.length,
    };
  });
};

const getAveragePaid = (record) => {
  const values = (record?.points || [])
    .map((point) => point.paid)
    .filter((value) => Number.isFinite(value));

  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const looksLikeRegua = (row) => {
  if (!row || typeof row !== "object") return false;
  const keys = Object.keys(row);
  return (
    keys.some((key) => /^Odd_\d+$/i.test(key)) ||
    keys.includes("Mercado") ||
    keys.includes("Tempo")
  );
};

const extractRecords = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.reguas)) return payload.reguas;
  if (Array.isArray(payload?.records)) return payload.records;
  if (Array.isArray(payload?.rows)) return payload.rows;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.games) && payload.games.some(looksLikeRegua))
    return payload.games;
  return [];
};

async function fetchReguas() {
  const response = await fetch(`${REGUA_SHEETS_URL}?tipo=reguas`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const payload = await response.json();

  if (payload?.success === false) {
    throw new Error(payload?.error || "Erro ao carregar réguas.");
  }

  const records = Array.isArray(payload?.reguas) ? payload.reguas : [];
  return records.map(normalizeReguaRow);
}

export default function OddsHistoryPage({ language = "pt", authUser = null, onRequestLogin = null }) {
  const t = copy[language] || copy.pt;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [records, setRecords] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [marketFilter, setMarketFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("date");
  const [expandedIds, setExpandedIds] = useState(() => new Set());
  const [trialBusy, setTrialBusy] = useState(false);
  const [trialMessage, setTrialMessage] = useState("");
  const [trialMessageType, setTrialMessageType] = useState("");
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoCompletionToken, setVideoCompletionToken] = useState("");
  const [videoEntitlementDays, setVideoEntitlementDays] = useState(null);
  const [videoProgressToken, setVideoProgressToken] = useState("");
  const [videoAllowedSeekTo, setVideoAllowedSeekTo] = useState(2);
  const [videoStatus, setVideoStatus] = useState("");
  const [videoValidationBusy, setVideoValidationBusy] = useState(false);
  const [videoPlaybackRate, setVideoPlaybackRate] = useState(1);
  const [trialModal, setTrialModal] = useState("");
  const [guestTrialEmail, setGuestTrialEmail] = useState("");
  const [guestTrialStatus, setGuestTrialStatus] = useState("");
  const [guestTrialBusy, setGuestTrialBusy] = useState(false);
  const videoRef = useRef(null);
  const lastCheckpointRef = useRef(0);
  const checkpointInFlightRef = useRef(false);
  const videoValidationHealthyRef = useRef(true);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const nextRecords = mergeReguaRecords(await fetchReguas()).filter(
        (record) => {
          const averagePaid = getAveragePaid(record);
          // Descarta régua de teste/lixo quando todos os percentuais válidos
          // resultam em média paga de 0%. Réguas sem percentual permanecem.
          return !Number.isFinite(averagePaid) || Math.abs(averagePaid) > 0.0001;
        },
      );
      nextRecords.sort((a, b) => {
        const dateA = parseDate(a.date)?.getTime() || 0;
        const dateB = parseDate(b.date)?.getTime() || 0;
        if (dateA !== dateB) return dateB - dateA;
        return `${a.match} ${a.market}`.localeCompare(`${b.match} ${b.market}`);
      });
      setRecords(nextRecords);
    } catch (loadError) {
      setError(loadError?.message || "load-error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const videoIdentityKey = authUser?.uid ? `user:${authUser.uid}` : "guest";
  const scopedVideoStorageKey = (baseKey) => `${baseKey}:${videoIdentityKey}`;

  useEffect(() => {
    // O progresso pertence à identidade que assistiu ao vídeo. Ao trocar de
    // conta (ou entrar/sair), zera o estado em memória e carrega somente o
    // progresso daquela identidade. Assim uma conta nunca herda os 100% de outra.
    setVideoProgress(0);
    setVideoCompletionToken("");
    setVideoEntitlementDays(null);
    setVideoProgressToken("");
    setVideoAllowedSeekTo(2);
    setVideoStatus("");
    setVideoPlaybackRate(1);
    lastCheckpointRef.current = 0;
    checkpointInFlightRef.current = false;
    videoValidationHealthyRef.current = true;

    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
      video.playbackRate = 1;
    }

    try {
      const savedProgress = JSON.parse(
        localStorage.getItem(scopedVideoStorageKey(HISTORY_ODD_PROGRESS_STORAGE)) || "{}",
      );
      if (savedProgress?.token) {
        setVideoProgressToken(savedProgress.token);
        setVideoAllowedSeekTo(Number(savedProgress.allowedSeekTo) || 2);
        setVideoProgress(Number(savedProgress.progress) || 0);
      }

      const savedCompletion = JSON.parse(
        localStorage.getItem(scopedVideoStorageKey(HISTORY_ODD_COMPLETION_STORAGE)) || "{}",
      );
      if (savedCompletion?.token) {
        setVideoCompletionToken(savedCompletion.token);
        setVideoEntitlementDays(Number(savedCompletion.entitlementDays) || (authUser?.uid ? 14 : 7));
        setVideoProgress(1);
      }
    } catch {
      // Storage indisponível ou dado inválido: inicia uma nova sessão.
    }
  }, [videoIdentityKey]);

  const filteredRecords = useMemo(() => {
    const search = teamFilter.trim().toLowerCase();

    const filtered = records.filter((record) => {
      if (dateFilter && record.dateKey !== dateFilter) return false;
      if (
        periodFilter !== "all" &&
        record.period !== periodFilter.toUpperCase()
      )
        return false;
      if (marketFilter !== "all" && record.marketType !== marketFilter)
        return false;
      if (!search) return true;
      return [record.match, record.homeTeam, record.awayTeam, record.market]
        .join(" ")
        .toLowerCase()
        .includes(search);
    });

    return [...filtered].sort((a, b) => {
      const dateA = parseDate(a.date)?.getTime() || 0;
      const dateB = parseDate(b.date)?.getTime() || 0;

      if (sortOrder === "date") {
        if (dateA !== dateB) return dateB - dateA;
      } else if (sortOrder === "records") {
        // "Quant. Registros" representa a quantidade de odds reais existentes
        // na régua final, e não a quantidade de linhas/registros mesclados.
        const countA = (a.realPoints || []).length;
        const countB = (b.realPoints || []).length;
        if (countA !== countB) return countB - countA;
        if (dateA !== dateB) return dateB - dateA;
      } else {
        const averageA = getAveragePaid(a);
        const averageB = getAveragePaid(b);

        // Réguas sem nenhum percentual real ficam sempre no final.
        if (!Number.isFinite(averageA) && !Number.isFinite(averageB)) {
          if (dateA !== dateB) return dateB - dateA;
        } else if (!Number.isFinite(averageA)) {
          return 1;
        } else if (!Number.isFinite(averageB)) {
          return -1;
        } else if (averageA !== averageB) {
          return sortOrder === "highest"
            ? averageB - averageA
            : averageA - averageB;
        }
      }

      return `${a.match} ${a.market}`.localeCompare(`${b.match} ${b.market}`);
    });
  }, [dateFilter, marketFilter, periodFilter, records, sortOrder, teamFilter]);

  const toggleExpanded = (id) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const persistVideoProgress = (payload) => {
    try {
      localStorage.setItem(
        scopedVideoStorageKey(HISTORY_ODD_PROGRESS_STORAGE),
        JSON.stringify({
          token: payload.progressToken,
          allowedSeekTo: payload.allowedSeekTo,
          progress: payload.watchedRatio,
        }),
      );

      if (payload.completionToken) {
        localStorage.setItem(
          scopedVideoStorageKey(HISTORY_ODD_COMPLETION_STORAGE),
          JSON.stringify({
            token: payload.completionToken,
            entitlementDays: payload.entitlementDays,
          }),
        );
      }
    } catch {
      // O player continua funcional mesmo quando storage estiver bloqueado.
    }
  };

  const sendVideoCheckpoint = async ({ ended = false, force = false } = {}) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    if (checkpointInFlightRef.current) {
      if (ended) {
        window.setTimeout(
          () => sendVideoCheckpoint({ ended: true, force: true }),
          450,
        );
      }
      return;
    }

    const now = Date.now();
    if (!force && !ended && now - lastCheckpointRef.current < 3500) return;

    checkpointInFlightRef.current = true;
    setVideoValidationBusy(true);
    setVideoStatus("");

    try {
      const headers = { "Content-Type": "application/json" };
      if (authUser && typeof authUser.getIdToken === "function") {
        const idToken = await authUser.getIdToken();
        headers.Authorization = `Bearer ${idToken}`;
      }

      const response = await fetch("/api/historyodd-video-progress", {
        method: "POST",
        headers,
        body: JSON.stringify({
          currentTime: video.currentTime,
          duration: video.duration,
          ended,
          progressToken: videoProgressToken || undefined,
          playbackRate: videoPlaybackRate,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || `video-progress-${response.status}`);
      }

      videoValidationHealthyRef.current = true;
      lastCheckpointRef.current = now;
      setVideoProgressToken(payload.progressToken || "");
      setVideoAllowedSeekTo(Number(payload.allowedSeekTo) || 2);
      setVideoProgress(Math.max(0, Math.min(1, Number(payload.watchedRatio) || 0)));
      persistVideoProgress(payload);

      if (payload.completed && payload.completionToken) {
        setVideoCompletionToken(payload.completionToken);
        setVideoEntitlementDays(Number(payload.entitlementDays) || 7);
        setVideoProgress(1);
        setVideoStatus(t.videoComplete);
      }
    } catch (videoError) {
      videoValidationHealthyRef.current = false;
      console.error("[TraderTab] Falha ao validar vídeo do HistoryOdd", videoError);
      setVideoStatus(t.videoError);
    } finally {
      checkpointInFlightRef.current = false;
      setVideoValidationBusy(false);
    }
  };

  const handleVideoSeeking = () => {
    const video = videoRef.current;
    if (!video || videoCompletionToken) return;

    // Se a API de validação estiver indisponível, não force o currentTime
    // para trás. O Trial continua bloqueado, mas o vídeo segue reproduzindo
    // normalmente em vez de piscar/ficar preso em um trecho.
    if (!videoProgressToken || !videoValidationHealthyRef.current) return;

    if (video.currentTime > videoAllowedSeekTo + 0.75) {
      video.currentTime = Math.max(0, videoAllowedSeekTo - 0.25);
    }
  };

  const setHistoryOddPlaybackRate = (rate) => {
    const nextRate = Number(rate);
    if (![1, 1.25, 1.5, 2].includes(nextRate)) return;

    const video = videoRef.current;
    if (video) video.playbackRate = nextRate;
    setVideoPlaybackRate(nextRate);
  };

  const handleVideoRateChange = () => {
    const video = videoRef.current;
    if (!video) return;

    const nextRate = Number(video.playbackRate);
    if (![1, 1.25, 1.5, 2].includes(nextRate)) {
      video.playbackRate = videoPlaybackRate;
      return;
    }

    if (nextRate !== videoPlaybackRate) setVideoPlaybackRate(nextRate);
  };

  const isValidTrialEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

  const openGuestTrialModal = () => {
    setGuestTrialEmail("");
    setGuestTrialStatus("");
    setTrialModal("guest");
  };

  const requestHistoryOddTrial = async () => {
    if (!videoCompletionToken || trialBusy) return;

    if (!authUser || typeof authUser.getIdToken !== "function") {
      openGuestTrialModal();
      return;
    }

    setTrialBusy(true);
    setTrialMessage("");
    setTrialMessageType("");

    try {
      const idToken = await authUser.getIdToken(true);
      const response = await fetch("/api/generate-historyodd-trial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ videoCompletionToken }),
      });

      const payload = await response.json().catch(() => ({}));

      if (response.status === 409 || payload?.error === "trial-already-used") {
        setTrialMessage(t.trialAlreadyUsed);
        setTrialMessageType("warning");
        return;
      }

      if (!response.ok) {
        throw new Error(payload?.error || `trial-${response.status}`);
      }

      setTrialMessage("");
      setTrialMessageType("");
      setTrialModal("logged-success");
    } catch (trialError) {
      console.error("[TraderTab] Falha ao solicitar Trial do HistoryOdd", trialError);
      setTrialMessage(t.trialError);
      setTrialMessageType("error");
    } finally {
      setTrialBusy(false);
    }
  };

  const generateGuestHistoryOddTrial = async () => {
    const email = guestTrialEmail.trim().toLowerCase();
    if (!isValidTrialEmail(email)) {
      setGuestTrialStatus(t.guestInvalidEmail);
      return;
    }
    if (!videoCompletionToken || guestTrialBusy) return;

    setGuestTrialBusy(true);
    setGuestTrialStatus("");
    try {
      const response = await fetch("/api/generate-historyodd-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoCompletionToken,
          customerEmail: email,
        }),
      });
      const payload = await response.json().catch(() => ({}));

      if (response.status === 409 || payload?.error === "trial-already-used") {
        setGuestTrialStatus(t.trialAlreadyUsed);
        return;
      }
      if (!response.ok) {
        throw new Error(payload?.error || `trial-${response.status}`);
      }

      setTrialModal("");
      setGuestTrialStatus("");
      setTrialMessage(`${t.trialSuccess} 7 dias de acesso liberados para ${email}.`);
      setTrialMessageType("success");
    } catch (error) {
      console.error("[TraderTab] Falha ao gerar Trial de visitante", error);
      setGuestTrialStatus(t.trialError);
    } finally {
      setGuestTrialBusy(false);
    }
  };

  const clearFilters = () => {
    setDateFilter("");
    setTeamFilter("");
    setPeriodFilter("all");
    setMarketFilter("all");
    setSortOrder("date");
  };

  return (
    <main className="page odds-history-page">
      <section className="historyodd-sales-hero">
        <div className="historyodd-sales-glow historyodd-sales-glow-one" aria-hidden="true" />
        <div className="historyodd-sales-glow historyodd-sales-glow-two" aria-hidden="true" />

        <div className="historyodd-sales-intro">
          <span className="historyodd-sales-badge">
            <Sparkles size={15} />
            {t.salesBadge}
          </span>
          <div className="historyodd-top-links">
            <span className="historyodd-login-trial-notice">
              <LockKeyhole size={15} />
              {language === "en"
                ? "Sign in to TraderTab before watching the video to unlock the 14-day Trial."
                : language === "es"
                  ? "Inicia sesión en TraderTab antes de ver el video para liberar el Trial de 14 días."
                  : "Para ter acesso ao Trial de 14 dias, esteja logado no TraderTab antes de assistir ao vídeo."}
            </span>
            <a className="historyodd-instagram-link" href={HISTORY_ODD_INSTAGRAM_URL} target="_blank" rel="noreferrer">
              <Instagram size={16} />
              Instagram HistoryOdd
            </a>
          </div>
          <h1>
            <span>{t.salesTitleLead}</span>{" "}
            <strong>{t.salesTitleAccent}</strong>
          </h1>
          <p>{t.salesDescription}</p>

          <div className="historyodd-sales-proof">
            <span><CheckCircle2 size={16} /> Odds e percentual pago em tempo real</span>
            <span><CheckCircle2 size={16} /> Leitura visual do ritmo do mercado</span>
            <span><CheckCircle2 size={16} /> Histórico para comparar períodos</span>
          </div>
        </div>

        <div className="historyodd-video-shell">
          <div className="historyodd-video-heading">
            <div>
              <span className={`historyodd-trial-pill ${authUser ? "logged" : "guest"}`}>
                <Clock3 size={15} />
                {authUser ? t.loggedTrial : t.guestTrial}
              </span>
              <h2>{t.watchTitle}</h2>
              <p>{authUser ? t.watchDescriptionLogged : t.watchDescriptionGuest}</p>
            </div>
            <img src={historyOddIcon} alt="HistoryOdd" className="historyodd-sales-logo" />
          </div>

          <div className="historyodd-video-frame">
            <video
              ref={videoRef}
              controls
              playsInline
              preload="metadata"
              controlsList="nodownload noplaybackrate"
              disablePictureInPicture
              onTimeUpdate={() => sendVideoCheckpoint()}
              onPlay={() => sendVideoCheckpoint({ force: true })}
              onEnded={() => sendVideoCheckpoint({ ended: true, force: true })}
              onSeeking={handleVideoSeeking}
              onRateChange={handleVideoRateChange}
            >
              <source src={HISTORY_ODD_VIDEO_URL} type="video/mp4" />
            </video>
            <div className="historyodd-video-speed" aria-label="Velocidade do vídeo">
              <label htmlFor="historyodd-video-speed-select">Velocidade</label>
              <select
                id="historyodd-video-speed-select"
                value={videoPlaybackRate}
                onChange={(event) => setHistoryOddPlaybackRate(event.target.value)}
                aria-label="Selecionar velocidade do vídeo"
              >
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>
            {!videoProgressToken && videoValidationBusy ? (
              <div className="historyodd-video-overlay">
                <PlayCircle size={26} />
                {t.videoPreparing}
              </div>
            ) : null}
          </div>

          <div className="historyodd-video-progress">
            <div className="historyodd-progress-label">
              <span>{videoCompletionToken ? t.videoComplete : t.videoProgress}</span>
              <strong>{Math.round(videoProgress * 100)}%</strong>
            </div>
            <div className="historyodd-progress-track" aria-hidden="true">
              <span style={{ width: `${Math.round(videoProgress * 100)}%` }} />
            </div>
            <div className="historyodd-video-note">
              <LockKeyhole size={14} />
              <span>{t.mustWatchHere}</span>
            </div>
            {videoStatus ? <div className="historyodd-video-status">{videoStatus}</div> : null}
          </div>

          <div className="historyodd-sales-actions">
            <a
              className="historyodd-buy-button"
              href={HISTORY_ODD_PURCHASE_URL}
              target="_blank"
              rel="noreferrer"
            >
              <ShieldCheck size={18} />
              <span>
                <strong>{t.buyNow}</strong>
                <small>{t.buySubtext}</small>
              </span>
            </a>

            <button
              type="button"
              className={`historyodd-trial-cta ${videoCompletionToken ? "unlocked" : "locked"}`}
              onClick={requestHistoryOddTrial}
              disabled={!videoCompletionToken || trialBusy}
            >
              {videoCompletionToken ? <ShieldCheck size={18} /> : <LockKeyhole size={18} />}
              {trialBusy
                ? t.trialRequesting
                : !videoCompletionToken
                  ? t.trialLocked
                  : !authUser
                    ? t.trialUnlocked7
                    : (videoEntitlementDays || 7) === 14
                      ? t.trialUnlocked14
                      : t.trialUnlocked7}
            </button>

            <a className="historyodd-download-link" href={HISTORY_ODD_DOWNLOAD_URL}>
              <Download size={17} />
              {t.downloadApp}
            </a>
          </div>

          {trialMessage ? (
            <div className={`odds-history-trial-message ${trialMessageType}`} role="status">
              {trialMessage}
            </div>
          ) : null}
        </div>

        {trialModal ? (
          <div className="historyodd-trial-modal-backdrop" role="presentation">
            <div
              className="historyodd-trial-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="historyodd-trial-modal-title"
            >
              {trialModal === "logged-success" ? (
                <>
                  <div className="historyodd-trial-modal-icon success">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 id="historyodd-trial-modal-title">{t.loggedTrialModalTitle}</h3>
                  <p>{t.loggedTrialModalText}</p>
                  <div className="historyodd-trial-modal-email">
                    {authUser?.email || ""}
                  </div>
                  <button
                    type="button"
                    className="historyodd-trial-understood"
                    onClick={() => setTrialModal("")}
                  >
                    <CheckCircle2 size={17} />
                    {t.understood}
                  </button>
                </>
              ) : (
                <>
                  <div className="historyodd-trial-modal-icon guest">
                    <ShieldCheck size={28} />
                  </div>
                  <h3 id="historyodd-trial-modal-title">{t.guestTrialModalTitle}</h3>
                  <p>{t.guestTrialModalText}</p>

                  <div className="historyodd-trial-modal-form">
                    <label htmlFor="historyodd-trial-email">{t.guestEmailLabel}</label>
                    <input
                      id="historyodd-trial-email"
                      type="email"
                      value={guestTrialEmail}
                      placeholder={t.guestEmailPlaceholder}
                      autoComplete="email"
                      disabled={guestTrialBusy}
                      onChange={(event) => {
                        setGuestTrialEmail(event.target.value);
                        setGuestTrialStatus("");
                      }}
                    />

                    {guestTrialStatus ? (
                      <div className="historyodd-trial-modal-status">{guestTrialStatus}</div>
                    ) : null}

                    <button
                      type="button"
                      className="historyodd-trial-modal-primary"
                      disabled={guestTrialBusy || !isValidTrialEmail(guestTrialEmail)}
                      onClick={generateGuestHistoryOddTrial}
                    >
                      {guestTrialBusy ? t.guestGeneratingTrial : t.guestGenerateTrial}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : null}

        <div className="historyodd-feature-grid">
          <article>
            <span><Gauge size={20} /></span>
            <div>
              <strong>{t.featureRealtime}</strong>
              <p>{t.featureRealtimeText}</p>
            </div>
          </article>
          <article>
            <span><TrendingUp size={20} /></span>
            <div>
              <strong>{t.featureMovement}</strong>
              <p>{t.featureMovementText}</p>
            </div>
          </article>
          <article>
            <span><LineChart size={20} /></span>
            <div>
              <strong>{t.featureHistory}</strong>
              <p>{t.featureHistoryText}</p>
            </div>
          </article>
        </div>
      </section>

      {!authUser ? (
        <section className="historyodd-member-gate">
          <div className="historyodd-member-gate-icon"><LockKeyhole size={24} /></div>
          <div>
            <strong>{t.memberOnlyTitle}</strong>
            <p>{t.memberOnlyText}</p>
          </div>
          <button type="button" className="primary-button" onClick={() => onRequestLogin?.()}>
            {t.memberOnlyButton}
          </button>
        </section>
      ) : (
        <>
      <section className="odds-history-filters">
        <div className="odds-filter-group">
          <label htmlFor="odds-history-date">
            <CalendarDays size={16} />
            {t.date}
          </label>
          <input
            id="odds-history-date"
            type="date"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
          />
        </div>
        <div className="odds-filter-group">
          <label htmlFor="odds-history-team">
            <Search size={16} />
            {t.team}
          </label>
          <input
            id="odds-history-team"
            type="search"
            placeholder={t.teamPlaceholder}
            value={teamFilter}
            onChange={(event) => setTeamFilter(event.target.value)}
          />
        </div>
        <div className="odds-filter-group odds-filter-period">
          <label htmlFor="odds-history-period">
            <Filter size={16} />
            {t.period}
          </label>
          <select
            id="odds-history-period"
            value={periodFilter}
            onChange={(event) => setPeriodFilter(event.target.value)}
          >
            <option value="all">{t.all}</option>
            <option value="HT">{t.ht}</option>
            <option value="FT">{t.ft}</option>
          </select>
        </div>
        <div className="odds-filter-group odds-filter-market">
          <label htmlFor="odds-history-market">
            <TrendingUp size={16} />
            {t.marketFilter}
          </label>
          <select
            id="odds-history-market"
            value={marketFilter}
            onChange={(event) => setMarketFilter(event.target.value)}
          >
            <option value="all">{t.all}</option>
            <option value="matchOdds">{t.matchOdds}</option>
            <option value="goals">{t.goals}</option>
          </select>
        </div>
        <div className="odds-filter-group odds-filter-average">
          <label htmlFor="odds-history-order">
            <ArrowUpDown size={16} />
            {t.ordering}
          </label>
          <select
            id="odds-history-order"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          >
            <option value="date">{t.orderDate}</option>
            <option value="records">{t.orderRecords}</option>
            <option value="highest">{t.highestAverage}</option>
            <option value="lowest">{t.lowestAverage}</option>
          </select>
        </div>
        <div className="odds-filter-actions">
          <button type="button" className="ghost-button" onClick={clearFilters}>
            {t.clear}
          </button>
          <button type="button" className="primary-button" onClick={loadData}>
            <RefreshCw size={16} />
            {t.refresh}
          </button>
        </div>
      </section>

      <section className="odds-history-results-head">
        <strong>
          {filteredRecords.length} {t.cardsFound}
        </strong>
      </section>

      {loading ? (
        <section className="odds-history-state-card">{t.loading}</section>
      ) : error ? (
        <section className="odds-history-state-card odds-history-error">
          {t.loadError}
          <small>{error}</small>
        </section>
      ) : filteredRecords.length === 0 ? (
        <section className="odds-history-state-card">
          <strong>{t.noResultsTitle}</strong>
          <p>{t.noResultsText}</p>
        </section>
      ) : (
        <section className="odds-history-grid">
          {filteredRecords.map((record) => {
            const isExpanded = expandedIds.has(record.id);
            const averagePaid = getAveragePaid(record);

            return (
              <article
                key={record.id}
                className={`odds-history-card ${isExpanded ? "expanded" : ""}`}
              >
                <button
                  type="button"
                  className="odds-history-card-head"
                  onClick={() => toggleExpanded(record.id)}
                  aria-expanded={isExpanded}
                >
                  <div className="odds-history-card-main">
                    <div className="odds-history-card-title-row">
                      <h2>{record.match}</h2>
                      <span className="odds-market-chip">
                        {marketLabel(record, t)}
                      </span>
                      <span
                        className={`odds-period-chip ${record.period === "HT" ? "ht" : "ft"}`}
                      >
                        {record.period}
                      </span>
                      {Number.isFinite(averagePaid) && (
                        <span
                          className="odds-average-chip"
                          title={`${t.averagePaid}: ${paidText(averagePaid)}`}
                        >
                          {t.averagePaid}: {paidText(averagePaid)}
                        </span>
                      )}
                    </div>
                    <div className="odds-history-card-meta">
                      <span>{formatDate(record.date, language)}</span>
                    </div>
                  </div>
                  <span
                    className={`odds-history-expand ${isExpanded ? "open" : ""}`}
                  >
                    <span>{isExpanded ? t.collapse : t.expand}</span>
                    <ChevronDown size={18} />
                  </span>
                </button>

                {isExpanded && (
                  <div className="odds-history-card-body">
                    <div
                      className="odds-regua-track"
                      role="list"
                      aria-label={`${record.match} ${record.market}`}
                    >
                      {record.points.map((point, index) => (
                        <div
                          key={point.id}
                          className={`odds-regua-point ${Number.isFinite(point.odd) ? "filled" : "empty"}`}
                          role="listitem"
                        >
                          {index > 0 && (
                            <span
                              className="odds-regua-paid-between"
                              aria-hidden="true"
                            >
                              {paidText(point.paid)}
                            </span>
                          )}
                          <span className="odds-regua-minute">
                            {point.displayMinute}
                          </span>
                          <strong className="odds-regua-odd">
                            {Number.isFinite(point.odd)
                              ? oddText(point.odd)
                              : "--"}
                          </strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}
        </>
      )}
    </main>
  );
}
