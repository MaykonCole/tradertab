import React, { useEffect, useMemo, useRef, useState } from "react";
import { Calculator, ChevronDown, Percent, RotateCcw, Trash2, TrendingUp } from "lucide-react";

const copy = {
  pt: {
    eyebrow: "Simulador de trading",
    title: "Ladder Back & Lay",
    subtitle: "Simule entradas, responsabilidade, comissão e resultado antes de operar.",
    commission: "Comissão (%)",
    mode: "Modo do valor",
    stake: "Stake",
    liability: "Responsabilidade",
    amount: "Valor",
    showPercent: "Percentual sobre valor exposto",
    showStakePercent: "Percentual sobre valor da stake",
    clear: "Limpar simulação",
    selectionWins: "Seleção vence",
    selectionLoses: "Seleção perde",
    exposure: "Valor exposto",
    entries: "Entradas",
    noEntries: "Clique em uma odd Back ou Lay para adicionar uma entrada.",
    odds: "Odd",
    result: "P/L",
    back: "Back",
    lay: "Lay",
    ticksPercent: "Ticks %",
    oneTick: "1 Tick",
    editHint: "Defina o valor e clique em uma odd",
    stakeLabel: "Stake",
    liabilityLabel: "Responsabilidade",
    remove: "Remover entrada",
    valueAt1000: "Valor na odd 1000",
    valueAt101: "Valor na odd 1,01",
  },
  en: {
    eyebrow: "Trading simulator",
    title: "Back & Lay Ladder",
    subtitle: "Simulate entries, liability, commission and outcomes before trading.",
    commission: "Commission (%)",
    mode: "Amount mode",
    stake: "Stake",
    liability: "Liability",
    amount: "Amount",
    showPercent: "Percentage of exposed value",
    showStakePercent: "Percentage of stake value",
    clear: "Clear simulation",
    selectionWins: "Selection wins",
    selectionLoses: "Selection loses",
    exposure: "Exposed value",
    entries: "Entries",
    noEntries: "Click a Back or Lay odd to add an entry.",
    odds: "Odds",
    result: "P/L",
    back: "Back",
    lay: "Lay",
    ticksPercent: "Ticks %",
    oneTick: "1 Tick",
    editHint: "Set an amount and click an odd",
    stakeLabel: "Stake",
    liabilityLabel: "Liability",
    remove: "Remove entry",
    valueAt1000: "Value at odds 1000",
    valueAt101: "Value at odds 1.01",
  },
  es: {
    eyebrow: "Simulador de trading",
    title: "Escalera Back & Lay",
    subtitle: "Simula entradas, responsabilidad, comisión y resultados antes de operar.",
    commission: "Comisión (%)",
    mode: "Modo del valor",
    stake: "Stake",
    liability: "Responsabilidad",
    amount: "Valor",
    showPercent: "Porcentaje sobre el valor expuesto",
    showStakePercent: "Porcentaje sobre el valor de la stake",
    clear: "Limpiar simulación",
    selectionWins: "La selección gana",
    selectionLoses: "La selección pierde",
    exposure: "Valor expuesto",
    entries: "Entradas",
    noEntries: "Haz clic en una cuota Back o Lay para añadir una entrada.",
    odds: "Cuota",
    result: "P/L",
    back: "Back",
    lay: "Lay",
    ticksPercent: "Ticks %",
    oneTick: "1 Tick",
    editHint: "Define el valor y haz clic en una cuota",
    stakeLabel: "Stake",
    liabilityLabel: "Responsabilidad",
    remove: "Eliminar entrada",
    valueAt1000: "Valor en cuota 1000",
    valueAt101: "Valor en cuota 1,01",
  },
};

function createOdds() {
  const ranges = [
    [1.01, 2, 0.01], [2, 3, 0.02], [3, 4, 0.05], [4, 6, 0.1],
    [6, 10, 0.2], [10, 20, 0.5], [20, 30, 1], [30, 50, 2],
    [50, 100, 5], [100, 1000, 10],
  ];
  const values = [];
  ranges.forEach(([start, end, step], rangeIndex) => {
    for (let value = start; value <= end + 1e-9; value += step) {
      const rounded = Number(value.toFixed(2));
      if (rangeIndex > 0 && rounded === start) continue;
      values.push(rounded);
    }
  });
  return values.reverse();
}

const ODDS = createOdds();
const STORAGE_KEY = "tradertab-leader-settings-v7";
const LEGACY_STORAGE_KEY = "tradertab-leader-settings-v6";
const DEFAULT_COLUMNS = ["ticks", "lay", "back", "result"];

const columnWidth = (column) => {
  if (column === "result") return "100px";
  if (column === "ticks") return "70px";
  return "78px";
};

function loadSettings() {
  try {
    const currentRaw = localStorage.getItem(STORAGE_KEY);
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY) || localStorage.getItem("tradertab-leader-settings-v4");
    const stored = JSON.parse(currentRaw || legacyRaw || "{}");

    const migrateColumns = (columns) => {
      if (!Array.isArray(columns) || !columns.length) return DEFAULT_COLUMNS;
      const migrated = columns
        .filter((column) => DEFAULT_COLUMNS.includes(column))
        .filter((column, index, list) => list.indexOf(column) === index);
      DEFAULT_COLUMNS.forEach((column) => {
        if (!migrated.includes(column)) migrated.push(column);
      });
      return migrated;
    };

    const columns = migrateColumns(stored.columns);
    const validColumns = columns.length === DEFAULT_COLUMNS.length
      && DEFAULT_COLUMNS.every((column) => columns.includes(column));

    return {
      commission: typeof stored.commission === "string" ? stored.commission : "0",
      mode: stored.mode === "liability" ? "liability" : "stake",
      amount: typeof stored.amount === "string" ? stored.amount : "100",
      percentMode: stored.percentMode === "stake" ? "stake" : (stored.percentMode === "exposure" || stored.showPercent ? "exposure" : "none"),
      columns: validColumns ? columns : DEFAULT_COLUMNS,
    };
  } catch {
    return { commission: "0", mode: "stake", amount: "100", percentMode: "none", columns: DEFAULT_COLUMNS };
  }
}
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const money = (value) => currency.format(Math.abs(value) < 0.005 ? 0 : value);
const oddText = (value) => value < 10 ? value.toFixed(2).replace(".", ",") : value.toFixed(value % 1 ? 1 : 0).replace(".", ",");


const TICK_PERCENT_RANGES = [
  { min: 1.01, max: 1.1, value: 0.87 },
  { min: 1.1, max: 1.2, value: 0.80 },
  { min: 1.2, max: 1.3, value: 0.74 },
  { min: 1.3, max: 1.4, value: 0.68 },
  { min: 1.4, max: 1.5, value: 0.64 },
  { min: 1.5, max: 1.6, value: 0.60 },
  { min: 1.6, max: 1.7, value: 0.56 },
  { min: 1.7, max: 1.8, value: 0.53 },
  { min: 1.8, max: 1.9, value: 0.50 },
  { min: 1.9, max: 2.0, value: 0.48 },
  { min: 2.0, max: 2.2, value: 0.87 },
  { min: 2.2, max: 2.4, value: 0.80 },
  { min: 2.4, max: 2.6, value: 0.74 },
  { min: 2.6, max: 2.8, value: 0.68 },
  { min: 2.8, max: 3.0, value: 0.64 },
  { min: 3.0, max: 3.5, value: 1.38 },
  { min: 3.5, max: 4.0, value: 1.20 },
  { min: 4.0, max: 5.0, value: 1.94 },
  { min: 5.0, max: 6.0, value: 1.61 },
  { min: 6.0, max: 8.0, value: 2.44 },
  { min: 8.0, max: 10.0, value: 1.94 },
  { min: 10.0, max: 15.0, value: 3.28 },
];

function getTickPercent(odds) {
  if (odds > 15) return null;
  const match = TICK_PERCENT_RANGES.find(({ min, max }) => odds >= min && (odds < max || Math.abs(odds - max) < 1e-9));
  return match?.value ?? null;
}

function tickPercentText(odds) {
  const value = getTickPercent(odds);
  return value == null ? "—" : `${value.toFixed(2).replace(".", ",")}%`;
}

export default function LeaderPage({ language = "pt" }) {
  const t = copy[language] || copy.pt;
  const initialSettings = useMemo(() => loadSettings(), []);
  const [commission, setCommission] = useState(initialSettings.commission);
  const [mode, setMode] = useState(initialSettings.mode);
  const [amount, setAmount] = useState(initialSettings.amount);
  const [percentMode, setPercentMode] = useState(initialSettings.percentMode);
  const [columns, setColumns] = useState(initialSettings.columns);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [entries, setEntries] = useState([]);
  const ladderRef = useRef(null);

  useEffect(() => {
    const target = ladderRef.current?.querySelector('[data-odd="2"]');
    target?.scrollIntoView({ block: "center" });
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ commission, mode, amount, percentMode, columns }));
  }, [commission, mode, amount, percentMode, columns]);

  const moveColumn = (targetColumn) => {
    if (!draggedColumn || draggedColumn === targetColumn) return;
    setColumns((current) => {
      const next = current.filter((column) => column !== draggedColumn);
      next.splice(next.indexOf(targetColumn), 0, draggedColumn);
      return next;
    });
    setDraggedColumn(null);
  };

  const addEntry = (side, odds) => {
    const parsedAmount = Number(String(amount).replace(",", "."));
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0 || odds <= 1) return;
    const stake = mode === "liability" && side === "lay" ? parsedAmount / (odds - 1) : parsedAmount;
    const liability = side === "lay" ? stake * (odds - 1) : stake;
    setEntries((current) => [
      ...current,
      { id: `${Date.now()}-${Math.random()}`, side, odds, stake, liability, enteredMode: mode, enteredAmount: parsedAmount },
    ]);
  };

  const totals = useMemo(() => {
    let win = 0;
    let lose = 0;
    let exposed = 0;
    let stake = 0;
    entries.forEach((entry) => {
      exposed += entry.side === "back" ? entry.stake : entry.liability;
      stake += entry.stake;
      if (entry.side === "back") {
        win += entry.stake * (entry.odds - 1);
        lose -= entry.stake;
      } else {
        win -= entry.liability;
        lose += entry.stake;
      }
    });
    return { win, lose, exposed, stake };
  }, [entries]);

  const commissionRate = Math.min(100, Math.max(0, Number(String(commission).replace(",", ".")) || 0)) / 100;
  const applyCommission = (value) => value > 0 ? value * (1 - commissionRate) : value;

  const hedgeResultAtOdd = (odds) => {
    if (!entries.length || odds <= 1) return 0;
    const difference = totals.win - totals.lose;
    const hedgeStake = Math.abs(difference) / odds;
    const equalizedResult = difference >= 0
      ? totals.lose + hedgeStake
      : totals.lose - hedgeStake;
    return applyCommission(equalizedResult);
  };

  const resultText = (value) => {
    if (percentMode === "none") return money(value);
    const base = percentMode === "stake" ? totals.stake : totals.exposed;
    const percent = base > 0 ? (value / base) * 100 : 0;
    return `${percent > 0 ? "+" : ""}${percent.toFixed(2).replace(".", ",")}%`;
  };

  const resultClassName = (value) => value > 0.004 ? "positive" : value < -0.004 ? "negative" : "neutral";
  const valueAt1000 = hedgeResultAtOdd(1000);
  const valueAt101 = hedgeResultAtOdd(1.01);

  return (
    <main className="page leader-page">
      <section className="leader-hero">
        <div>
          <span className="leader-eyebrow"><Calculator size={16} />{t.eyebrow}</span>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
        <div className="leader-hero-badge"><TrendingUp size={19} />1,01 — 1000</div>
      </section>

      <section className="leader-layout">
        <div className="leader-ladder-card">
          <div className="leader-ladder-head" style={{ "--leader-columns": columns.map(columnWidth).join(" ") }}>
            {columns.map((column) => (
              <div
                className={`leader-column-head ${column} ${draggedColumn === column ? "dragging" : ""}`}
                key={column}
                draggable
                onDragStart={() => setDraggedColumn(column)}
                onDragEnd={() => setDraggedColumn(null)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => moveColumn(column)}
                title="Arraste para alterar a ordem"
              >
                {column === "result" && <strong>{t.result}</strong>}
                {column === "lay" && <><strong>{t.lay}</strong><small>{t.liabilityLabel}</small></>}
                {column === "ticks" && <><strong>{t.ticksPercent}</strong><small>{t.oneTick}</small></>}
                {column === "back" && <><strong>{t.back}</strong><small>{t.stakeLabel}</small></>}
              </div>
            ))}
          </div>
          <div className="leader-ladder" ref={ladderRef}>
            {ODDS.map((odds) => {
              const rowResult = hedgeResultAtOdd(odds);
              const resultClass = resultClassName(rowResult);
              const cells = {
                result: <strong className={`leader-row-result ${resultClass}`}>{resultText(rowResult)}</strong>,
                lay: <button type="button" className="leader-price lay" onClick={() => addEntry("lay", odds)} aria-label={`${t.lay} ${oddText(odds)}`}><span>{oddText(odds)}</span><small>{t.lay}</small></button>,
                ticks: <strong className={`leader-tick-percent ${getTickPercent(odds) == null ? "muted" : ""}`}>{tickPercentText(odds)}</strong>,
                back: <button type="button" className="leader-price back" onClick={() => addEntry("back", odds)} aria-label={`${t.back} ${oddText(odds)}`}><span>{oddText(odds)}</span><small>{t.back}</small></button>,
              };
              return (
                <div className="leader-ladder-row" key={odds} data-odd={odds} style={{ "--leader-columns": columns.map(columnWidth).join(" ") }}>
                  {columns.map((column) => <React.Fragment key={column}>{cells[column]}</React.Fragment>)}
                </div>
              );
            })}
          </div>
        </div>

        <div className="leader-panel">
          <section className="leader-config-card">
            <div className="leader-card-title"><div><strong>{t.editHint}</strong><span>{t.subtitle}</span></div></div>
            <div className="leader-config-grid">
              <label><span>{t.commission}</span><input type="number" min="0" max="100" step="0.1" value={commission} onChange={(e) => setCommission(e.target.value)} /></label>
              <label><span>{t.mode}</span><div className="leader-select"><select value={mode} onChange={(e) => setMode(e.target.value)}><option value="stake">{t.stake}</option><option value="liability">{t.liability}</option></select><ChevronDown size={16} /></div></label>
              <label className="leader-amount"><span>{t.amount}</span><input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
            </div>
            <div className="leader-percent-checks">
              <label className="leader-check"><input type="checkbox" checked={percentMode === "exposure"} onChange={(e) => setPercentMode(e.target.checked ? "exposure" : "none")} /><span><Percent size={16} />{t.showPercent}</span></label>
              <label className="leader-check"><input type="checkbox" checked={percentMode === "stake"} onChange={(e) => setPercentMode(e.target.checked ? "stake" : "none")} /><span><Percent size={16} />{t.showStakePercent}</span></label>
            </div>
          </section>

          <section className="leader-extremes-card" aria-label="Resultados nas odds extremas">
            <article>
              <span>{t.valueAt1000}</span>
              <strong className={resultClassName(valueAt1000)}>{resultText(valueAt1000)}</strong>
            </article>
            <article>
              <span>{t.valueAt101}</span>
              <strong className={resultClassName(valueAt101)}>{resultText(valueAt101)}</strong>
            </article>
          </section>

          <section className="leader-entries-card">
            <div className="leader-entries-head"><div><strong>{t.entries}</strong><span>{entries.length}</span><small>{t.exposure}: <b>{money(totals.exposed)}</b></small></div><button type="button" onClick={() => setEntries([])} disabled={!entries.length}><RotateCcw size={16} />{t.clear}</button></div>
            {!entries.length ? <div className="leader-empty">{t.noEntries}</div> : (
              <div className="leader-entries-list">
                {entries.map((entry) => (
                  <div className={`leader-entry ${entry.side}`} key={entry.id}>
                    <span className="leader-entry-side">{entry.side === "back" ? t.back : t.lay}</span>
                    <div><strong>{oddText(entry.odds)}</strong><small>{t.odds}</small></div>
                    <div><strong>{money(entry.stake)}</strong><small>{t.stakeLabel}</small></div>
                    <div><strong>{money(entry.liability)}</strong><small>{t.liabilityLabel}</small></div>
                    <button type="button" onClick={() => setEntries((current) => current.filter((item) => item.id !== entry.id))} aria-label={t.remove}><Trash2 size={17} /></button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
