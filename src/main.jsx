import React, { useEffect, useMemo, useState } from "react";
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
  Moon,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sun,
  TrendingUp,
  Trophy,
  X,
} from "lucide-react";
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
    competitionType: "Tipo de jogo",
    gender: "Gênero",
    male: "Masculino",
    female: "Feminino",
    classification: "Classificação",
    country: "País",
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
    validOnly: "Somente jogos futuros com horário válido",
    confidence: "Confiança",
    high: "Alta",
    medium: "Média",
    low: "Baixa",
    loading: "Carregando jogos do servidor...",
    loadError: "Não foi possível carregar os jogos.",
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
    competitionType: "Game type",
    gender: "Gender",
    male: "Male",
    female: "Female",
    classification: "Classification",
    country: "Country",
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
    validOnly: "Future matches with a valid time only",
    confidence: "Confidence",
    high: "High",
    medium: "Medium",
    low: "Low",
    loading: "Loading matches from the server...",
    loadError: "The matches could not be loaded.",
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
    competitionType: "Tipo de partido",
    gender: "Género",
    male: "Masculino",
    female: "Femenino",
    classification: "Clasificación",
    country: "País",
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
    validOnly: "Solo partidos futuros con horario válido",
    confidence: "Confianza",
    high: "Alta",
    medium: "Media",
    low: "Baja",
    loading: "Cargando partidos desde la servidor...",
    loadError: "No fue posible cargar los partidos.",
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
    country,
    flag: countryFlags[country] || "🌐",
    competition,
    type: normalizeType(competition),
    gender: normalizeGender(competition, home, away),
    home,
    away,
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
        <span>Match intelligence</span>
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
  "country",
  "competition",
  "home",
  "homeOdd",
  "drawOdd",
  "awayOdd",
  "away",
  "classification",
  "over25Odd",
  "under25Odd",
];

const COLUMN_ORDER_STORAGE_KEY = "tradertab-column-order-v1";

function getSavedColumnOrder() {
  try {
    const saved = JSON.parse(localStorage.getItem(COLUMN_ORDER_STORAGE_KEY));
    if (
      Array.isArray(saved) &&
      saved.length === DEFAULT_COLUMN_ORDER.length &&
      DEFAULT_COLUMN_ORDER.every((key) => saved.includes(key))
    ) {
      return saved;
    }
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
        <span
          className="column-drag-handle"
          draggable
          onDragStart={onDragStart}
          title="Arraste para reorganizar a coluna"
          aria-label={`Reorganizar coluna ${label}`}
        >
          <GripVertical size={14} strokeWidth={2.2} />
        </span>
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

function MatchTable({ games, t, lang, sortConfig, onSort }) {
  const [columnOrder, setColumnOrder] = useState(getSavedColumnOrder);
  const [draggedColumn, setDraggedColumn] = useState(null);

  const columns = {
    time: {
      label: t.time,
      render: (game) => (
        <span className="table-time">
          <Clock3 size={14} />
          {game.time}
        </span>
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
          <small>{formatGameDate(game.date, lang)}</small>
        </div>
      ),
    },
    home: {
      label: t.home,
      render: (game) => (
        <strong className="team-cell home-team">{game.home}</strong>
      ),
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
        <strong className="team-cell away-team">{game.away}</strong>
      ),
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
    if (!draggedColumn || draggedColumn === targetColumn) return;

    setColumnOrder((currentOrder) => {
      const nextOrder = [...currentOrder];
      const sourceIndex = nextOrder.indexOf(draggedColumn);
      const targetIndex = nextOrder.indexOf(targetColumn);
      nextOrder.splice(sourceIndex, 1);
      nextOrder.splice(targetIndex, 0, draggedColumn);
      localStorage.setItem(COLUMN_ORDER_STORAGE_KEY, JSON.stringify(nextOrder));
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
                onDragStart={(event) => {
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

function MobileList({ games, t, lang }) {
  return (
    <div className="mobile-cards">
      {games.map((game) => (
        <article key={game.id} className="mobile-game-card">
          <div className="mobile-game-top">
            <span className="table-time">
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
            <span>{game.country}</span>
            <span>{game.competition}</span>
            <span>{formatGameDate(game.date, lang)}</span>
          </div>

          <div className="mobile-teams">
            <div className="mobile-team-row">
              <span className="mobile-team-label">{t.home}</span>
              <strong>{game.home}</strong>
            </div>
            <div className="mobile-team-row away-row">
              <span className="mobile-team-label">{t.away}</span>
              <strong>{game.away}</strong>
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
  const [mobileFilters, setMobileFilters] = useState(false);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const t = translations[lang];

  const loadGames = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const separator = GOOGLE_SHEETS_URL.includes("?") ? "&" : "?";
      const response = await fetch(
        `${GOOGLE_SHEETS_URL}${separator}_=${Date.now()}`,
        { cache: "no-store" },
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      if (payload?.success === false)
        throw new Error(payload.error || "Google Apps Script error");
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
      setLoadError(error instanceof Error ? error.message : String(error));
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

  const countries = useMemo(
    () => [...new Set(games.map((game) => game.country))].sort(),
    [games],
  );
  const leaguesCount = useMemo(
    () => new Set(games.map((game) => game.competition)).size,
    [games],
  );

  const parseMaxOdd = (value) => {
    if (!String(value).trim()) return null;
    const parsed = Number(String(value).replace(",", "."));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };

  const filteredGames = useMemo(() => {
    const homeLimit = parseMaxOdd(maxHomeOdd);
    const awayLimit = parseMaxOdd(maxAwayOdd);
    const over25Limit = parseMaxOdd(minOver25Odd);
    const under25Limit = parseMaxOdd(minUnder25Odd);
    const normalized = query.trim().toLowerCase();
    const result = games.filter((game) => {
      const searchable =
        `${game.home} ${game.away} ${game.competition} ${game.country}`.toLowerCase();
      return (
        (!normalized || searchable.includes(normalized)) &&
        (day === "all" || game.day === day) &&
        (type === "all" || game.type === type) &&
        (gender === "all" || game.gender === gender) &&
        (classification === "all" || game.classification === classification) &&
        (country === "all" || game.country === country) &&
        (homeLimit === null ||
          (game.homeOdd > 0 && game.homeOdd <= homeLimit)) &&
        (awayLimit === null ||
          (game.awayOdd > 0 && game.awayOdd <= awayLimit)) &&
        (over25Limit === null ||
          (game.over25Odd > 0 && game.over25Odd >= over25Limit)) &&
        (under25Limit === null ||
          (game.under25Odd > 0 && game.under25Odd >= under25Limit))
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
    type,
    gender,
    classification,
    country,
    games,
    maxHomeOdd,
    maxAwayOdd,
    minOver25Odd,
    minUnder25Odd,
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

  const resetFilters = () => {
    setQuery("");
    setDay("all");
    setType("all");
    setGender("all");
    setClassification("all");
    setCountry("all");
    setSortConfig({ key: "time", direction: "asc" });
    setMaxHomeOdd("");
    setMaxAwayOdd("");
    setMinOver25Odd("");
    setMinUnder25Odd("");
  };

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

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Logo />
          <div className="topbar-actions">
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
        <section className="date-filter-only">
          <Segmented
            value={day}
            onChange={setDay}
            options={dateOptions}
            ariaLabel={t.date}
          />
        </section>

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
            </div>
          </div>
        </section>

        <section className="list-section">
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
              <p>{loadError}</p>
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
                />
              </div>
              <div className="mobile-table">
                <MobileList games={filteredGames} t={t} lang={lang} />
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
      <footer>{t.footer}</footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
