import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Heart,
  Search,
  ShieldCheck,
  Star,
  Trash2,
  Trophy,
  X,
} from "lucide-react";

const copy = {
  pt: {
    back: "Voltar aos jogos",
    preferencesTitle: "Meus Filtros",
    preferencesSubtitle:
      "Escolha somente os critérios que desejar. Um jogo será exibido quando atender a qualquer critério configurado.",
    teams: "Times favoritos",
    teamsPlaceholder: "Buscar e adicionar times",
    leagues: "Ligas favoritas",
    leaguesPlaceholder: "Buscar e adicionar ligas",
    homeOdds: "Range Odd Casa",
    awayOdds: "Range Odd Fora",
    overOdds: "Range Odd Over 2.5",
    underOdds: "Range Odd Under 2.5",
    positions: "Range de posições",
    min: "Mínima",
    max: "Máxima",
    optional: "Opcional",
    save: "Salvar configurações",
    clear: "Limpar filtros",
    saving: "Salvando...",
    saved: "Preferências salvas com sucesso.",
    invalidRange: "O valor mínimo não pode ser maior que o máximo.",
    saveError: "Não foi possível salvar. Tente novamente.",
    matches: "Jogos encontrados para você",
    noCriteriaTitle: "Configure seus primeiros filtros",
    noCriteriaText:
      "Adicione um time, uma liga ou um range para receber uma seleção automática.",
    noMatchesTitle: "Nenhum jogo corresponde agora",
    noMatchesText:
      "Suas preferências estão salvas. Novos jogos aparecerão automaticamente quando corresponderem.",
    myGamesTitle: "Meus Jogos",
    myGamesSubtitle:
      "Partidas marcadas com estrela, ordenadas conforme a opção selecionada.",
    noGamesTitle: "Nenhum jogo favoritado",
    noGamesText:
      "Use a estrela na listagem principal para guardar uma partida aqui.",
    remove: "Remover dos meus jogos",
    home: "Casa",
    draw: "Empate",
    away: "Fora",
    over: "Over 2.5",
    under: "Under 2.5",
    position: "Pos.",
    protected: "Preferências sincronizadas com sua conta",
    searchEmpty: "Nenhuma opção encontrada",
    sortBy: "Ordenar por",
    sortChampionship: "Por Campeonato",
    sortDate: "Por Data",
    sortHomeOdd: "Por Odd Casa",
    sortAwayOdd: "Por Odd Fora",
    sortOverOdd: "Por Odd Over",
    sortUnderOdd: "Por Odd Under",
  },
  en: {
    back: "Back to matches",
    preferencesTitle: "My Filter",
    preferencesSubtitle:
      "Choose only the criteria you want. A match appears when it meets any configured criterion.",
    teams: "Favorite teams",
    teamsPlaceholder: "Search and add teams",
    leagues: "Favorite leagues",
    leaguesPlaceholder: "Search and add leagues",
    homeOdds: "Home odds range",
    awayOdds: "Away odds range",
    overOdds: "Over 2.5 odds range",
    underOdds: "Under 2.5 odds range",
    positions: "Position range",
    min: "Minimum",
    max: "Maximum",
    optional: "Optional",
    save: "Save settings",
    clear: "Clear filters",
    saving: "Saving...",
    saved: "Preferences saved successfully.",
    invalidRange: "The minimum value cannot be greater than the maximum.",
    saveError: "Unable to save. Please try again.",
    matches: "Matches selected for you",
    noCriteriaTitle: "Configure your first filters",
    noCriteriaText:
      "Add a team, league or range to receive an automatic selection.",
    noMatchesTitle: "No matching games right now",
    noMatchesText:
      "Your preferences are saved. New matching games will appear automatically.",
    myGamesTitle: "My Matches",
    myGamesSubtitle: "Starred matches sorted according to the selected option.",
    noGamesTitle: "No starred matches",
    noGamesText: "Use the star in the main list to save a match here.",
    remove: "Remove from my matches",
    home: "Home",
    draw: "Draw",
    away: "Away",
    over: "Over 2.5",
    under: "Under 2.5",
    position: "Pos.",
    protected: "Preferences synced with your account",
    searchEmpty: "No options found",
    sortBy: "Sort by",
    sortChampionship: "By Competition",
    sortDate: "By Date",
    sortHomeOdd: "By Home Odd",
    sortAwayOdd: "By Away Odd",
    sortOverOdd: "By Over Odd",
    sortUnderOdd: "By Under Odd",
  },
  es: {
    back: "Volver a los partidos",
    preferencesTitle: "Mis Filtros",
    preferencesSubtitle:
      "Elige solo los criterios que quieras. Un partido aparece cuando cumple cualquier criterio configurado.",
    teams: "Equipos favoritos",
    teamsPlaceholder: "Buscar y agregar equipos",
    leagues: "Ligas favoritas",
    leaguesPlaceholder: "Buscar y agregar ligas",
    homeOdds: "Rango cuota local",
    awayOdds: "Rango cuota visitante",
    overOdds: "Rango cuota Over 2.5",
    underOdds: "Rango cuota Under 2.5",
    positions: "Rango de posiciones",
    min: "Mínima",
    max: "Máxima",
    optional: "Opcional",
    save: "Guardar configuración",
    clear: "Limpiar filtros",
    saving: "Guardando...",
    saved: "Preferencias guardadas correctamente.",
    invalidRange: "El valor mínimo no puede ser mayor que el máximo.",
    saveError: "No fue posible guardar. Inténtalo de nuevo.",
    matches: "Partidos encontrados para ti",
    noCriteriaTitle: "Configura tus primeros filtros",
    noCriteriaText:
      "Agrega un equipo, una liga o un rango para recibir una selección automática.",
    noMatchesTitle: "No hay partidos coincidentes ahora",
    noMatchesText:
      "Tus preferencias están guardadas. Los nuevos partidos aparecerán automáticamente.",
    myGamesTitle: "Mis Partidos",
    myGamesSubtitle: "Partidos marcados con estrella, ordenados según la opción seleccionada.",
    noGamesTitle: "No hay partidos favoritos",
    noGamesText:
      "Usa la estrella de la lista principal para guardar un partido aquí.",
    remove: "Eliminar de mis partidos",
    home: "Local",
    draw: "Empate",
    away: "Visitante",
    over: "Over 2.5",
    under: "Under 2.5",
    position: "Pos.",
    protected: "Preferencias sincronizadas con tu cuenta",
    searchEmpty: "No se encontraron opciones",
    sortBy: "Ordenar por",
    sortChampionship: "Por Campeonato",
    sortDate: "Por Fecha",
    sortHomeOdd: "Por Cuota Local",
    sortAwayOdd: "Por Cuota Visitante",
    sortOverOdd: "Por Cuota Over",
    sortUnderOdd: "Por Cuota Under",
  },
};

const normalize = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const numberOrNull = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(String(value).replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const getOddTone = (odd) => {
  const value = Number(odd);
  if (!value || !Number.isFinite(value)) return "odd-empty";
  if (value <= 1.3) return "odd-blue-dark";
  if (value < 2) return "odd-blue-light";
  if (value <= 4) return "odd-yellow-light";
  if (value <= 10) return "odd-red-light";
  return "odd-red-dark";
};

const getGoalsOddTone = (odd, market) => {
  const value = Number(odd);
  if (!value || !Number.isFinite(value)) return "odd-empty";
  const prefix = market === "under" ? "under" : "over";
  if (value <= 1.8) return `odd-${prefix}-light`;
  if (value <= 2.1) return "odd-goals-neutral";
  return `odd-${prefix}-dark`;
};

const getLeagueFilterValue = (game) => {
  const competition = String(game?.competition || "").trim();
  const country = String(game?.country || "").trim();
  return country && country !== "—" ? `${country} - ${competition}` : competition;
};

const isWithinRange = (value, minimum, maximum) => {
  if (!Number.isFinite(Number(value)) || Number(value) <= 0) return false;
  const numeric = Number(value);
  return (
    (minimum === null || numeric >= minimum) &&
    (maximum === null || numeric <= maximum)
  );
};

export const hasFavoriteCriteria = (preferences) =>
  Boolean(
    preferences?.teams?.length ||
    preferences?.leagues?.length ||
    numberOrNull(preferences?.homeOddMin) !== null ||
    numberOrNull(preferences?.homeOddMax) !== null ||
    numberOrNull(preferences?.awayOddMin) !== null ||
    numberOrNull(preferences?.awayOddMax) !== null ||
    numberOrNull(preferences?.overOddMin) !== null ||
    numberOrNull(preferences?.overOddMax) !== null ||
    numberOrNull(preferences?.underOddMin) !== null ||
    numberOrNull(preferences?.underOddMax) !== null ||
    numberOrNull(preferences?.positionsMin) !== null ||
    numberOrNull(preferences?.positionsMax) !== null,
  );

export const matchesFavoritePreferences = (game, preferences) => {
  if (!hasFavoriteCriteria(preferences)) return false;

  const teams = new Set((preferences.teams || []).map(normalize));
  const leagues = new Set((preferences.leagues || []).map(normalize));
  const homeOddMin = numberOrNull(preferences.homeOddMin);
  const homeOddMax = numberOrNull(preferences.homeOddMax);
  const awayOddMin = numberOrNull(preferences.awayOddMin);
  const awayOddMax = numberOrNull(preferences.awayOddMax);
  const overOddMin = numberOrNull(preferences.overOddMin);
  const overOddMax = numberOrNull(preferences.overOddMax);
  const underOddMin = numberOrNull(preferences.underOddMin);
  const underOddMax = numberOrNull(preferences.underOddMax);
  const positionsMin = numberOrNull(preferences.positionsMin);
  const positionsMax = numberOrNull(preferences.positionsMax);
  const matchesTeam =
    teams.size > 0 &&
    (teams.has(normalize(game.home)) || teams.has(normalize(game.away)));
  const leagueFilterValue = normalize(getLeagueFilterValue(game));
  const competitionOnly = normalize(game.competition);
  const country = normalize(game.country);
  const legacyLeagueFilterValue =
    country && country !== normalize("—")
      ? normalize(`${game.competition} - ${game.country}`)
      : competitionOnly;
  const matchesLeague =
    leagues.size > 0 &&
    [...leagues].some(
      (selectedLeague) =>
        selectedLeague === leagueFilterValue ||
        selectedLeague === legacyLeagueFilterValue ||
        (!selectedLeague.includes(" - ") && selectedLeague === competitionOnly),
    );
  const matchesHomeOdds =
    (homeOddMin !== null || homeOddMax !== null) &&
    isWithinRange(game.homeOdd, homeOddMin, homeOddMax);
  const matchesAwayOdds =
    (awayOddMin !== null || awayOddMax !== null) &&
    isWithinRange(game.awayOdd, awayOddMin, awayOddMax);
  const matchesOverOdds =
    (overOddMin !== null || overOddMax !== null) &&
    isWithinRange(game.over25Odd, overOddMin, overOddMax);
  const matchesUnderOdds =
    (underOddMin !== null || underOddMax !== null) &&
    isWithinRange(game.under25Odd, underOddMin, underOddMax);
  const matchesPosition =
    (positionsMin !== null || positionsMax !== null) &&
    (isWithinRange(game.homePosition, positionsMin, positionsMax) ||
      isWithinRange(game.awayPosition, positionsMin, positionsMax));

  return (
    matchesTeam ||
    matchesLeague ||
    matchesHomeOdds ||
    matchesAwayOdds ||
    matchesOverOdds ||
    matchesUnderOdds ||
    matchesPosition
  );
};

const parseDate = (value) => {
  const text = String(value || "").trim();
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  const local = text.match(/^(\d{2})[/-](\d{2})[/-](\d{4})/);
  if (local)
    return new Date(Number(local[3]), Number(local[2]) - 1, Number(local[1]));
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
};

const parseTimeMinutes = (value) => {
  const match = String(value ?? "").trim().match(/^(\d{2}):(\d{2})$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours <= 23 && minutes <= 59 ? hours * 60 + minutes : null;
};

const isTodayOrFutureGame = (game) => {
  const date = parseDate(game.date);
  if (!date) return false;

  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  return date.getTime() >= todayStart.getTime();
};

const locale = { pt: "pt-BR", en: "en-US", es: "es-ES" };

const formatDate = (value, language) => {
  const date = parseDate(value);
  if (!date) return String(value || "");
  return new Intl.DateTimeFormat(locale[language] || "pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

const getDateKey = (value) => {
  const date = parseDate(value);
  if (!date) return String(value || "");
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateGroupLabel = (value, language) => {
  const date = parseDate(value);
  if (!date) return String(value || "");
  const datePart = new Intl.DateTimeFormat(locale[language] || "pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
  const weekday = new Intl.DateTimeFormat(locale[language] || "pt-BR", {
    weekday: "long",
  }).format(date);
  return `${datePart} - ${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}`;
};

const compareDateAndTime = (a, b) => {
  const aDate = parseDate(a.date)?.getTime() || 0;
  const bDate = parseDate(b.date)?.getTime() || 0;
  const aTime = parseTimeMinutes(a.time) ?? Number.MAX_SAFE_INTEGER;
  const bTime = parseTimeMinutes(b.time) ?? Number.MAX_SAFE_INTEGER;
  return aDate - bDate || aTime - bTime;
};

function CollapsibleDateGroups({ games, language, renderGame }) {
  const groups = useMemo(() => {
    const map = new Map();
    [...games].sort(compareDateAndTime).forEach((game) => {
      const key = getDateKey(game.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(game);
    });
    return [...map.entries()];
  }, [games]);
  const [collapsed, setCollapsed] = useState(() => new Set());

  return (
    <div className="feature-date-groups">
      {groups.map(([dateKey, dateGames]) => {
        const isCollapsed = collapsed.has(dateKey);
        return (
          <section className="feature-date-group" key={dateKey}>
            <button
              type="button"
              className="feature-date-toggle"
              aria-expanded={!isCollapsed}
              onClick={() =>
                setCollapsed((current) => {
                  const next = new Set(current);
                  if (next.has(dateKey)) next.delete(dateKey);
                  else next.add(dateKey);
                  return next;
                })
              }
            >
              <span className="feature-date-toggle-title">
                <CalendarDays size={17} />
                {formatDateGroupLabel(dateGames[0]?.date, language)}
              </span>
              <span className="feature-date-toggle-meta">
                <strong>{dateGames.length}</strong>
                <ChevronDown size={18} />
              </span>
            </button>
            {!isCollapsed && (
              <div className="feature-games-grid">
                {dateGames.map(renderGame)}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}


function MultiPicker({ label, placeholder, options, selected, onChange, t }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const available = useMemo(() => {
    const selectedSet = new Set(selected.map(normalize));
    const query = normalize(search);
    return options
      .filter((option) => !selectedSet.has(normalize(option)))
      .filter((option) => !query || normalize(option).includes(query))
      .slice(0, 12);
  }, [options, search, selected]);

  const add = (option) => {
    onChange([...selected, option]);
    setSearch("");
    setOpen(false);
  };

  return (
    <div className="favorites-picker">
      <label>
        <span>{label}</span>
        <div className="favorites-search">
          <Search size={17} />
          <input
            value={search}
            placeholder={placeholder}
            onFocus={() => setOpen(true)}
            onChange={(event) => {
              setSearch(event.target.value);
              setOpen(true);
            }}
          />
        </div>
      </label>
      {open && search && (
        <div className="favorites-options">
          {available.length ? (
            available.map((option) => (
              <button key={option} type="button" onClick={() => add(option)}>
                {option}
                <Check size={15} />
              </button>
            ))
          ) : (
            <p>{t.searchEmpty}</p>
          )}
        </div>
      )}
      {selected.length > 0 && (
        <div className="favorites-chips">
          {selected.map((item) => (
            <span key={item}>
              {item}
              <button
                type="button"
                onClick={() =>
                  onChange(selected.filter((value) => value !== item))
                }
                aria-label={`Remover ${item}`}
              >
                <X size={13} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function RangeFields({ title, values, onChange, t, decimal = false }) {
  return (
    <fieldset className="favorites-range">
      <legend>
        {title} <small>{t.optional}</small>
      </legend>
      <label>
        <span>{t.min}</span>
        <input
          type="number"
          inputMode={decimal ? "decimal" : "numeric"}
          min="0"
          step={decimal ? "0.01" : "1"}
          value={values.min ?? ""}
          onChange={(event) => onChange("min", event.target.value)}
          placeholder={decimal ? "1.30" : "1"}
        />
      </label>
      <label>
        <span>{t.max}</span>
        <input
          type="number"
          inputMode={decimal ? "decimal" : "numeric"}
          min="0"
          step={decimal ? "0.01" : "1"}
          value={values.max ?? ""}
          onChange={(event) => onChange("max", event.target.value)}
          placeholder={decimal ? "2.00" : "5"}
        />
      </label>
    </fieldset>
  );
}

function FavoriteStar({ game, isFavorite, onToggle, busy, t }) {
  return (
    <button
      type="button"
      className={`feature-star ${isFavorite ? "active" : ""}`}
      onClick={() => onToggle(game)}
      disabled={busy}
      title={isFavorite ? t.remove : t.myGamesTitle}
    >
      <Star size={19} fill={isFavorite ? "currentColor" : "none"} />
    </button>
  );
}

function CardRace({ results }) {
  if (!Array.isArray(results) || results.length === 0) return null;

  return (
    <span
      className="feature-team-race form-race"
      aria-label={results.join(" ")}
    >
      {results.map((result, index) => (
        <span
          key={`${result}-${index}`}
          className={`form-result form-${String(result).toLowerCase()}`}
        >
          {result}
        </span>
      ))}
    </span>
  );
}

function GamePreviewCard({
  game,
  language,
  t,
  isFavorite,
  onToggle,
  busy,
  showRemove = false,
}) {
  return (
    <article className="feature-game-card">
      <div className="feature-game-heading">
        <div>
          <div className="feature-time-stack">
            <span>{game.time}</span>
            <small className="feature-date-top">
              {formatDate(game.date, language)}
            </small>
          </div>
          <strong className="feature-competition">{game.competition}</strong>
          <small className="feature-country">{game.country}</small>
        </div>
        <FavoriteStar
          game={game}
          isFavorite={isFavorite}
          onToggle={onToggle}
          busy={busy}
          t={t}
        />
      </div>
      <div className="feature-teams">
        <div>
          <span>{t.home}</span>
          <strong>{game.home}</strong>
          <CardRace results={game.homeForm} />
          {game.homePosition && (
            <small>
              {t.position} {game.homePosition}
            </small>
          )}
        </div>
        <div>
          <span>{t.away}</span>
          <strong>{game.away}</strong>
          <CardRace results={game.awayForm} />
          {game.awayPosition && (
            <small>
              {t.position} {game.awayPosition}
            </small>
          )}
        </div>
      </div>
      <div className="feature-odds">
        {[
          [t.home, game.homeOdd, getOddTone(game.homeOdd)],
          [t.draw, game.drawOdd, getOddTone(game.drawOdd)],
          [t.away, game.awayOdd, getOddTone(game.awayOdd)],
          [t.over, game.over25Odd, getGoalsOddTone(game.over25Odd, "over")],
          [t.under, game.under25Odd, getGoalsOddTone(game.under25Odd, "under")],
        ].map(([label, value, tone]) => (
          <span key={label}>
            <small>{label}</small>
            <strong className={`odd-cell ${tone}`}>
              {Number(value) > 0 ? Number(value).toFixed(2) : "—"}
            </strong>
          </span>
        ))}
      </div>
    </article>
  );
}

function FeatureShell({ title, subtitle, icon, t, children }) {
  return (
    <main className="feature-page">
      <div className="feature-shell">
        <header className="feature-header">
          <span>{icon}</span>
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </header>
        <div className="feature-security">
          <ShieldCheck size={16} />
          {t.protected}
        </div>
        {children}
      </div>
    </main>
  );
}

export function FavoritePreferencesPage({
  language,
  preferences,
  teams,
  leagues,
  games,
  favoriteIds,
  favoriteBusyIds,
  onSave,
  onToggleGame,
}) {
  const t = copy[language] || copy.pt;
  const [form, setForm] = useState(preferences);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => setForm(preferences), [preferences]);

  const liveMatchingGames = useMemo(
    () =>
      games.filter(
        (game) =>
          isTodayOrFutureGame(game) && matchesFavoritePreferences(game, form),
      ),
    [games, form],
  );

  const clearFilters = () => {
    setForm({
      teams: [],
      leagues: [],
      homeOddMin: null,
      homeOddMax: null,
      awayOddMin: null,
      awayOddMax: null,
      overOddMin: null,
      overOddMax: null,
      underOddMin: null,
      underOddMax: null,
      positionsMin: null,
      positionsMax: null,
    });
    setStatus("");
  };

  const save = async (event) => {
    event.preventDefault();
    const positionsMin = numberOrNull(form.positionsMin);
    const positionsMax = numberOrNull(form.positionsMax);
    const invalidOddRange = [
      ["homeOddMin", "homeOddMax"],
      ["awayOddMin", "awayOddMax"],
      ["overOddMin", "overOddMax"],
      ["underOddMin", "underOddMax"],
    ].some(([minimumKey, maximumKey]) => {
      const minimum = numberOrNull(form[minimumKey]);
      const maximum = numberOrNull(form[maximumKey]);
      return minimum !== null && maximum !== null && minimum > maximum;
    });
    if (
      invalidOddRange ||
      (positionsMin !== null &&
        positionsMax !== null &&
        positionsMin > positionsMax)
    ) {
      setStatus("invalid");
      return;
    }

    setSaving(true);
    setStatus("");
    try {
      await onSave(form);
      setStatus("saved");
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <FeatureShell
      title={t.preferencesTitle}
      subtitle={t.preferencesSubtitle}
      icon={<Heart size={27} />}
      t={t}
    >
      <form className="favorites-form" onSubmit={save}>
        <div className="favorites-pickers-grid">
          <MultiPicker
            label={t.teams}
            placeholder={t.teamsPlaceholder}
            options={teams}
            selected={form.teams || []}
            onChange={(selected) => setForm({ ...form, teams: selected })}
            t={t}
          />
          <MultiPicker
            label={t.leagues}
            placeholder={t.leaguesPlaceholder}
            options={leagues}
            selected={form.leagues || []}
            onChange={(selected) => setForm({ ...form, leagues: selected })}
            t={t}
          />
        </div>
        <div className="favorites-ranges-grid">
          <RangeFields
            title={t.homeOdds}
            t={t}
            decimal
            values={{ min: form.homeOddMin, max: form.homeOddMax }}
            onChange={(key, value) =>
              setForm({
                ...form,
                [key === "min" ? "homeOddMin" : "homeOddMax"]: value,
              })
            }
          />
          <RangeFields
            title={t.awayOdds}
            t={t}
            decimal
            values={{ min: form.awayOddMin, max: form.awayOddMax }}
            onChange={(key, value) =>
              setForm({
                ...form,
                [key === "min" ? "awayOddMin" : "awayOddMax"]: value,
              })
            }
          />
          <RangeFields
            title={t.overOdds}
            t={t}
            decimal
            values={{ min: form.overOddMin, max: form.overOddMax }}
            onChange={(key, value) =>
              setForm({
                ...form,
                [key === "min" ? "overOddMin" : "overOddMax"]: value,
              })
            }
          />
          <RangeFields
            title={t.underOdds}
            t={t}
            decimal
            values={{ min: form.underOddMin, max: form.underOddMax }}
            onChange={(key, value) =>
              setForm({
                ...form,
                [key === "min" ? "underOddMin" : "underOddMax"]: value,
              })
            }
          />
          <RangeFields
            title={t.positions}
            t={t}
            values={{ min: form.positionsMin, max: form.positionsMax }}
            onChange={(key, value) =>
              setForm({
                ...form,
                [key === "min" ? "positionsMin" : "positionsMax"]: value,
              })
            }
          />
        </div>
        {status && (
          <p className={`favorites-status ${status}`}>
            {status === "saved"
              ? t.saved
              : status === "invalid"
                ? t.invalidRange
                : t.saveError}
          </p>
        )}
        <div className="favorites-actions">
          <button
            className="favorites-clear"
            type="button"
            onClick={clearFilters}
            disabled={saving}
          >
            <Trash2 size={16} />
            {t.clear}
          </button>
          <button className="favorites-save" type="submit" disabled={saving}>
            <Check size={16} />
            {saving ? t.saving : t.save}
          </button>
        </div>
      </form>

      <section className="feature-results">
        <div className="feature-section-title">
          <Trophy size={19} />
          <h2>{t.matches}</h2>
          <span>{liveMatchingGames.length}</span>
        </div>
        {!hasFavoriteCriteria(form) ? (
          <div className="feature-empty">
            <Heart size={30} />
            <h3>{t.noCriteriaTitle}</h3>
            <p>{t.noCriteriaText}</p>
          </div>
        ) : liveMatchingGames.length ? (
          <CollapsibleDateGroups
            games={liveMatchingGames}
            language={language}
            renderGame={(game) => (
              <GamePreviewCard
                key={game.id}
                game={game}
                language={language}
                t={t}
                isFavorite={favoriteIds.has(String(game.id))}
                onToggle={onToggleGame}
                busy={favoriteBusyIds.has(String(game.id))}
              />
            )}
          />
        ) : (
          <div className="feature-empty">
            <Search size={30} />
            <h3>{t.noMatchesTitle}</h3>
            <p>{t.noMatchesText}</p>
          </div>
        )}
      </section>
    </FeatureShell>
  );
}

export function MyGamesPage({
  language,
  games,
  favoriteBusyIds,
  onToggleGame,
}) {
  const t = copy[language] || copy.pt;
  const [sortBy, setSortBy] = useState("date");
  const visibleGames = useMemo(
    () => games.filter(isTodayOrFutureGame),
    [games],
  );
  const sortedGames = useMemo(() => {
    const oddValue = (value) => {
      const number = Number(value);
      return Number.isFinite(number) && number > 0
        ? number
        : Number.MAX_SAFE_INTEGER;
    };

    return [...visibleGames].sort((a, b) => {
      if (sortBy === "competition") {
        return (
          String(a.competition || "").localeCompare(
            String(b.competition || ""),
            locale[language] || "pt-BR",
          ) || compareDateAndTime(a, b)
        );
      }
      if (sortBy === "homeOdd")
        return oddValue(a.homeOdd) - oddValue(b.homeOdd) || compareDateAndTime(a, b);
      if (sortBy === "awayOdd")
        return oddValue(a.awayOdd) - oddValue(b.awayOdd) || compareDateAndTime(a, b);
      if (sortBy === "overOdd")
        return oddValue(a.over25Odd) - oddValue(b.over25Odd) || compareDateAndTime(a, b);
      if (sortBy === "underOdd")
        return oddValue(a.under25Odd) - oddValue(b.under25Odd) || compareDateAndTime(a, b);
      return compareDateAndTime(a, b);
    });
  }, [visibleGames, sortBy, language]);

  return (
    <FeatureShell
      title={t.myGamesTitle}
      subtitle={t.myGamesSubtitle}
      icon={<Star size={27} fill="currentColor" />}
      t={t}
    >
      <div className="my-games-toolbar">
        <label>
          <span>{t.sortBy}</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="competition">{t.sortChampionship}</option>
            <option value="date">{t.sortDate}</option>
            <option value="homeOdd">{t.sortHomeOdd}</option>
            <option value="awayOdd">{t.sortAwayOdd}</option>
            <option value="overOdd">{t.sortOverOdd}</option>
            <option value="underOdd">{t.sortUnderOdd}</option>
          </select>
        </label>
      </div>
      {sortedGames.length ? (
        <div className="feature-games-grid my-games-grid">
          {sortedGames.map((game) => (
            <GamePreviewCard
              key={game.id}
              game={game}
              language={language}
              t={t}
              isFavorite
              onToggle={onToggleGame}
              busy={favoriteBusyIds.has(String(game.id))}
            />
          ))}
        </div>
      ) : (
        <div className="feature-empty feature-empty-large">
          <Star size={34} />
          <h3>{t.noGamesTitle}</h3>
          <p>{t.noGamesText}</p>
        </div>
      )}
    </FeatureShell>
  );
}
