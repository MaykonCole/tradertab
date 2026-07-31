import React, { useEffect, useMemo, useRef, useState } from "react";
import { Calculator, ChevronDown, Percent, RotateCcw, Trash2, TrendingUp } from "lucide-react";

const copy = {
  pt: {
    eyebrow: "Simulador de trading",
    title: "Leader Back & Lay",
    subtitle: "Simule entradas, responsabilidade, comissão e resultado antes de operar.",
    commission: "Comissão (%)",
    mode: "Modo do valor",
    stake: "Stake",
    liability: "Responsabilidade",
    amount: "Valor",
    showPercent: "Mostrar resultado em percentual sobre o valor exposto",
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
    editHint: "Defina o valor e clique em uma odd",
    stakeLabel: "Stake",
    liabilityLabel: "Responsabilidade",
    remove: "Remover entrada",
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
    showPercent: "Show outcome as a percentage of exposed value",
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
    editHint: "Set an amount and click an odd",
    stakeLabel: "Stake",
    liabilityLabel: "Liability",
    remove: "Remove entry",
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
    showPercent: "Mostrar resultado en porcentaje sobre el valor expuesto",
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
    editHint: "Define el valor y haz clic en una cuota",
    stakeLabel: "Stake",
    liabilityLabel: "Responsabilidad",
    remove: "Eliminar entrada",
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
const STORAGE_KEY = "tradertab-leader-settings-v4";
const LEGACY_STORAGE_KEY = "tradertab-leader-settings-v3";
const DEFAULT_COLUMNS = ["lay", "odds", "back", "result"];

const columnWidth = (column) => column === "result" ? "100px" : column === "odds" ? "58px" : "78px";

function loadSettings() {
  try {
    const currentRaw = localStorage.getItem(STORAGE_KEY);
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    const stored = JSON.parse(currentRaw || legacyRaw || "{}");
    const validColumns = Array.isArray(stored.columns)
      && stored.columns.length === DEFAULT_COLUMNS.length
      && DEFAULT_COLUMNS.every((column) => stored.columns.includes(column));
    return {
      commission: typeof stored.commission === "string" ? stored.commission : "0",
      mode: stored.mode === "liability" ? "liability" : "stake",
      amount: typeof stored.amount === "string" ? stored.amount : "100",
      showPercent: Boolean(stored.showPercent),
      columns: validColumns
        ? (currentRaw ? stored.columns : [...stored.columns.filter((column) => column !== "result"), "result"])
        : DEFAULT_COLUMNS,
    };
  } catch {
    return { commission: "0", mode: "stake", amount: "100", showPercent: false, columns: DEFAULT_COLUMNS };
  }
}
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const money = (value) => currency.format(Math.abs(value) < 0.005 ? 0 : value);
const oddText = (value) => value < 10 ? value.toFixed(2).replace(".", ",") : value.toFixed(value % 1 ? 1 : 0).replace(".", ",");

export default function LeaderPage({ language = "pt" }) {
  const t = copy[language] || copy.pt;
  const initialSettings = useMemo(() => loadSettings(), []);
  const [commission, setCommission] = useState(initialSettings.commission);
  const [mode, setMode] = useState(initialSettings.mode);
  const [amount, setAmount] = useState(initialSettings.amount);
  const [showPercent, setShowPercent] = useState(initialSettings.showPercent);
  const [columns, setColumns] = useState(initialSettings.columns);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [entries, setEntries] = useState([]);
  const ladderRef = useRef(null);

  useEffect(() => {
    const target = ladderRef.current?.querySelector('[data-odd="2"]');
    target?.scrollIntoView({ block: "center" });
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ commission, mode, amount, showPercent, columns }));
  }, [commission, mode, amount, showPercent, columns]);

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
    entries.forEach((entry) => {
      exposed += entry.side === "back" ? entry.stake : entry.liability;
      if (entry.side === "back") {
        win += entry.stake * (entry.odds - 1);
        lose -= entry.stake;
      } else {
        win -= entry.liability;
        lose += entry.stake;
      }
    });
    return { win, lose, exposed };
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
    if (!showPercent) return money(value);
    const percent = totals.exposed > 0 ? (value / totals.exposed) * 100 : 0;
    return `${percent > 0 ? "+" : ""}${percent.toFixed(2).replace(".", ",")}%`;
  };

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
                {column === "odds" && <strong>{t.odds}</strong>}
                {column === "back" && <><strong>{t.back}</strong><small>{t.stakeLabel}</small></>}
              </div>
            ))}
          </div>
          <div className="leader-ladder" ref={ladderRef}>
            {ODDS.map((odds) => {
              const rowResult = hedgeResultAtOdd(odds);
              const resultClass = rowResult > 0.004 ? "positive" : rowResult < -0.004 ? "negative" : "neutral";
              const cells = {
                result: <strong className={`leader-row-result ${resultClass}`}>{resultText(rowResult)}</strong>,
                lay: <button type="button" className="leader-price lay" onClick={() => addEntry("lay", odds)} aria-label={`${t.lay} ${oddText(odds)}`}><span>{oddText(odds)}</span><small>{t.lay}</small></button>,
                odds: <strong className="leader-odd">{oddText(odds)}</strong>,
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
            <label className="leader-check"><input type="checkbox" checked={showPercent} onChange={(e) => setShowPercent(e.target.checked)} /><span><Percent size={16} />{t.showPercent}</span></label>
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
