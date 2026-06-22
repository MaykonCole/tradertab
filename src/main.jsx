import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, Clock, Flame, Goal, Trophy } from 'lucide-react';
import { bucketRows, matchRows, translations } from './data';
import './styles.css';

const languages = [
  { key: 'pt', label: 'PT', flag: '🇧🇷' },
  { key: 'en', label: 'EN', flag: '🇺🇸' },
  { key: 'es', label: 'ES', flag: '🇪🇸' }
];

const pct = (value, total, locale) => `${((value / total) * 100).toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;

function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="stat-card">
      <div className="stat-icon"><Icon size={20} /></div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </div>
  );
}

function LanguageSelector({ lang, onChange }) {
  return (
    <div className="language-selector" aria-label="Language selector">
      {languages.map((item) => (
        <button
          key={item.key}
          type="button"
          className={lang === item.key ? 'active' : ''}
          onClick={() => onChange(item.key)}
          aria-pressed={lang === item.key}
        >
          <span>{item.flag}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
}

function BarChart({ data, total, t }) {
  const max = Math.max(...data.map((d) => d.goals));
  return (
    <div className="chart-card">
      <div className="section-title">
        <div>
          <p>{t.chart.eyebrow}</p>
          <h2>{t.chart.title}</h2>
        </div>
        <span className="pill">{total} {t.goalsAnalyzed}</span>
      </div>
      <div className="bars">
        {data.map((item) => (
          <div className="bar-row" key={item.id}>
            <div className="bar-label">
              <strong>{item.label}</strong>
              <span>{item.phase}</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${(item.goals / max) * 100}%` }} />
            </div>
            <div className="bar-value">
              <b>{item.goals}</b>
              <span>{pct(item.goals, total, t.locale)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Timeline({ data, total, t }) {
  return (
    <div className="panel">
      <div className="section-title compact">
        <div>
          <p>{t.timelinePanel.eyebrow}</p>
          <h2>{t.timelinePanel.title}</h2>
        </div>
      </div>
      <div className="timeline">
        {data.map((item) => (
          <div className={`time-block ${item.goals >= 5 ? 'hot' : item.goals <= 2 ? 'cold' : ''}`} key={item.id}>
            <span className="time-top">{item.label}</span>
            <strong>{item.goals}</strong>
            <small>{pct(item.goals, total, t.locale)}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

const sumBuckets = (rows, ids) => rows
  .filter((row) => ids.includes(row.id))
  .reduce((sum, row) => sum + row.goals, 0);

function FourPeriodGoals({ data, total, t }) {
  const periods = [
    { key: 'first', goals: sumBuckets(data, ['0-15', '16-22']) },
    { key: 'second', goals: sumBuckets(data, ['23-29', '30-40', '41-45', '45+']) },
    { key: 'third', goals: sumBuckets(data, ['45-60FT', '61-67FT']) },
    { key: 'fourth', goals: sumBuckets(data, ['68-74FT', '75-85FT', '86-90FT', '90+']) }
  ];

  return (
    <section className="panel four-period-panel">
      <div className="section-title compact">
        <div>
          <p>{t.quarters.eyebrow}</p>
          <h2>{t.quarters.title}</h2>
        </div>
      </div>
      <div className="four-period-grid">
        {periods.map((period) => {
          const meta = t.quarters.periods[period.key];
          return (
            <div className="period-card" key={period.key}>
              <span>{meta.label}</span>
              <strong>{period.goals}</strong>
              <small>{t.quarters.goals} • {pct(period.goals, total, t.locale)}</small>
              <p>{meta.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function BucketTable({ data, total, t }) {
  return (
    <div className="panel table-panel">
      <div className="section-title compact">
        <div>
          <p>{t.table.eyebrow}</p>
          <h2>{t.table.title}</h2>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>{t.table.block}</th>
            <th>{t.table.moment}</th>
            <th>{t.table.time}</th>
            <th>{t.table.goals}</th>
            <th>{t.table.percent}</th>
            <th>{t.table.practical}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td><b>{item.label}</b></td>
              <td>{item.phase}</td>
              <td>{item.half}</td>
              <td><b>{item.goals}</b></td>
              <td>{pct(item.goals, total, t.locale)}</td>
              <td>{item.intent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MatchTable({ t, lang }) {
  return (
    <div className="panel table-panel">
      <div className="section-title compact">
        <div>
          <p>{t.matches.eyebrow}</p>
          <h2>{t.matches.title}</h2>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>{t.matches.date}</th>
            <th>{t.matches.group}</th>
            <th>{t.matches.match}</th>
            <th>{t.matches.goals}</th>
          </tr>
        </thead>
        <tbody>
          {matchRows.map((m) => (
            <tr key={`${m.date}-${m.teams.pt}`}>
              <td>{m.date}</td>
              <td><span className="mini-pill">{t.group} {m.group}</span></td>
              <td>{m.teams[lang]}</td>
              <td><b>{m.goals}</b></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Insight({ title, children, tone = 'default' }) {
  return (
    <div className={`insight ${tone}`}>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

const replaceTokens = (text, values) => String(text).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? `{${key}}`);

function App() {
  const [view, setView] = useState('rank');
  const [lang, setLang] = useState('pt');
  const t = translations[lang];

  const buckets = useMemo(() => bucketRows.map((row) => ({ ...row, ...t.buckets[row.id] })), [t]);
  const totalGoals = bucketRows.reduce((sum, item) => sum + item.goals, 0);
  const firstHalf = bucketRows.filter((b) => b.half.includes('1T')).reduce((s, b) => s + b.goals, 0);
  const secondHalf = totalGoals - firstHalf;
  const bestBucket = bucketRows.reduce((best, current) => current.goals > best.goals ? current : best, bucketRows[0]);
  const stoppageGoals = bucketRows.filter((b) => b.id === '45+' || b.id === '90+').reduce((sum, b) => sum + b.goals, 0);
  const postHydrationGoals = bucketRows.filter((b) => b.id === '23-29' || b.id === '68-74FT').reduce((sum, b) => sum + b.goals, 0);
  const ftOpeningGoals = bucketRows.find((b) => b.id === '45-60FT')?.goals ?? 0;
  const textValues = {
    bestLabel: t.buckets[bestBucket.id]?.label || bestBucket.id,
    bestGoals: bestBucket.goals,
    secondHalfPct: pct(secondHalf, totalGoals, t.locale),
    stoppageGoals,
    stoppagePct: pct(stoppageGoals, totalGoals, t.locale),
    postHydrationGoals,
    ftOpeningGoals
  };
  const sortedBuckets = useMemo(() => {
    if (view === 'rank') return [...buckets].sort((a, b) => b.goals - a.goals);
    return buckets;
  }, [view, buckets]);
  const avgGoals = (totalGoals / matchRows.length).toLocaleString(t.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="top-row">
            <div className="eyebrow"><Trophy size={18} /> {t.hero.eyebrow}</div>
            <LanguageSelector lang={lang} onChange={setLang} />
          </div>
          <h1>{t.hero.title}</h1>
          <p>{t.hero.description}</p>
          <div className="hero-actions">
            <button className={view === 'rank' ? 'active' : ''} onClick={() => setView('rank')}>{t.hero.rank}</button>
            <button className={view === 'timeline' ? 'active' : ''} onClick={() => setView('timeline')}>{t.hero.timeline}</button>
          </div>
        </div>
        <div className="hero-panel">
          <span>{t.hero.sample}</span>
          <strong>{matchRows.length} {t.hero.games}</strong>
          <p>{totalGoals} {t.hero.goals} • {t.hero.avg} {avgGoals} {t.hero.goalsPerGame}</p>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard icon={Goal} label={t.stats.totalGoals} value={totalGoals} detail={t.stats.completedBase} />
        <StatCard icon={Clock} label={t.stats.secondHalfGoals} value={secondHalf} detail={`${pct(secondHalf, totalGoals, t.locale)} ${t.stats.ofTotal}`} />
        <StatCard icon={Flame} label={t.stats.bestBlock} value={textValues.bestLabel} detail={replaceTokens(t.stats.bestBlockDetail, textValues)} />
        <StatCard icon={Activity} label={t.stats.stoppage} value={`${stoppageGoals} ${t.hero.goals}`} detail={t.stats.stoppageDetail} />
      </section>

      <FourPeriodGoals data={bucketRows} total={totalGoals} t={t} />

      <section className="content-grid">
        <BarChart data={sortedBuckets} total={totalGoals} t={t} />
        <div className="side-stack">
          <div className="panel">
            <div className="section-title compact">
              <div>
                <p>{t.side.eyebrow}</p>
                <h2>{t.side.title}</h2>
              </div>
            </div>
            <ul className="notes">
              {t.notes.map((n) => <li key={n}>{replaceTokens(n, textValues)}</li>)}
            </ul>
          </div>
          <div className="panel split">
            <div>
              <span>{t.split.first}</span>
              <strong>{firstHalf}</strong>
              <small>{pct(firstHalf, totalGoals, t.locale)}</small>
            </div>
            <div>
              <span>{t.split.second}</span>
              <strong>{secondHalf}</strong>
              <small>{pct(secondHalf, totalGoals, t.locale)}</small>
            </div>
          </div>
        </div>
      </section>

      <Timeline data={buckets} total={totalGoals} t={t} />

      <section className="insights-grid">
        {t.insights.map((item) => (
          <Insight key={item.title} title={item.title} tone={item.tone}>{replaceTokens(item.text, textValues)}</Insight>
        ))}
      </section>

      <BucketTable data={buckets} total={totalGoals} t={t} />
      <MatchTable t={t} lang={lang} />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
