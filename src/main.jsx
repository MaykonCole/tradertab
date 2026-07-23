import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  ChevronsUpDown,
  ChevronDown,
  Clock3,
  Filter,
  Globe2,
  GripVertical,
  LayoutGrid,
  LockKeyhole,
  LogIn,
  LogOut,
  Moon,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sun,
  TrendingUp,
  Trophy,
  UserRound,
  X,
} from "lucide-react";
import AuthModal from "./AuthModal";
import CookieConsent from "./CookieConsent";
import PrivacyPolicy from "./PrivacyPolicy";
import {
  loadColumnOrder,
  logout,
  observeAuth,
  saveColumnOrder,
} from "./firebase";
import "./styles.css";

const languageOptions = [
  { key: "pt", label: "Português", short: "PT", flag: "🇧🇷" },
  { key: "en", label: "English", short: "EN", flag: "🇺🇸" },
  { key: "es", label: "Español", short: "ES", flag: "🇪🇸" },
];

const translations = {
  pt: {
    brandTag: "Leitura profissional pré-jogo",
    pageTitle: "TraderTab Match Center",
    subtitle:
      "Visual limpo com navegação por abas, filtros rápidos e lista de jogos pronta para análise.",
    search: "Buscar time, campeonato ou país",
    theme: "Alternar tema",
    language: "Idioma",
    filters: "Filtros",
    clear: "Limpar filtros",
    date: "Data",
    timeRange: "Horário",
    raceFilter: "Race",
    yes: "Sim",
    no: "Não",
    dawn: "Madrugada",
    morning: "Manhã",
    afternoon: "Tarde",
    night: "Noite",
    competitionType: "Tipo de jogo",
    gender: "Gênero",
    male: "Masculino",
    female: "Feminino",
    classification: "Classificação",
    country: "País",
    homePosition: "Posição Casa",
    awayPosition: "Posição Fora",
    homeForm: "Forma Casa",
    awayForm: "Forma Fora",
    positionPlaceholder: "Ex.: 2",
    maxHomeOdd: "Odd Casa máxima",
    maxAwayOdd: "Odd Fora máxima",
    minOver25Odd: "Odd 2.5 Over mínima",
    minUnder25Odd: "Odd 2.5 Under mínima",
    over25: "Odd 2.5 Over",
    under25: "Odd 2.5 Under",
    maxOddPlaceholder: "Ex.: 1.30",
    all: "Todos",
    balanced: "Parelho",
    homeFavorite: "Favorito casa",
    awayFavorite: "Favorito fora",
    strongFavorite: "Super Favorito",
    league: "Liga",
    cup: "Copa",
    international: "Internacional",
    gamesFound: "jogos encontrados",
    updated: "Atualizado agora",
    matches: "Jogos",
    leagues: "Ligas",
    avgOdd: "Odd média favorita",
    countries: "Países",
    coverage: "Cobertura válida",
    home: "Casa",
    draw: "Empate",
    away: "Fora",
    noGamesTitle: "Nenhum jogo encontrado",
    noGamesText: "Ajuste os filtros ou faça uma nova busca.",
    sort: "Ordenar",
    timeAsc: "Horário crescente",
    bestOpportunity: "Melhor oportunidade",
    lowestOdd: "Menor odd favorita",
    dateLabel: "Datas",
    footer:
      "TraderTab organiza dados pré-jogo em uma experiência clara, profissional e intuitiva.",
    responsibleWarning:
      "18+ Ministério da Fazenda adverte: Aposta não é investimento.",
    privacyPolicy: "Política de Privacidade",
    cookiePreferences: "Preferências de cookies",
    privacyContact: "Contato de privacidade",
    validOnly: "Somente jogos futuros com horário válido",
    confidence: "Confiança",
    high: "Alta",
    medium: "Média",
    low: "Baixa",
    loading: "Carregando jogos do servidor...",
    loadError: "Não foi possível carregar os jogos.",
    serverUnavailable:
      "O servidor está temporariamente indisponível. Tente novamente em instantes.",
    serverInvalidResponse:
      "O servidor retornou uma resposta inválida. Tente novamente.",
    connectionError:
      "Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.",
    retry: "Tentar novamente",
    refresh: "Atualizar dados",
    lastUpdate: "Última atualização",
    sheetSource: "Origem Google Sheets",
    listTitle: "Listagem de jogos",
    time: "Horário",
    match: "Partida",
    competition: "Campeonato",
    overview: "Visão geral",
    quickFilters: "Filtros rápidos",
    results: "Resultados",
    dataTab: "Aba principal",
    login: "Entrar",
    account: "Minha conta",
    logout: "Sair",
    memberAccess: "Recursos para membros",
    lockedTitle: "Entre para liberar as ferramentas de análise",
    lockedText:
      "Filtros, Race e personalização das colunas ficam disponíveis gratuitamente após o login.",
    unlock: "Entrar gratuitamente",
    completeProfile: "Completar cadastro",
    profileRequiredTitle: "Complete seu cadastro para liberar os recursos",
    profileRequiredText:
      "Data de nascimento e país são obrigatórios. O clube do coração é opcional.",
    dragLocked: "Entre para reorganizar as colunas",
    copyright: "© 2026 TraderTab. Todos os direitos reservados.",
  },
  en: {
    brandTag: "Professional pre-match view",
    pageTitle: "TraderTab Match Center",
    subtitle:
      "Clean layout with tab navigation, fast filters and a match list ready for analysis.",
    search: "Search team, competition or country",
    theme: "Toggle theme",
    language: "Language",
    filters: "Filters",
    clear: "Clear filters",
    date: "Date",
    timeRange: "Time range",
    raceFilter: "Race",
    yes: "Yes",
    no: "No",
    dawn: "Dawn",
    morning: "Morning",
    afternoon: "Afternoon",
    night: "Night",
    competitionType: "Game type",
    gender: "Gender",
    male: "Male",
    female: "Female",
    classification: "Classification",
    country: "Country",
    homePosition: "Home position",
    awayPosition: "Away position",
    homeForm: "Home form",
    awayForm: "Away form",
    positionPlaceholder: "E.g. 2",
    maxHomeOdd: "Max home odd",
    maxAwayOdd: "Max away odd",
    minOver25Odd: "Min 2.5 Over odd",
    minUnder25Odd: "Min 2.5 Under odd",
    over25: "2.5 Over odd",
    under25: "2.5 Under odd",
    maxOddPlaceholder: "E.g. 1.30",
    all: "All",
    balanced: "Balanced",
    homeFavorite: "Home favorite",
    awayFavorite: "Away favorite",
    strongFavorite: "Super Favorite",
    league: "League",
    cup: "Cup",
    international: "International",
    gamesFound: "matches found",
    updated: "Updated now",
    matches: "Matches",
    leagues: "Leagues",
    avgOdd: "Average favorite odd",
    countries: "Countries",
    coverage: "Valid coverage",
    home: "Home",
    draw: "Draw",
    away: "Away",
    noGamesTitle: "No matches found",
    noGamesText: "Adjust the filters or run another search.",
    sort: "Sort",
    timeAsc: "Earliest first",
    bestOpportunity: "Best opportunity",
    lowestOdd: "Lowest favorite odd",
    dateLabel: "Dates",
    footer:
      "TraderTab organizes pre-match data in a clear, professional and intuitive experience.",
    privacyPolicy: "Privacy Policy",
    cookiePreferences: "Cookie preferences",
    privacyContact: "Privacy contact",
    validOnly: "Future matches with a valid time only",
    confidence: "Confidence",
    high: "High",
    medium: "Medium",
    low: "Low",
    loading: "Loading matches from the server...",
    loadError: "The matches could not be loaded.",
    serverUnavailable:
      "The server is temporarily unavailable. Please try again shortly.",
    serverInvalidResponse:
      "The server returned an invalid response. Please try again.",
    connectionError:
      "Unable to connect to the server. Check your internet connection and try again.",
    retry: "Try again",
    refresh: "Refresh data",
    lastUpdate: "Last update",
    sheetSource: "Google Sheets source",
    listTitle: "Match list",
    time: "Time",
    match: "Match",
    competition: "Competition",
    overview: "Overview",
    quickFilters: "Quick filters",
    results: "Results",
    dataTab: "Main tab",
    login: "Sign in",
    account: "My account",
    logout: "Sign out",
    memberAccess: "Member features",
    lockedTitle: "Sign in to unlock analysis tools",
    lockedText:
      "Filters, Race and column customization are available for free after signing in.",
    unlock: "Sign in for free",
    completeProfile: "Complete registration",
    profileRequiredTitle: "Complete registration to unlock features",
    profileRequiredText:
      "Date of birth and country are required. Favorite club is optional.",
    dragLocked: "Sign in to reorder columns",
    copyright: "© 2026 TraderTab. All rights reserved.",
  },
  es: {
    brandTag: "Vista profesional prepartido",
    pageTitle: "TraderTab Match Center",
    subtitle:
      "Diseño limpio con navegación por pestañas, filtros rápidos y una lista de partidos lista para analizar.",
    search: "Buscar equipo, competición o país",
    theme: "Cambiar tema",
    language: "Idioma",
    filters: "Filtros",
    clear: "Limpiar filtros",
    date: "Fecha",
    timeRange: "Horario",
    raceFilter: "Race",
    yes: "Sí",
    no: "No",
    dawn: "Madrugada",
    morning: "Mañana",
    afternoon: "Tarde",
    night: "Noche",
    competitionType: "Tipo de partido",
    gender: "Género",
    male: "Masculino",
    female: "Femenino",
    classification: "Clasificación",
    country: "País",
    homePosition: "Posición local",
    awayPosition: "Posición visitante",
    homeForm: "Forma local",
    awayForm: "Forma visitante",
    positionPlaceholder: "Ej.: 2",
    maxHomeOdd: "Cuota local máxima",
    maxAwayOdd: "Cuota visitante máxima",
    minOver25Odd: "Cuota mínima Over 2.5",
    minUnder25Odd: "Cuota mínima Under 2.5",
    over25: "Cuota Over 2.5",
    under25: "Cuota Under 2.5",
    maxOddPlaceholder: "Ej.: 1.30",
    all: "Todos",
    balanced: "Equilibrado",
    homeFavorite: "Favorito local",
    awayFavorite: "Favorito visitante",
    strongFavorite: "Súper Favorito",
    league: "Liga",
    cup: "Copa",
    international: "Internacional",
    gamesFound: "partidos encontrados",
    updated: "Actualizado ahora",
    matches: "Partidos",
    leagues: "Ligas",
    avgOdd: "Cuota media favorita",
    countries: "Países",
    coverage: "Cobertura válida",
    home: "Local",
    draw: "Empate",
    away: "Visitante",
    noGamesTitle: "No se encontraron partidos",
    noGamesText: "Ajusta los filtros o realiza otra búsqueda.",
    sort: "Ordenar",
    timeAsc: "Horario ascendente",
    bestOpportunity: "Mejor oportunidad",
    lowestOdd: "Menor cuota favorita",
    dateLabel: "Fechas",
    footer:
      "TraderTab organiza datos prepartido en una experiencia clara, profesional e intuitiva.",
    privacyPolicy: "Política de Privacidad",
    cookiePreferences: "Preferencias de cookies",
    privacyContact: "Contacto de privacidad",
    validOnly: "Solo partidos futuros con horario válido",
    confidence: "Confianza",
    high: "Alta",
    medium: "Media",
    low: "Baja",
    loading: "Cargando partidos desde la servidor...",
    loadError: "No fue posible cargar los partidos.",
    serverUnavailable:
      "El servidor no está disponible temporalmente. Inténtalo de nuevo en unos instantes.",
    serverInvalidResponse:
      "El servidor devolvió una respuesta no válida. Inténtalo de nuevo.",
    connectionError:
      "No fue posible conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.",
    retry: "Intentar de nuevo",
    refresh: "Actualizar datos",
    lastUpdate: "Última actualización",
    sheetSource: "Origen Google Sheets",
    listTitle: "Lista de partidos",
    time: "Horario",
    match: "Partido",
    competition: "Competición",
    overview: "Visión general",
    quickFilters: "Filtros rápidos",
    results: "Resultados",
    dataTab: "Pestaña principal",
    login: "Entrar",
    account: "Mi cuenta",
    logout: "Salir",
    memberAccess: "Funciones para miembros",
    lockedTitle: "Entra para desbloquear las herramientas de análisis",
    lockedText:
      "Filtros, Race y personalización de columnas están disponibles gratis al iniciar sesión.",
    unlock: "Entrar gratis",
    completeProfile: "Completar registro",
    profileRequiredTitle: "Completa el registro para habilitar las funciones",
    profileRequiredText:
      "La fecha de nacimiento y el país son obligatorios. El club es opcional.",
    dragLocked: "Entra para reorganizar las columnas",
    copyright: "© 2026 TraderTab. Todos los derechos reservados.",
  },
};

const GOOGLE_SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbwGZfPNcAoyuIzDS2YxlC8_axKQ39sYjXOf9F2J7ALXwVtdCx5d8ByRfypKeNJ1srLX/exec";

const countryFlags = {
  Brasil: "🇧🇷",
  Brazil: "🇧🇷",
  Inglaterra: "🇬🇧",
  England: "🇬🇧",
  Espanha: "🇪🇸",
  Spain: "🇪🇸",
  Argentina: "🇦🇷",
  Itália: "🇮🇹",
  Italy: "🇮🇹",
  França: "🇫🇷",
  France: "🇫🇷",
  Alemanha: "🇩🇪",
  Germany: "🇩🇪",
  Portugal: "🇵🇹",
  Holanda: "🇳🇱",
  Netherlands: "🇳🇱",
  Bélgica: "🇧🇪",
  Belgium: "🇧🇪",
  Europa: "🇪🇺",
  Europe: "🇪🇺",
};

const getField = (row, ...keys) => {
  for (const key of keys) {
    const value = row?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== "")
      return value;
  }
  return "";
};

const parseOdd = (value) => {
  const parsed = Number(
    String(value ?? "")
      .replace(",", ".")
      .trim(),
  );
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseDate = (value) => {
  const text = String(value ?? "").trim();
  if (!text) return null;
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  const br = text.match(/^(\d{2})[\/-](\d{2})[\/-](\d{4})/);
  if (br) return new Date(Number(br[3]), Number(br[2]) - 1, Number(br[1]));
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime())
    ? null
    : new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
};

const getDayKey = (dateValue) => {
  const date = parseDate(dateValue);
  if (!date) return "other";
  const today = new Date();
  const base = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const difference = Math.round((date.getTime() - base.getTime()) / 86400000);
  return difference === 0
    ? "today"
    : difference === 1
      ? "tomorrow"
      : difference === 2
        ? "dayAfter"
        : difference === 3
          ? "dayPlus3"
          : "other";
};

const parseTimeMinutes = (value) => {
  const match = String(value ?? "").trim().match(/^(\d{2}):(\d{2})$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
};

const getTimePeriod = (value) => {
  const minutes = parseTimeMinutes(value);
  if (minutes === null) return "other";
  if (minutes < 360) return "dawn";
  if (minutes < 720) return "morning";
  if (minutes < 1080) return "afternoon";
  return "night";
};

const getTimeToneClass = (value) => {
  const period = getTimePeriod(value);
  return period === "dawn"
    ? "time-dawn"
    : period === "morning"
      ? "time-morning"
      : period === "afternoon"
        ? "time-afternoon"
        : "time-night";
};

const normalizeClassification = (value, homeOdd, awayOdd) => {
  // Se nenhum dos dois times tem odd abaixo de 2.00, o confronto é considerado parelho.
  if (homeOdd >= 2 && awayOdd >= 2) return "balanced";

  const text = String(value ?? "")
    .trim()
    .toLowerCase();
  if (
    text.includes("equilibr") ||
    text.includes("balanced") ||
    text.includes("parelho")
  )
    return "balanced";
  if (text.includes("fora") || text.includes("visit") || text.includes("away"))
    return "awayFavorite";
  if (
    text.includes("forte") ||
    text.includes("strong") ||
    text.includes("super")
  )
    return "strongFavorite";
  if (text.includes("casa") || text.includes("local") || text.includes("home"))
    return "homeFavorite";
  const favorite = Math.min(homeOdd || 99, awayOdd || 99);
  if (favorite <= 1.3) return "strongFavorite";
  return homeOdd < awayOdd ? "homeFavorite" : "awayFavorite";
};

const normalizeType = (competition) => {
  const text = String(competition ?? "")
    .trim()
    .toLowerCase();
  return /copa|cup|qualifica|qualification|clasificaci/.test(text)
    ? "cup"
    : "league";
};

const normalizeGender = (competition, home, away) => {
  const text = `${competition ?? ""} ${home ?? ""} ${away ?? ""}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  return /\bwomen\b|\bwoman\b|\bfeminino\b|\bfeminina\b|\bfemenino\b|\bfemenina\b|\bfem\b|\bw\b/.test(
    text,
  )
    ? "female"
    : "male";
};

const getOddTone = (odd) => {
  if (!odd || !Number.isFinite(odd)) return "odd-empty";
  if (odd <= 1.3) return "odd-blue-dark";
  if (odd < 2) return "odd-blue-light";
  if (odd <= 4) return "odd-yellow-light";
  if (odd <= 10) return "odd-red-light";
  return "odd-red-dark";
};

const getGoalsOddTone = (odd, market) => {
  if (!odd || !Number.isFinite(odd)) return "odd-empty";
  const prefix = market === "under" ? "under" : "over";
  if (odd <= 1.8) return `odd-${prefix}-light`;
  if (odd <= 2.1) return "odd-goals-neutral";
  return `odd-${prefix}-dark`;
};

const parsePosition = (value) => {
  const text = String(value ?? "").trim();
  if (!text) return null;
  const match = text.match(/\d+/);
  if (!match) return null;
  const parsed = Number(match[0]);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const normalizeForm = (value) => {
  const source = Array.isArray(value)
    ? value
    : String(value ?? "")
        .trim()
        .replace(/[\[\]"']/g, "")
        .split(/[\s,;|/\-]+/);

  return source
    .map((item) => String(item).trim().toUpperCase())
    .map((item) => {
      if (["V", "W", "WIN", "VITÓRIA", "VITORIA"].includes(item)) return "V";
      if (["E", "X", "DRA", "DRAW", "EMPATE"].includes(item)) return "E";
      if (["D", "L", "LOSS", "DERROTA"].includes(item)) return "D";
      return "";
    })
    .filter(Boolean)
    .slice(0, 8);
};

function FormRace({ results }) {
  if (!results?.length) return null;
  return (
    <span className="form-race" aria-label={results.join(" ")}>
      {results.map((result, index) => (
        <span key={`${result}-${index}`} className={`form-result form-${result.toLowerCase()}`}>
          {result}
        </span>
      ))}
    </span>
  );
}

function PositionBadge({ position }) {
  if (!position) return null;
  return <span className="position-badge">{position}º</span>;
}

const normalizeGame = (row, index) => {
  const homeOdd = parseOdd(getField(row, "Odd Casa", "homeOdd", "HomeOdd"));
  const drawOdd = parseOdd(getField(row, "Odd Empate", "drawOdd", "DrawOdd"));
  const awayOdd = parseOdd(getField(row, "Odd Fora", "awayOdd", "AwayOdd"));
  const over25Odd = parseOdd(
    getField(row, "Odd Over 2.5", "Odd 2.5 Over", "over25Odd", "Over25Odd"),
  );
  const under25Odd = parseOdd(
    getField(row, "Odd Under 2.5", "Odd 2.5 Under", "under25Odd", "Under25Odd"),
  );
  const country =
    String(getField(row, "País", "Pais", "country", "Country")).trim() || "—";
  const competition =
    String(
      getField(row, "Campeonato", "competition", "league", "Competition"),
    ).trim() || "—";
  const home = String(getField(row, "Casa", "homeTeam", "home", "Home")).trim();
  const away = String(getField(row, "Fora", "awayTeam", "away", "Away")).trim();
  const date = String(getField(row, "Data", "date", "Date")).trim();
  return {
    id: String(getField(row, "ID", "id", "externalId") || `sheet-${index}`),
    date,
    day: getDayKey(date),
    time: String(getField(row, "Horário", "Horario", "time", "Time")).trim(),
    timePeriod: getTimePeriod(getField(row, "Horário", "Horario", "time", "Time")),
    country,
    flag: countryFlags[country] || "🌐",
    competition,
    type: normalizeType(competition),
    gender: normalizeGender(competition, home, away),
    home,
    away,
    homePosition: parsePosition(
      getField(row, "Posição Casa", "Posicao Casa", "homePosition", "HomePosition"),
    ),
    awayPosition: parsePosition(
      getField(row, "Posição Fora", "Posicao Fora", "awayPosition", "AwayPosition"),
    ),
    homeForm: normalizeForm(
      getField(row, "Forma Casa", "Race Casa", "homeForm", "HomeForm"),
    ),
    awayForm: normalizeForm(
      getField(row, "Forma Fora", "Race Fora", "awayForm", "AwayForm"),
    ),
    homeOdd,
    drawOdd,
    awayOdd,
    over25Odd,
    under25Odd,
    classification: normalizeClassification(
      getField(row, "Classificação", "Classificacao", "classification"),
      homeOdd,
      awayOdd,
    ),
    score: Math.round(
      Math.max(
        65,
        Math.min(96, 105 - Math.min(homeOdd || 4, awayOdd || 4) * 10),
      ),
    ),
  };
};

const classTone = {
  balanced: "neutral",
  homeFavorite: "positive",
  awayFavorite: "info",
  strongFavorite: "accent",
};

function Logo() {
  return (
    <div className="brand">
      <div className="brand-mark">TT</div>
      <div>
        <strong>TraderTab</strong>
      </div>
    </div>
  );
}

function Segmented({ value, onChange, options, ariaLabel }) {
  return (
    <div className="segmented" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={value === option.value ? "active" : ""}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

const localeByLanguage = {
  pt: "pt-BR",
  en: "en-US",
  es: "es-ES",
};

const formatGameDate = (value, language) => {
  const date = parseDate(value);
  if (!date) return String(value || "");

  return new Intl.DateTimeFormat(localeByLanguage[language] || "pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(date)
    .replaceAll("/", "-");
};

const DEFAULT_COLUMN_ORDER = [
  "time",
  "competition",
  "home",
  "homePosition",
  "homeOdd",
  "drawOdd",
  "awayOdd",
  "away",
  "awayPosition",
  "classification",
  "over25Odd",
  "under25Odd",
];

const COLUMN_ORDER_STORAGE_KEY = "tradertab-column-order-v3";

function isValidColumnOrder(saved) {
  return (
    Array.isArray(saved) &&
    saved.length === DEFAULT_COLUMN_ORDER.length &&
    DEFAULT_COLUMN_ORDER.every((key) => saved.includes(key))
  );
}

function getSavedColumnOrder(userId) {
  if (!userId) return DEFAULT_COLUMN_ORDER;
  try {
    const saved = JSON.parse(
      localStorage.getItem(`${COLUMN_ORDER_STORAGE_KEY}-${userId}`),
    );
    if (isValidColumnOrder(saved)) return saved;
  } catch {
    // Ignora preferências antigas ou inválidas.
  }

  return DEFAULT_COLUMN_ORDER;
}

function SortableHeader({
  sortKey,
  label,
  sortConfig,
  onSort,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
  canReorder,
  dragLockedText,
}) {
  const active = sortConfig.key === sortKey;
  const Icon = active
    ? sortConfig.direction === "asc"
      ? ArrowUp
      : ArrowDown
    : ChevronsUpDown;

  return (
    <th
      aria-sort={
        active
          ? sortConfig.direction === "asc"
            ? "ascending"
            : "descending"
          : "none"
      }
      className={`column-${sortKey} ${isDragging ? "column-dragging" : ""}`}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="column-header-content">
        {canReorder ? (
          <span
            className="column-drag-handle"
            draggable
            onDragStart={onDragStart}
            title="Arraste para reorganizar a coluna"
            aria-label={`Reorganizar coluna ${label}`}
          >
            <GripVertical size={14} strokeWidth={2.2} />
          </span>
        ) : (
          <span className="column-drag-locked" title={dragLockedText}>
            <LockKeyhole size={12} strokeWidth={2.2} />
          </span>
        )}
        <button
          type="button"
          className={`sortable-header ${active ? "active" : ""}`}
          onClick={() => onSort(sortKey)}
        >
          <span>{label}</span>
          <Icon size={14} strokeWidth={2.2} />
        </button>
      </div>
    </th>
  );
}

function MatchTable({
  games,
  t,
  lang,
  sortConfig,
  onSort,
  userId,
  showRace,
}) {
  const [columnOrder, setColumnOrder] = useState(() =>
    getSavedColumnOrder(userId),
  );
  const [draggedColumn, setDraggedColumn] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const localOrder = getSavedColumnOrder(userId);
    setColumnOrder(localOrder);

    if (userId) {
      loadColumnOrder(userId)
        .then((remoteOrder) => {
          if (!cancelled && isValidColumnOrder(remoteOrder)) {
            setColumnOrder(remoteOrder);
            localStorage.setItem(
              `${COLUMN_ORDER_STORAGE_KEY}-${userId}`,
              JSON.stringify(remoteOrder),
            );
          }
        })
        .catch(() => {
          // Mantém a preferência local caso a sincronização esteja indisponível.
        });
    }

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const columns = {
    time: {
      label: t.time,
      render: (game) => (
        <div className="table-time-block">
          <span className={`table-time ${getTimeToneClass(game.time)}`}>
            <Clock3 size={14} />
            {game.time}
          </span>
          <small>{formatGameDate(game.date, lang)}</small>
        </div>
      ),
    },
    country: {
      label: t.country,
      render: (game) => <span className="table-country">{game.country}</span>,
    },
    competition: {
      label: t.competition,
      render: (game) => (
        <div className="table-competition">
          <strong>{game.competition}</strong>
          <small>{game.country}</small>
        </div>
      ),
    },
    home: {
      label: t.home,
      render: (game) => (
        <div className="team-cell home-team">
          <strong>{game.home}</strong>
          {showRace && <FormRace results={game.homeForm} />}
        </div>
      ),
    },
    homePosition: {
      label: t.homePosition,
      render: (game) => <PositionBadge position={game.homePosition} />,
    },
    homeOdd: {
      label: `${t.home} Odd`,
      render: (game) => (
        <span className={`odd-cell ${getOddTone(game.homeOdd)}`}>
          {game.homeOdd ? game.homeOdd.toFixed(2) : "—"}
        </span>
      ),
    },
    drawOdd: {
      label: t.draw,
      render: (game) => (
        <span className={`odd-cell ${getOddTone(game.drawOdd)}`}>
          {game.drawOdd ? game.drawOdd.toFixed(2) : "—"}
        </span>
      ),
    },
    awayOdd: {
      label: `${t.away} Odd`,
      render: (game) => (
        <span className={`odd-cell ${getOddTone(game.awayOdd)}`}>
          {game.awayOdd ? game.awayOdd.toFixed(2) : "—"}
        </span>
      ),
    },
    away: {
      label: t.away,
      render: (game) => (
        <div className="team-cell away-team">
          <strong>{game.away}</strong>
          {showRace && <FormRace results={game.awayForm} />}
        </div>
      ),
    },
    awayPosition: {
      label: t.awayPosition,
      render: (game) => <PositionBadge position={game.awayPosition} />,
    },
    classification: {
      label: t.classification,
      render: (game) => (
        <span className={`classification ${classTone[game.classification]}`}>
          {t[game.classification]}
        </span>
      ),
    },
    over25Odd: {
      label: t.over25,
      render: (game) => (
        <span className={`odd-cell ${getGoalsOddTone(game.over25Odd, "over")}`}>
          {game.over25Odd ? game.over25Odd.toFixed(2) : "—"}
        </span>
      ),
    },
    under25Odd: {
      label: t.under25,
      render: (game) => (
        <span
          className={`odd-cell ${getGoalsOddTone(game.under25Odd, "under")}`}
        >
          {game.under25Odd ? game.under25Odd.toFixed(2) : "—"}
        </span>
      ),
    },
  };

  const moveColumn = (targetColumn) => {
    if (!userId || !draggedColumn || draggedColumn === targetColumn) return;

    setColumnOrder((currentOrder) => {
      const nextOrder = [...currentOrder];
      const sourceIndex = nextOrder.indexOf(draggedColumn);
      const targetIndex = nextOrder.indexOf(targetColumn);
      nextOrder.splice(sourceIndex, 1);
      nextOrder.splice(targetIndex, 0, draggedColumn);
      localStorage.setItem(
        `${COLUMN_ORDER_STORAGE_KEY}-${userId}`,
        JSON.stringify(nextOrder),
      );
      saveColumnOrder(userId, nextOrder).catch(() => {
        // A cópia local continua válida e será sincronizada no próximo ajuste.
      });
      return nextOrder;
    });

    setDraggedColumn(null);
  };

  return (
    <div className="table-shell">
      <table className="games-table">
        <thead>
          <tr>
            {columnOrder.map((columnKey) => (
              <SortableHeader
                key={columnKey}
                sortKey={columnKey}
                label={columns[columnKey].label}
                sortConfig={sortConfig}
                onSort={onSort}
                isDragging={draggedColumn === columnKey}
                canReorder={Boolean(userId)}
                dragLockedText={t.dragLocked}
                onDragStart={(event) => {
                  if (!userId) return;
                  setDraggedColumn(columnKey);
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", columnKey);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  moveColumn(columnKey);
                }}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game.id}>
              {columnOrder.map((columnKey) => (
                <td key={columnKey} className={`column-${columnKey}`}>
                  {columns[columnKey].render(game)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MobileList({ games, t, lang, showRace }) {
  return (
    <div className="mobile-cards">
      {games.map((game) => (
        <article key={game.id} className="mobile-game-card">
          <div className="mobile-game-top">
            <span className={`table-time ${getTimeToneClass(game.time)}`}>
              <Clock3 size={15} />
              {game.time}
            </span>
            <span
              className={`classification ${classTone[game.classification]}`}
            >
              {t[game.classification]}
            </span>
          </div>

          <div className="mobile-meta">
            <span>{game.competition}</span>
            <span>{formatGameDate(game.date, lang)}</span>
          </div>

          <div className="mobile-teams">
            <div className="mobile-team-row">
              <span className="mobile-team-label">{t.home}</span>
              <strong>{game.home}</strong>
              <span className="mobile-team-details">
                <PositionBadge position={game.homePosition} />
                {showRace && <FormRace results={game.homeForm} />}
              </span>
            </div>
            <div className="mobile-team-row away-row">
              <span className="mobile-team-label">{t.away}</span>
              <strong>{game.away}</strong>
              <span className="mobile-team-details">
                <PositionBadge position={game.awayPosition} />
                {showRace && <FormRace results={game.awayForm} />}
              </span>
            </div>
          </div>

          <div className="mobile-odds-grid">
            <div>
              <span>{t.home}</span>
              <strong className={`odd-cell ${getOddTone(game.homeOdd)}`}>
                {game.homeOdd ? game.homeOdd.toFixed(2) : "—"}
              </strong>
            </div>
            <div>
              <span>{t.draw}</span>
              <strong className={`odd-cell ${getOddTone(game.drawOdd)}`}>
                {game.drawOdd ? game.drawOdd.toFixed(2) : "—"}
              </strong>
            </div>
            <div>
              <span>{t.away}</span>
              <strong className={`odd-cell ${getOddTone(game.awayOdd)}`}>
                {game.awayOdd ? game.awayOdd.toFixed(2) : "—"}
              </strong>
            </div>
            <div>
              <span>{t.over25}</span>
              <strong
                className={`odd-cell ${getGoalsOddTone(game.over25Odd, "over")}`}
              >
                {game.over25Odd ? game.over25Odd.toFixed(2) : "—"}
              </strong>
            </div>
            <div>
              <span>{t.under25}</span>
              <strong
                className={`odd-cell ${getGoalsOddTone(game.under25Odd, "under")}`}
              >
                {game.under25Odd ? game.under25Odd.toFixed(2) : "—"}
              </strong>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function App() {
  const [lang, setLang] = useState(
    () => localStorage.getItem("tradertab-language") || "pt",
  );
  const [theme, setTheme] = useState(
    () => localStorage.getItem("tradertab-theme") || "dark",
  );
  const [query, setQuery] = useState("");
  const [day, setDay] = useState("all");
  const [timePeriod, setTimePeriod] = useState("all");
  const [raceFilter, setRaceFilter] = useState("all");
  const [type, setType] = useState("all");
  const [gender, setGender] = useState("all");
  const [classification, setClassification] = useState("all");
  const [country, setCountry] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "time",
    direction: "asc",
  });
  const [maxHomeOdd, setMaxHomeOdd] = useState("");
  const [maxAwayOdd, setMaxAwayOdd] = useState("");
  const [minOver25Odd, setMinOver25Odd] = useState("");
  const [minUnder25Odd, setMinUnder25Odd] = useState("");
  const [maxHomePosition, setMaxHomePosition] = useState("");
  const [maxAwayPosition, setMaxAwayPosition] = useState("");
  const [mobileFilters, setMobileFilters] = useState(false);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [cookieSettingsOpen, setCookieSettingsOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState(
    () => window.location.hash.toLowerCase(),
  );
  const listSectionRef = useRef(null);
  const filterScrollInitialized = useRef(false);
  const t = translations[lang];
  const hasMemberAccess = Boolean(
    authUser &&
      userProfile?.birthDate &&
      userProfile?.countryCode &&
      Number(userProfile?.age) >= 18,
  );

  const loadGames = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const separator = GOOGLE_SHEETS_URL.includes("?") ? "&" : "?";
      const response = await fetch(
        `${GOOGLE_SHEETS_URL}${separator}_=${Date.now()}`,
        { cache: "no-store" },
      );
      if (!response.ok) {
        const error = new Error("server-unavailable");
        error.status = response.status;
        throw error;
      }
      const payload = await response.json();
      if (payload?.success === false)
        throw new Error("server-invalid-response");
      const rows = Array.isArray(payload?.games)
        ? payload.games
        : Array.isArray(payload)
          ? payload
          : [];
      setGames(
        rows
          .map(normalizeGame)
          .filter(
            (game) =>
              game.home &&
              game.away &&
              /^([01]\d|2[0-3]):[0-5]\d$/.test(game.time),
          ),
      );
      setLastUpdated(new Date());
    } catch (error) {
      console.error("[TraderTab] Falha ao ler Google Sheets", error);
      if (
        error?.message === "server-unavailable" ||
        Number(error?.status) >= 500
      ) {
        setLoadError("serverUnavailable");
      } else if (
        error?.message === "server-invalid-response" ||
        error instanceof SyntaxError
      ) {
        setLoadError("serverInvalidResponse");
      } else {
        setLoadError("connectionError");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let hourlyTimeoutId;
    let cancelled = false;

    const scheduleNextFullHour = () => {
      const now = new Date();
      const nextFullHour = new Date(now);
      nextFullHour.setHours(now.getHours() + 1, 0, 0, 0);
      const delay = Math.max(1000, nextFullHour.getTime() - now.getTime());

      hourlyTimeoutId = window.setTimeout(async () => {
        if (cancelled) return;
        await loadGames();
        if (!cancelled) scheduleNextFullHour();
      }, delay);
    };

    loadGames();
    scheduleNextFullHour();

    return () => {
      cancelled = true;
      window.clearTimeout(hourlyTimeoutId);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("tradertab-theme", theme);
  }, [theme]);

  useEffect(() => localStorage.setItem("tradertab-language", lang), [lang]);

  useEffect(() => {
    const handleHashChange = () =>
      setCurrentHash(window.location.hash.toLowerCase());

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(
    () =>
      observeAuth((session) => {
        setAuthUser(session?.user || null);
        setUserProfile(session?.profile || null);
        setAuthReady(true);

        if (session?.user) {
          const profileIsComplete = Boolean(
            session.profile?.birthDate &&
              session.profile?.countryCode &&
              Number(session.profile?.age) >= 18,
          );

          setAuthModalOpen(!profileIsComplete);
        }
      }),
    [],
  );

  const countries = useMemo(
    () => [...new Set(games.map((game) => game.country))].sort(),
    [games],
  );
  const leaguesCount = useMemo(
    () => new Set(games.map((game) => game.competition)).size,
    [games],
  );

  const parsePositiveNumber = (value) => {
    if (!String(value).trim()) return null;
    const parsed = Number(String(value).replace(",", "."));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };

  const filteredGames = useMemo(() => {
    const homeLimit = parsePositiveNumber(maxHomeOdd);
    const awayLimit = parsePositiveNumber(maxAwayOdd);
    const over25Limit = parsePositiveNumber(minOver25Odd);
    const under25Limit = parsePositiveNumber(minUnder25Odd);
    const homePositionLimit = parsePositiveNumber(maxHomePosition);
    const awayPositionLimit = parsePositiveNumber(maxAwayPosition);
    const normalized = query.trim().toLowerCase();
    const result = games.filter((game) => {
      const searchable =
        `${game.home} ${game.away} ${game.competition} ${game.country}`.toLowerCase();
      return (
        (!normalized || searchable.includes(normalized)) &&
        (day === "all" || game.day === day) &&
        (timePeriod === "all" || game.timePeriod === timePeriod) &&
        (raceFilter === "all" ||
          (raceFilter === "yes"
            ? game.homeForm.length > 0 || game.awayForm.length > 0
            : game.homeForm.length === 0 && game.awayForm.length === 0)) &&
        (type === "all" || game.type === type) &&
        (gender === "all" || game.gender === gender) &&
        (classification === "all" || game.classification === classification) &&
        (country === "all" || game.country === country) &&
        (homeLimit === null
          ? true
          : game.homeOdd > 0 && game.homeOdd <= homeLimit) &&
        (awayLimit === null
          ? true
          : game.awayOdd > 0 && game.awayOdd <= awayLimit) &&
        (over25Limit === null
          ? true
          : game.over25Odd > 0 && game.over25Odd >= over25Limit) &&
        (under25Limit === null
          ? true
          : game.under25Odd > 0 && game.under25Odd >= under25Limit) &&
        (homePositionLimit === null
          ? true
          : game.homePosition !== null &&
            game.homePosition > 0 &&
            game.homePosition <= homePositionLimit) &&
        (awayPositionLimit === null
          ? true
          : game.awayPosition !== null &&
            game.awayPosition > 0 &&
            game.awayPosition <= awayPositionLimit)
      );
    });
    const direction = sortConfig.direction === "asc" ? 1 : -1;
    const textValue = (value) =>
      String(value ?? "").toLocaleLowerCase(localeByLanguage[lang] || "pt-BR");
    const timeValue = (game) => {
      const parsedDate = parseDate(game.date);
      const [hours = 0, minutes = 0] = String(game.time || "")
        .split(":")
        .map(Number);
      if (!parsedDate) return Number.MAX_SAFE_INTEGER;
      return new Date(
        parsedDate.getFullYear(),
        parsedDate.getMonth(),
        parsedDate.getDate(),
        hours,
        minutes,
      ).getTime();
    };

    return [...result].sort((a, b) => {
      let comparison = 0;
      switch (sortConfig.key) {
        case "time":
          comparison = timeValue(a) - timeValue(b);
          break;
        case "homePosition":
          comparison = (a.homePosition ?? 999) - (b.homePosition ?? 999);
          break;
        case "awayPosition":
          comparison = (a.awayPosition ?? 999) - (b.awayPosition ?? 999);
          break;
        case "homeOdd":
          comparison = a.homeOdd - b.homeOdd;
          break;
        case "drawOdd":
          comparison = a.drawOdd - b.drawOdd;
          break;
        case "awayOdd":
          comparison = a.awayOdd - b.awayOdd;
          break;
        case "over25Odd":
          comparison = a.over25Odd - b.over25Odd;
          break;
        case "under25Odd":
          comparison = a.under25Odd - b.under25Odd;
          break;
        case "country":
          comparison = textValue(a.country).localeCompare(textValue(b.country));
          break;
        case "competition":
          comparison = textValue(a.competition).localeCompare(
            textValue(b.competition),
          );
          break;
        case "home":
          comparison = textValue(a.home).localeCompare(textValue(b.home));
          break;
        case "away":
          comparison = textValue(a.away).localeCompare(textValue(b.away));
          break;
        case "classification":
          comparison = textValue(t[a.classification]).localeCompare(
            textValue(t[b.classification]),
          );
          break;
        default:
          comparison = 0;
      }
      return comparison * direction;
    });
  }, [
    query,
    day,
    timePeriod,
    raceFilter,
    type,
    gender,
    classification,
    country,
    games,
    maxHomeOdd,
    maxAwayOdd,
    minOver25Odd,
    minUnder25Odd,
    maxHomePosition,
    maxAwayPosition,
    sortConfig,
    lang,
    t,
  ]);

  const avgFavorite = filteredGames.length
    ? filteredGames.reduce(
        (sum, game) => sum + Math.min(game.homeOdd, game.awayOdd),
        0,
      ) / filteredGames.length
    : 0;
  const filteredCountries = new Set(filteredGames.map((game) => game.country))
    .size;

  useEffect(() => {
    if (!filterScrollInitialized.current) {
      filterScrollInitialized.current = true;
      return undefined;
    }

    const hasActiveFilter =
      day !== "all" ||
      timePeriod !== "all" ||
      raceFilter !== "all" ||
      type !== "all" ||
      gender !== "all" ||
      classification !== "all" ||
      country !== "all" ||
      maxHomeOdd.trim() !== "" ||
      maxAwayOdd.trim() !== "" ||
      minOver25Odd.trim() !== "" ||
      minUnder25Odd.trim() !== "" ||
      maxHomePosition.trim() !== "" ||
      maxAwayPosition.trim() !== "";

    if (!hasActiveFilter || !window.matchMedia("(max-width: 860px)").matches) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      listSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [
    day,
    timePeriod,
    raceFilter,
    type,
    gender,
    classification,
    country,
    maxHomeOdd,
    maxAwayOdd,
    minOver25Odd,
    minUnder25Odd,
    maxHomePosition,
    maxAwayPosition,
  ]);

  const resetFilters = () => {
    setQuery("");
    setDay("all");
    setTimePeriod("all");
    setRaceFilter("all");
    setType("all");
    setGender("all");
    setClassification("all");
    setCountry("all");
    setSortConfig({ key: "time", direction: "asc" });
    setMaxHomeOdd("");
    setMaxAwayOdd("");
    setMinOver25Odd("");
    setMinUnder25Odd("");
    setMaxHomePosition("");
    setMaxAwayPosition("");
  };

  useEffect(() => {
    if (authReady && !hasMemberAccess) resetFilters();
  }, [authReady, hasMemberAccess]);

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const formatFilterDate = (offset) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + offset);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }).format(date);
  };

  const dateOptions = [
    { value: "all", label: t.all },
    { value: "today", label: formatFilterDate(0) },
    { value: "tomorrow", label: formatFilterDate(1) },
    { value: "dayAfter", label: formatFilterDate(2) },
    { value: "dayPlus3", label: formatFilterDate(3) },
  ];

  if (currentHash === "#privacidade") {
    return (
      <div className="app-shell">
        <PrivacyPolicy
          language={lang}
          onBack={() => {
            window.location.hash = "";
          }}
        />
        <CookieConsent
          language={lang}
          settingsOpen={cookieSettingsOpen}
          onSettingsClose={() => setCookieSettingsOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Logo />
          <div className="topbar-actions">
            {authUser ? (
              <div className="account-menu-wrap">
                <button
                  type="button"
                  className="account-button"
                  onClick={() => setAccountMenuOpen((current) => !current)}
                  aria-expanded={accountMenuOpen}
                >
                  {authUser.photoURL ? (
                    <img src={authUser.photoURL} alt="" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="account-avatar">
                      {(authUser.email || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="account-button-copy">
                    <strong>
                      {authUser.displayName ||
                        authUser.email?.split("@")[0] ||
                        t.account}
                    </strong>
                    <small>{t.account}</small>
                  </span>
                  <ChevronDown size={15} />
                </button>
                {accountMenuOpen && (
                  <div className="account-popover">
                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        setAuthModalOpen(true);
                      }}
                    >
                      <UserRound size={17} />
                      {t.account}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        logout();
                      }}
                    >
                      <LogOut size={17} />
                      {t.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                className="login-button"
                onClick={() => setAuthModalOpen(true)}
              >
                <LogIn size={18} />
                {t.login}
              </button>
            )}
            <div className="language-menu">
              <Globe2 size={17} />
              <select
                value={lang}
                onChange={(event) => setLang(event.target.value)}
                aria-label={t.language}
              >
                {languageOptions.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.flag} {item.short}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} />
            </div>
            <button
              className="icon-button"
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={t.theme}
            >
              {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
            </button>
          </div>
        </div>
      </header>

      <main className="page">
        {lang === "pt" && (
          <aside className="responsible-warning" role="note">
            {t.responsibleWarning}
          </aside>
        )}

        <section className="date-filter-only">
          <Segmented
            value={day}
            onChange={setDay}
            options={dateOptions}
            ariaLabel={t.date}
          />
        </section>

        {hasMemberAccess ? (
          <>
            <section className="filters-section">
          <div className="section-heading">
            <div>
              <Filter size={18} />
              <strong>{t.quickFilters}</strong>
            </div>
            <button
              type="button"
              className="ghost-button"
              onClick={resetFilters}
            >
              {t.clear}
            </button>
          </div>
          <div className="search-row">
            <label className="search-box">
              <Search size={19} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.search}
              />
              {query && (
                <button type="button" onClick={() => setQuery("")}>
                  <X size={16} />
                </button>
              )}
            </label>
            <button
              type="button"
              className="mobile-filter-button"
              onClick={() => setMobileFilters(!mobileFilters)}
            >
              <SlidersHorizontal size={18} />
              {t.filters}
            </button>
          </div>
          <div className={`filters-grid-wrap ${mobileFilters ? "open" : ""}`}>
            <div className="filter-grid">
              <label className="select-field">
                <span>{t.timeRange}</span>
                <div>
                  <Clock3 size={17} />
                  <select
                    value={timePeriod}
                    onChange={(event) => setTimePeriod(event.target.value)}
                  >
                    <option value="all">{t.all}</option>
                    <option value="dawn">{t.dawn}</option>
                    <option value="morning">{t.morning}</option>
                    <option value="afternoon">{t.afternoon}</option>
                    <option value="night">{t.night}</option>
                  </select>
                  <ChevronDown size={15} />
                </div>
              </label>
              <label className="select-field">
                <span>{t.raceFilter}</span>
                <div>
                  <TrendingUp size={17} />
                  <select
                    value={raceFilter}
                    onChange={(event) => setRaceFilter(event.target.value)}
                  >
                    <option value="all">{t.all}</option>
                    <option value="yes">{t.yes}</option>
                    <option value="no">{t.no}</option>
                  </select>
                  <ChevronDown size={15} />
                </div>
              </label>
              <label className="select-field">
                <span>{t.competitionType}</span>
                <div>
                  <LayoutGrid size={17} />
                  <select
                    value={type}
                    onChange={(event) => setType(event.target.value)}
                  >
                    <option value="all">{t.all}</option>
                    <option value="league">{t.league}</option>
                    <option value="cup">{t.cup}</option>
                  </select>
                  <ChevronDown size={15} />
                </div>
              </label>
              <label className="select-field">
                <span>{t.gender}</span>
                <div>
                  <Globe2 size={17} />
                  <select
                    value={gender}
                    onChange={(event) => setGender(event.target.value)}
                  >
                    <option value="all">{t.all}</option>
                    <option value="male">{t.male}</option>
                    <option value="female">{t.female}</option>
                  </select>
                  <ChevronDown size={15} />
                </div>
              </label>
              <label className="select-field">
                <span>{t.classification}</span>
                <div>
                  <TrendingUp size={17} />
                  <select
                    value={classification}
                    onChange={(event) => setClassification(event.target.value)}
                  >
                    <option value="all">{t.all}</option>
                    <option value="balanced">{t.balanced}</option>
                    <option value="homeFavorite">{t.homeFavorite}</option>
                    <option value="awayFavorite">{t.awayFavorite}</option>
                    <option value="strongFavorite">{t.strongFavorite}</option>
                  </select>
                  <ChevronDown size={15} />
                </div>
              </label>
              <label className="select-field">
                <span>{t.country}</span>
                <div>
                  <Globe2 size={17} />
                  <select
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                  >
                    <option value="all">{t.all}</option>
                    {countries.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={15} />
                </div>
              </label>
            </div>
            <div className="odds-filter-row">
              <label className="select-field odd-filter-field">
                <span>{t.maxHomeOdd}</span>
                <div>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={maxHomeOdd}
                    onChange={(event) => setMaxHomeOdd(event.target.value)}
                    placeholder={t.maxOddPlaceholder}
                    aria-label={t.maxHomeOdd}
                  />
                </div>
              </label>
              <label className="select-field odd-filter-field">
                <span>{t.maxAwayOdd}</span>
                <div>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={maxAwayOdd}
                    onChange={(event) => setMaxAwayOdd(event.target.value)}
                    placeholder={t.maxOddPlaceholder}
                    aria-label={t.maxAwayOdd}
                  />
                </div>
              </label>
              <label className="select-field odd-filter-field">
                <span>{t.minOver25Odd}</span>
                <div>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={minOver25Odd}
                    onChange={(event) => setMinOver25Odd(event.target.value)}
                    placeholder={t.maxOddPlaceholder}
                    aria-label={t.minOver25Odd}
                  />
                </div>
              </label>
              <label className="select-field odd-filter-field">
                <span>{t.minUnder25Odd}</span>
                <div>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={minUnder25Odd}
                    onChange={(event) => setMinUnder25Odd(event.target.value)}
                    placeholder={t.maxOddPlaceholder}
                    aria-label={t.minUnder25Odd}
                  />
                </div>
              </label>
              <label className="select-field odd-filter-field position-filter-field">
                <span>{t.homePosition}</span>
                <div>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="1"
                    step="1"
                    value={maxHomePosition}
                    onChange={(event) => setMaxHomePosition(event.target.value)}
                    placeholder={t.positionPlaceholder}
                    aria-label={t.homePosition}
                  />
                </div>
              </label>
              <label className="select-field odd-filter-field position-filter-field">
                <span>{t.awayPosition}</span>
                <div>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="1"
                    step="1"
                    value={maxAwayPosition}
                    onChange={(event) => setMaxAwayPosition(event.target.value)}
                    placeholder={t.positionPlaceholder}
                    aria-label={t.awayPosition}
                  />
                </div>
              </label>
            </div>
          </div>
            </section>
          </>
        ) : (
          <section className="locked-access">
            <span className="locked-access-icon">
              <LockKeyhole size={24} />
            </span>
            <div>
              <small>{t.memberAccess}</small>
              <h2>
                {authUser ? t.profileRequiredTitle : t.lockedTitle}
              </h2>
              <p>{authUser ? t.profileRequiredText : t.lockedText}</p>
            </div>
            <button type="button" onClick={() => setAuthModalOpen(true)}>
              <LogIn size={18} />
              {authUser ? t.completeProfile : t.unlock}
            </button>
          </section>
        )}

        <section ref={listSectionRef} className="list-section">
          <div className="section-heading list-heading">
            <div>
              <Trophy size={18} />
              <strong>{t.listTitle}</strong>
            </div>
            <div className="list-actions">
              <span>
                {lastUpdated
                  ? `${t.lastUpdate}: ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                  : t.updated}
              </span>
            </div>
          </div>

          {loading ? (
            <section className="empty-state">
              <RefreshCw size={30} className="spinning" />
              <h3>{t.loading}</h3>
            </section>
          ) : loadError ? (
            <section className="empty-state error-state">
              <X size={30} />
              <h3>{t.loadError}</h3>
              <p>{t[loadError] || t.loadError}</p>
              <button type="button" onClick={loadGames}>
                {t.retry}
              </button>
            </section>
          ) : filteredGames.length ? (
            <>
              <div className="desktop-table">
                <MatchTable
                  games={filteredGames}
                  t={t}
                  lang={lang}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  userId={hasMemberAccess ? authUser?.uid : null}
                  showRace={hasMemberAccess}
                />
              </div>
              <div className="mobile-table">
                <MobileList
                  games={filteredGames}
                  t={t}
                  lang={lang}
                  showRace={hasMemberAccess}
                />
              </div>
            </>
          ) : (
            <section className="empty-state">
              <Search size={30} />
              <h3>{t.noGamesTitle}</h3>
              <p>{t.noGamesText}</p>
              <button type="button" onClick={resetFilters}>
                {t.clear}
              </button>
            </section>
          )}
        </section>
      </main>
      <footer className="app-footer">
        <p>{t.footer}</p>
        <nav aria-label="Privacidade">
          <a href="#privacidade">{t.privacyPolicy}</a>
          <button type="button" onClick={() => setCookieSettingsOpen(true)}>
            {t.cookiePreferences}
          </button>
          <a href="mailto:myradardev@gmail.com">{t.privacyContact}</a>
        </nav>
        <p className="footer-copyright">{t.copyright}</p>
      </footer>
      {authModalOpen && (
        <AuthModal
          language={lang}
          user={authUser}
          profile={userProfile}
          onClose={() => setAuthModalOpen(false)}
          onProfileSaved={(nextProfile) =>
            setUserProfile((current) => ({ ...current, ...nextProfile }))
          }
        />
      )}
      <CookieConsent
        language={lang}
        settingsOpen={cookieSettingsOpen}
        onSettingsClose={() => setCookieSettingsOpen(false)}
      />
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
