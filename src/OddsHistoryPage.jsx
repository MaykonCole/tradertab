import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Filter,
  RefreshCw,
  Search,
  TrendingUp,
} from "lucide-react";

const REGUA_SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbxuSAtXNbMuc_4t5Xas4d7ONzywWT5PUx1x1TNuu0WWXyGLci_aExuG__xAK1CDiwEE/exec";

const copy = {
  pt: {
    eyebrow: "Histórico de mercado",
    title: "Histórico Odds",
    subtitle:
      "Consulte as réguas salvas na planilha e visualize a evolução das odds em uma régua compacta, contínua e fácil de ler.",
    date: "Data",
    team: "Time",
    teamPlaceholder: "Buscar por time",
    period: "Período",
    marketFilter: "Mercado",
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
    paid: "% pago",
    noOdd: "Sem odd",
    updatedAt: "Atualizado em",
    createdAt: "Criado em",
  },
  en: {
    eyebrow: "Market history",
    title: "Odds History",
    subtitle:
      "Browse the saved ladder records from the spreadsheet and view odds progression on a compact, continuous and readable ruler.",
    date: "Date",
    team: "Team",
    teamPlaceholder: "Search team",
    period: "Period",
    marketFilter: "Market",
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
    paid: "% paid",
    noOdd: "No odds",
    updatedAt: "Updated at",
    createdAt: "Created at",
  },
  es: {
    eyebrow: "Historial de mercado",
    title: "Histórico Odds",
    subtitle:
      "Consulta las reglas guardadas en la hoja y visualiza la evolución de las cuotas en tarjetas modernas, claras y fáciles de leer.",
    date: "Fecha",
    team: "Equipo",
    teamPlaceholder: "Buscar equipo",
    period: "Periodo",
    marketFilter: "Mercado",
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
    paid: "% pagado",
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
  };
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

export default function OddsHistoryPage({ language = "pt" }) {
  const t = copy[language] || copy.pt;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [records, setRecords] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [marketFilter, setMarketFilter] = useState("all");
  const [expandedIds, setExpandedIds] = useState(() => new Set());

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const nextRecords = await fetchReguas();
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

  const filteredRecords = useMemo(() => {
    const search = teamFilter.trim().toLowerCase();

    return records.filter((record) => {
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
  }, [dateFilter, marketFilter, periodFilter, records, teamFilter]);

  const toggleExpanded = (id) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearFilters = () => {
    setDateFilter("");
    setTeamFilter("");
    setPeriodFilter("all");
    setMarketFilter("all");
  };

  return (
    <main className="page odds-history-page">
      <section className="odds-history-hero">
        <div>
          <span className="odds-history-eyebrow">
            <TrendingUp size={16} />
            {t.eyebrow}
          </span>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
      </section>

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
    </main>
  );
}
