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

function App() {
  const [view, setView] = useState('rank');
  const [lang, setLang] = useState('pt');
  const t = translations[lang];

  const buckets = useMemo(() => bucketRows.map((row) => ({ ...row, ...t.buckets[row.id] })), [t]);
  const totalGoals = bucketRows.reduce((sum, item) => sum + item.goals, 0);
  const firstHalf = bucketRows.filter((b) => b.half.includes('1T')).reduce((s, b) => s + b.goals, 0);
  const secondHalf = totalGoals - firstHalf;
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
        <StatCard icon={Flame} label={t.stats.bestBlock} value={t.stats.bestBlockValue} detail={t.stats.bestBlockDetail} />
        <StatCard icon={Activity} label={t.stats.stoppage} value={t.stats.stoppageValue} detail={t.stats.stoppageDetail} />
      </section>

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
              {t.notes.map((n) => <li key={n}>{n}</li>)}
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
          <Insight key={item.title} title={item.title} tone={item.tone}>{item.text}</Insight>
        ))}
      </section>

      <BucketTable data={buckets} total={totalGoals} t={t} />
      <MatchTable t={t} lang={lang} />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
