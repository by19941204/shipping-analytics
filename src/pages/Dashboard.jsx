import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Percent, Anchor, ChevronUp, ChevronDown, ArrowUpDown, Newspaper, Clock, Wifi, WifiOff, RefreshCw, Ship, ChevronRight, Users } from 'lucide-react';
import { companies as companyList, bdiHistory, bciHistory, bpiHistory, bsiHistory, bhsiHistory, scfiHistory, ccfiHistory, bunkerPriceHistory, allianceData, bunkerPricesByPort, freightRoutes } from '../data/companies';
import { useLanguage } from '../i18n/LanguageContext';
import { formatMarketCap, formatPercent, formatCurrency } from '../utils/format';
import { useStockData } from '../hooks/useStockData';
import { useNews } from '../hooks/useNews';
import Heatmap from '../components/Heatmap';
import DashboardSection from '../components/DashboardSection';
import EarningsCalendar from '../components/EarningsCalendar';

const categoryColors = {
  earnings: 'bg-emerald-500/20 text-emerald-400',
  market: 'bg-blue-500/20 text-blue-400',
  fleet: 'bg-purple-500/20 text-purple-400',
  regulation: 'bg-amber-500/20 text-amber-400',
};

function BdiTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--bg-card)]/95 backdrop-blur-sm border border-[var(--border-color)] rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-[var(--text-secondary)] mb-1">{label}</p>
      <p className="text-sm font-semibold text-[var(--text-primary)]">{payload[0].value.toLocaleString()}</p>
    </div>
  );
}

export default function Dashboard() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState('marketCap');
  const [sortDir, setSortDir] = useState('desc');
  const [bdiPeriod, setBdiPeriod] = useState('6M');
  const { companies, lastUpdated: stockLastUpdated, isLive: stockIsLive, loading: stockLoading, refresh: refreshStock } = useStockData();
  const { news: liveNews, liveCount: newsLiveCount } = useNews(language);

  const totalMarketCap = useMemo(() => companies.reduce((sum, c) => sum + c.marketCap, 0), [companies]);
  const avgPE = useMemo(() => companies.reduce((sum, c) => sum + c.peRatio, 0) / companies.length, [companies]);
  const avgDividend = useMemo(() => companies.reduce((sum, c) => sum + c.dividendYield, 0) / companies.length, [companies]);
  const latestBdi = bdiHistory[bdiHistory.length - 1]?.value ?? 0;
  const prevBdi = bdiHistory[bdiHistory.length - 2]?.value ?? latestBdi;
  const bdiChange = latestBdi - prevBdi;

  const sorted = useMemo(() => {
    return [...companies].sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];
      if (sortKey === 'name') {
        av = a.name[language];
        bv = b.name[language];
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === 'asc' ? av - bv : bv - av;
    });
  }, [companies, sortKey, sortDir, language]);

  const topGainers = useMemo(() => [...companies].sort((a, b) => b.change - a.change).slice(0, 3), [companies]);
  const topLosers = useMemo(() => [...companies].sort((a, b) => a.change - b.change).slice(0, 3), [companies]);
  const recentNews = useMemo(() => liveNews.slice(0, 4), [liveNews]);

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  function SortHeader({ label, field }) {
    const active = sortKey === field;
    return (
      <button onClick={() => handleSort(field)} className="inline-flex items-center gap-1 group hover:text-[var(--text-primary)] transition-colors">
        {label}
        {active ? (
          sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-blue-400" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-400" />
        ) : (
          <ArrowUpDown className="w-3 h-3 text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors" />
        )}
      </button>
    );
  }

  const kpiCards = [
    {
      label: t('dashboard.marketCap'),
      value: formatMarketCap(totalMarketCap, language),
      icon: DollarSign,
      color: 'text-emerald-400',
      border: 'border-l-emerald-500',
      trend: '+3.2%',
      trendUp: true,
    },
    {
      label: t('dashboard.avgPE'),
      value: avgPE.toFixed(1) + 'x',
      icon: BarChart3,
      color: 'text-blue-400',
      border: 'border-l-blue-500',
      trend: '-0.4',
      trendUp: false,
    },
    {
      label: t('dashboard.avgDividend'),
      value: avgDividend.toFixed(1) + '%',
      icon: Percent,
      color: 'text-amber-400',
      border: 'border-l-amber-500',
      trend: '+0.2%',
      trendUp: true,
    },
    {
      label: t('dashboard.bdiIndex'),
      value: latestBdi.toLocaleString(),
      icon: Anchor,
      color: 'text-purple-400',
      border: 'border-l-purple-500',
      trend: (bdiChange >= 0 ? '+' : '') + bdiChange.toFixed(0),
      trendUp: bdiChange >= 0,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">{t('dashboard.title')}</h1>
              <p className="text-[var(--text-secondary)] mt-1">{t('dashboard.subtitle')}</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Live data status */}
              <div className="flex items-center gap-2 text-xs">
                {stockIsLive ? (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                    <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
                    {t('news.live')}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-card)]/10 text-[var(--text-muted)]">
                    <WifiOff className="w-3 h-3" />
                    {t('news.static')}
                  </span>
                )}
              </div>
              {stockLastUpdated && (
                <span className="text-xs text-[var(--text-muted)]">
                  {t('common.lastUpdated')}: {stockLastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={refreshStock}
                disabled={stockLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--bg-card)]/50 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]/50 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${stockLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className={`bg-[var(--bg-card)] border border-[var(--border-color)] ${card.border} border-l-4 rounded-xl p-5 hover:bg-[var(--bg-card-hover)] transition-colors duration-200`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">{card.label}</span>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div className="text-2xl font-bold text-[var(--text-primary)]">{card.value}</div>
                <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${card.trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
                  {card.trendUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {card.trend}
                </div>
              </div>
            );
          })}
        </div>

        {/* Freight Indices */}
        <DashboardSection title={t('dashboard.freightIndices')} defaultOpen={false} storageKey="freightIndices">
        {(() => {
          const periodDays = bdiPeriod === '1M' ? 30 : bdiPeriod === '3M' ? 90 : 180;
          const bdiChartData = bdiHistory.slice(-periodDays);
          const latestBci = bciHistory[bciHistory.length - 1]?.value ?? 0;
          const latestBpi = bpiHistory[bpiHistory.length - 1]?.value ?? 0;
          const latestBsi = bsiHistory[bsiHistory.length - 1]?.value ?? 0;
          const latestBhsi = bhsiHistory[bhsiHistory.length - 1]?.value ?? 0;
          return (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">{t('dashboard.bdiIndex')}</h2>
                <div className="flex items-center gap-1.5">
                  {['1M', '3M', '6M'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setBdiPeriod(p)}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                        bdiPeriod === p ? 'bg-blue-500/20 text-blue-400' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-card)]/50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-[var(--text-secondary)]">{periodDays}{t('indices.dayTrend')}</p>
                <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)]">
                  <span>BCI {latestBci.toLocaleString()}</span>
                  <span>BPI {latestBpi.toLocaleString()}</span>
                  <span>BSI {latestBsi.toLocaleString()}</span>
                  <span>BHSI {latestBhsi.toLocaleString()}</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute top-2 right-2 z-10 bg-blue-500/15 border border-blue-500/30 rounded-lg px-3 py-1.5">
                  <p className="text-[10px] text-blue-400/70 uppercase tracking-wider">{t('indices.latest')}</p>
                  <p className="text-lg font-bold text-blue-400">{latestBdi.toLocaleString()}</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={bdiChartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="bdiGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                        <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      tickFormatter={(val) => val.slice(5)}
                      interval="preserveStartEnd"
                      axisLine={{ stroke: '#1e293b' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip content={<BdiTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#bdiGradient)"
                      dot={false}
                      activeDot={{ r: 4, fill: '#3b82f6', stroke: '#0f1221', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })()}

        {/* Freight Indices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            { title: 'SCFI', subtitle: t('indices.scfi'), data: scfiHistory, color: '#10b981', gradientId: 'scfiGrad' },
            { title: 'CCFI', subtitle: t('indices.ccfi'), data: ccfiHistory, color: '#6366f1', gradientId: 'ccfiGrad' },
          ].map((idx) => {
            const latest = idx.data[idx.data.length - 1]?.value ?? 0;
            const prev = idx.data[idx.data.length - 2]?.value ?? latest;
            const diff = latest - prev;
            const weekAgo = idx.data[idx.data.length - 8]?.value ?? latest;
            const weekDiff = latest - weekAgo;
            const weekPct = weekAgo !== 0 ? ((weekDiff / weekAgo) * 100) : 0;
            return (
              <div key={idx.title} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">{idx.title}</h3>
                    <p className="text-[10px] text-[var(--text-muted)]">{idx.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-[var(--text-primary)]">{latest.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${diff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {diff >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {diff >= 0 ? '+' : ''}{diff.toFixed(0)}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">|</span>
                    <span className={`text-[10px] font-medium ${weekDiff >= 0 ? 'text-emerald-400/70' : 'text-red-400/70'}`}>
                      {t('indices.weekChange')} {weekDiff >= 0 ? '+' : ''}{weekPct.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={130}>
                  <AreaChart data={idx.data.slice(-90)} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id={idx.gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={idx.color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={idx.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" hide />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        return (
                          <div className="bg-[var(--bg-card)]/95 backdrop-blur-sm border border-[var(--border-color)] rounded-lg px-3 py-2 shadow-xl">
                            <p className="text-xs text-[var(--text-secondary)] mb-1">{label}</p>
                            <p className="text-sm font-semibold text-[var(--text-primary)]">{payload[0].value.toLocaleString()}</p>
                          </div>
                        );
                      }}
                    />
                    <Area type="monotone" dataKey="value" stroke={idx.color} strokeWidth={2} fill={`url(#${idx.gradientId})`} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>
        </DashboardSection>

        {/* Bunker Fuel Section */}
        <DashboardSection title={t('dashboard.bunkerFuel')} defaultOpen={false} storageKey="bunkerFuel">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bunker VLSFO Chart - Enlarged */}
          {(() => {
            const latestBunker = bunkerPriceHistory[bunkerPriceHistory.length - 1]?.value ?? 0;
            const prevBunker = bunkerPriceHistory[bunkerPriceHistory.length - 2]?.value ?? latestBunker;
            const bunkerDiff = latestBunker - prevBunker;
            const avgValue = Math.round(bunkerPriceHistory.reduce((s, d) => s + d.value, 0) / bunkerPriceHistory.length);
            const chartData = bunkerPriceHistory.map(d => ({ ...d, avg: avgValue }));
            return (
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-semibold text-[var(--text-primary)]">{t('dashboard.vlsfo')}</h3>
                  <div className="text-right">
                    <span className="text-xl font-bold text-[var(--text-primary)]">${latestBunker}</span>
                    <span className={`ml-2 text-xs font-medium ${bunkerDiff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {bunkerDiff >= 0 ? '+' : ''}{bunkerDiff.toFixed(0)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)] mb-3">
                  {t('dashboard.bunkerChartSubtitle')}
                </p>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="bunkerGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: '#64748b', fontSize: 10 }}
                      tickFormatter={(val) => val.slice(5)}
                      interval="preserveStartEnd"
                      axisLine={{ stroke: '#1e293b' }}
                      tickLine={false}
                    />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        return (
                          <div className="bg-[var(--bg-card)]/95 backdrop-blur-sm border border-[var(--border-color)] rounded-lg px-3 py-2 shadow-xl">
                            <p className="text-xs text-[var(--text-secondary)] mb-1">{label}</p>
                            <p className="text-sm font-semibold text-amber-400">VLSFO: ${payload[0].value}</p>
                            {payload[1] && <p className="text-xs text-[var(--text-secondary)]">{t('dashboard.avgLine')}: ${payload[1].value}</p>}
                          </div>
                        );
                      }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} fill="url(#bunkerGrad)" dot={false} />
                    <Area type="monotone" dataKey="avg" stroke="#64748b" strokeWidth={1} strokeDasharray="4 4" fill="none" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            );
          })()}

          {/* Bunker Prices by Port - Enhanced Table */}
          {(() => {
            const ports = Object.entries(bunkerPricesByPort);
            const minVlsfo = Math.min(...ports.map(([, d]) => d.vlsfo));
            const maxVlsfo = Math.max(...ports.map(([, d]) => d.vlsfo));
            const minMgo = Math.min(...ports.map(([, d]) => d.mgo));
            const maxMgo = Math.max(...ports.map(([, d]) => d.mgo));
            const minHsfo = Math.min(...ports.map(([, d]) => d.hsfo));
            const maxHsfo = Math.max(...ports.map(([, d]) => d.hsfo));
            return (
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">{t('dashboard.bunkerByPort')}</h3>
                <p className="text-xs text-[var(--text-muted)] mb-3">$/mt</p>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <thead>
                      <tr className="text-xs text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-color)]">
                        <th className="text-left pb-2 pr-4">{t('dashboard.port')}</th>
                        <th className="text-right pb-2 px-3">{t('dashboard.vlsfo')}</th>
                        <th className="text-right pb-2 px-3">{t('dashboard.mgo')}</th>
                        <th className="text-right pb-2 px-3">{t('dashboard.hsfo')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ports.map(([key, data]) => (
                        <tr key={key} className="border-b border-[var(--border-color)] hover:bg-white/[0.02]">
                          <td className="py-2 pr-4 text-sm font-medium text-[var(--text-primary)] whitespace-nowrap">
                            <span className="mr-1.5">{data.flag}</span>
                            {data.port[language]}
                          </td>
                          <td className={`py-2 px-3 text-right text-sm font-mono ${data.vlsfo === minVlsfo ? 'text-emerald-400 font-semibold bg-emerald-500/5' : data.vlsfo === maxVlsfo ? 'text-red-400' : 'text-[var(--text-primary)]'}`}>
                            ${data.vlsfo}
                            {data.vlsfo === maxVlsfo && <span className="ml-1 text-xs">{'\u2191'}</span>}
                            {data.vlsfo === minVlsfo && <span className="ml-1 text-xs">{'\u2193'}</span>}
                          </td>
                          <td className={`py-2 px-3 text-right text-sm font-mono ${data.mgo === minMgo ? 'text-emerald-400 font-semibold bg-emerald-500/5' : data.mgo === maxMgo ? 'text-red-400' : 'text-[var(--text-primary)]'}`}>
                            ${data.mgo}
                            {data.mgo === maxMgo && <span className="ml-1 text-xs">{'\u2191'}</span>}
                            {data.mgo === minMgo && <span className="ml-1 text-xs">{'\u2193'}</span>}
                          </td>
                          <td className={`py-2 px-3 text-right text-sm font-mono ${data.hsfo === minHsfo ? 'text-emerald-400 font-semibold bg-emerald-500/5' : data.hsfo === maxHsfo ? 'text-red-400' : 'text-[var(--text-primary)]'}`}>
                            ${data.hsfo}
                            {data.hsfo === maxHsfo && <span className="ml-1 text-xs">{'\u2191'}</span>}
                            {data.hsfo === minHsfo && <span className="ml-1 text-xs">{'\u2193'}</span>}
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t border-[var(--border-color)]">
                        <td className="py-2 pr-4 text-xs font-semibold text-[var(--text-secondary)] uppercase">{t('dashboard.spread')}</td>
                        <td className="py-2 px-3 text-right text-xs font-mono text-[var(--text-secondary)]">${maxVlsfo - minVlsfo}</td>
                        <td className="py-2 px-3 text-right text-xs font-mono text-[var(--text-secondary)]">${maxMgo - minMgo}</td>
                        <td className="py-2 px-3 text-right text-xs font-mono text-[var(--text-secondary)]">${maxHsfo - minHsfo}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
        </DashboardSection>

        {/* Freight Route Rates */}
        <DashboardSection title={t('dashboard.freightRoutes')} defaultOpen={false} storageKey="freightRoutes">
        {(() => {
          const routeGroups = [
            { type: 'container', label: t('indices.containerRoutes'), color: '#3b82f6', icon: 'C' },
            { type: 'dryBulk', label: t('indices.dryBulk'), color: '#10b981', icon: 'D' },
            { type: 'tanker', label: t('indices.tanker'), color: '#f59e0b', icon: 'T' },
          ];
          return (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                {t('dashboard.keyFreightRoutes')}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mb-5">
                {t('dashboard.freightRoutesSubtitle')}
              </p>
              <div className="space-y-5">
                {routeGroups.map((group) => {
                  const routes = freightRoutes.filter((r) => r.type === group.type);
                  if (routes.length === 0) return null;
                  return (
                    <div key={group.type}>
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-[var(--text-primary)]"
                          style={{ backgroundColor: group.color + '30', color: group.color }}
                        >
                          {group.icon}
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: group.color }}>
                          {group.label}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">
                          {group.type === 'container' ? '$/FEU' : group.type === 'dryBulk' ? '$/day' : 'Worldscale'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {routes.map((route) => {
                          const changePct = route.rate !== 0 ? ((route.change / route.rate) * 100) : 0;
                          return (
                            <div
                              key={route.id}
                              className="bg-[var(--bg-primary)]/50 border rounded-lg p-3 transition-colors hover:bg-[var(--bg-card-hover)]/40"
                              style={{ borderColor: route.change >= 0 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' }}
                            >
                              <p className="text-xs text-[var(--text-secondary)] mb-1.5 line-clamp-1">{route.name[language]}</p>
                              <div className="flex items-end justify-between">
                                <div>
                                  <span className="text-lg font-bold text-[var(--text-primary)]">{route.rate.toLocaleString()}</span>
                                  <span className="text-[10px] text-[var(--text-muted)] ml-1">{route.unit}</span>
                                </div>
                                <div className="text-right">
                                  <span className={`text-xs font-semibold ${route.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {route.change >= 0 ? '+' : ''}{route.change.toLocaleString()}
                                  </span>
                                  <span className={`block text-[10px] ${route.change >= 0 ? 'text-emerald-400/60' : 'text-red-400/60'}`}>
                                    {route.change >= 0 ? '+' : ''}{changePct.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
        </DashboardSection>

        {/* Market Heatmap */}
        <DashboardSection title={t('dashboard.heatmap')} defaultOpen={true} storageKey="heatmap">
          <Heatmap />
        </DashboardSection>

        {/* Stock Overview Table */}
        <DashboardSection title={t('dashboard.stockOverview')} defaultOpen={true} storageKey="stockOverview">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 mb-8 overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="text-xs text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-color)]">
                <th className="text-left pb-3 pr-4"><SortHeader label={t('dashboard.company')} field="name" /></th>
                <th className="text-left pb-3 pr-4">{t('dashboard.ticker')}</th>
                <th className="text-right pb-3 pr-4"><SortHeader label={t('company.stockPrice')} field="stockPrice" /></th>
                <th className="text-right pb-3 pr-4"><SortHeader label={t('dashboard.change')} field="change" /></th>
                <th className="text-right pb-3 pr-4"><SortHeader label={t('company.marketCap')} field="marketCap" /></th>
                <th className="text-right pb-3 pr-4"><SortHeader label={t('company.peRatio')} field="peRatio" /></th>
                <th className="text-right pb-3"><SortHeader label={t('company.dividendYield')} field="dividendYield" /></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((company) => (
                  <tr
                    key={company.id}
                    onClick={() => navigate(`/company/${company.id}`)}
                    className="border-b border-[var(--border-color)] hover:bg-white/[0.03] transition-colors duration-150 cursor-pointer"
                  >
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{company.logo}</span>
                        <span className="font-medium text-[var(--text-primary)] text-sm">{company.name[language]}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-sm text-[var(--text-secondary)] font-mono">{company.ticker}</td>
                    <td className="py-3.5 pr-4 text-right text-sm font-medium text-[var(--text-primary)]">{formatCurrency(company.stockPrice, company.currency)}</td>
                    <td className="py-3.5 pr-4 text-right">
                      <span className={`inline-flex items-center gap-1 text-sm font-medium ${company.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {company.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {formatPercent(company.change)}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-right text-sm text-[var(--text-primary)]">{formatMarketCap(company.marketCap, language)}</td>
                    <td className="py-3.5 pr-4 text-right text-sm text-[var(--text-primary)]">{company.peRatio.toFixed(1)}</td>
                    <td className="py-3.5 text-right text-sm text-[var(--text-primary)]">{company.dividendYield.toFixed(1)}%</td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
        </DashboardSection>

        {/* Alliance Market Share */}
        <DashboardSection title={t('dashboard.allianceShare')} defaultOpen={false} storageKey="allianceShare">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">{t('indices.allianceOverview')}</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {t('dashboard.allianceDistribution')}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Ship className="w-4 h-4" />
              <span>{t('fleet.total')}: {(allianceData.reduce((s, a) => s + (a.teuCapacity || 0), 0) / 1e6).toFixed(1)}M TEU</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Pie Chart with Custom Legend */}
            <div className="w-full lg:w-2/5 flex flex-col items-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={allianceData.map(a => ({
                      ...a,
                      label: typeof a.name === 'object' ? a.name[language] || a.name.en : a.name,
                    }))}
                    dataKey="marketShare"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={115}
                    paddingAngle={3}
                    stroke="rgba(15,18,33,0.8)"
                    strokeWidth={2}
                  >
                    {allianceData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} className="drop-shadow-lg" />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[var(--bg-card)]/95 backdrop-blur-sm border border-[var(--border-color)] rounded-lg px-4 py-3 shadow-xl">
                          <p className="text-sm font-semibold text-[var(--text-primary)]">{payload[0].name}</p>
                          <p className="text-xs text-[var(--text-secondary)] mt-1">{payload[0].value}% {t('dashboard.marketShare')}</p>
                          {d.teuCapacity && <p className="text-xs text-[var(--text-secondary)]">{(d.teuCapacity / 1e6).toFixed(1)}M TEU</p>}
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend below chart */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2">
                {allianceData.map((a, i) => {
                  const displayName = typeof a.name === 'object' ? a.name[language] || a.name.en : a.name;
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                      <span className="text-xs text-[var(--text-primary)] truncate">{displayName}</span>
                      <span className="text-xs font-semibold ml-auto" style={{ color: a.color }}>{a.marketShare}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Alliance Detail Cards */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allianceData.map((a, i) => {
                const displayName = typeof a.name === 'object' ? a.name[language] || a.name.en : a.name;
                const routes = typeof a.routes === 'object' ? a.routes[language] || a.routes.en : a.routes || '';
                // Get logos for member companies
                const memberCompanies = (a.companyIds || []).map(cid => companyList.find(c => c.id === cid)).filter(Boolean);
                const totalVessels = memberCompanies.reduce((s, c) => s + c.vessels, 0);
                return (
                  <div
                    key={i}
                    className="rounded-xl border bg-[var(--bg-primary)]/40 p-4 transition-all duration-200 hover:bg-[var(--bg-card-hover)]/40"
                    style={{ borderColor: a.color + '30' }}
                  >
                    {/* Alliance header */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-[var(--text-primary)] shrink-0" style={{ backgroundColor: a.color + '25', color: a.color }}>
                        {a.marketShare}%
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">{displayName}</h3>
                        <p className="text-[10px] text-[var(--text-muted)] truncate">{routes}</p>
                      </div>
                    </div>

                    {/* Member logos row */}
                    <div className="flex items-center gap-1.5 mb-3">
                      {memberCompanies.map((mc) => (
                        <Link
                          key={mc.id}
                          to={`/company/${mc.id}`}
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[var(--bg-card)]/60 hover:bg-[var(--bg-card-hover)]/60 transition-colors"
                          title={mc.name[language]}
                        >
                          <span className="text-sm">{mc.logo}</span>
                          <span className="text-[9px] text-[var(--text-secondary)] hidden sm:inline">{mc.ticker.split('.')[0]}</span>
                        </Link>
                      ))}
                      {a.members.filter(m => !(a.companyIds || []).some(cid => {
                        const co = companyList.find(c => c.id === cid);
                        return co && m.includes(co.name.en.split(' ')[0]);
                      })).map((m, j) => (
                        <span key={j} className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--bg-card)]/60 text-[var(--text-muted)]">{m}</span>
                      ))}
                    </div>

                    {/* KPI row */}
                    <div className="grid grid-cols-3 gap-2">
                      {a.teuCapacity && (
                        <div className="text-center py-1.5 rounded-lg bg-[var(--bg-card)]/40">
                          <p className="text-xs font-bold text-[var(--text-primary)]">{(a.teuCapacity / 1e6).toFixed(1)}M</p>
                          <p className="text-[9px] text-[var(--text-muted)]">TEU</p>
                        </div>
                      )}
                      <div className="text-center py-1.5 rounded-lg bg-[var(--bg-card)]/40">
                        <p className="text-xs font-bold text-[var(--text-primary)]">{totalVessels > 0 ? totalVessels.toLocaleString() : '--'}</p>
                        <p className="text-[9px] text-[var(--text-muted)]">{t('company.vessels')}</p>
                      </div>
                      <div className="text-center py-1.5 rounded-lg bg-[var(--bg-card)]/40">
                        <p className="text-xs font-bold text-[var(--text-primary)]">{a.services}</p>
                        <p className="text-[9px] text-[var(--text-muted)]">{t('dashboard.services')}</p>
                      </div>
                    </div>

                    {/* Market share bar */}
                    <div className="mt-3">
                      <div className="h-1.5 w-full rounded-full bg-[var(--bg-card)]">
                        <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${a.marketShare}%`, backgroundColor: a.color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        </DashboardSection>

        {/* Movers & News */}
        <DashboardSection title={t('dashboard.moversNews')} defaultOpen={true} storageKey="moversNews">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Top Gainers */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">{t('dashboard.topGainers')}</h2>
            </div>
            <div className="space-y-3">
              {topGainers.map((company, i) => (
                <Link
                  key={company.id}
                  to={`/company/${company.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-400 w-5">#{i + 1}</span>
                    <span className="text-lg">{company.logo}</span>
                    <div>
                      <div className="font-medium text-sm text-[var(--text-primary)]">{company.name[language]}</div>
                      <div className="text-xs text-[var(--text-secondary)] font-mono">{company.ticker}</div>
                    </div>
                  </div>
                  <span className="text-emerald-400 font-semibold text-sm">{formatPercent(company.change)}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Losers */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">{t('dashboard.topLosers')}</h2>
            </div>
            <div className="space-y-3">
              {topLosers.map((company, i) => (
                <Link
                  key={company.id}
                  to={`/company/${company.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-red-400 w-5">#{i + 1}</span>
                    <span className="text-lg">{company.logo}</span>
                    <div>
                      <div className="font-medium text-sm text-[var(--text-primary)]">{company.name[language]}</div>
                      <div className="text-xs text-[var(--text-secondary)] font-mono">{company.ticker}</div>
                    </div>
                  </div>
                  <span className="text-red-400 font-semibold text-sm">{formatPercent(company.change)}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent News */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">{t('dashboard.recentNews')}</h2>
            </div>
            <Link to="/news" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              {t('news.readMore')} &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentNews.map((item) => {
              const title = typeof item.title === 'object' ? item.title[language] || item.title.en : item.title;
              const Wrapper = item.link ? 'a' : Link;
              const wrapperProps = item.link
                ? { href: item.link, target: '_blank', rel: 'noopener noreferrer' }
                : { to: '/news' };
              return (
                <Wrapper
                  key={item.id}
                  {...wrapperProps}
                  className="block p-4 rounded-lg bg-[var(--bg-primary)]/50 border border-[var(--border-color)] hover:border-[var(--border-color)] hover:bg-[var(--bg-card-hover)]/30 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${categoryColors[item.category] || 'bg-[var(--bg-card)]/20 text-[var(--text-secondary)]'}`}>
                      {t(`news.${item.category}`)}
                    </span>
                    {!item.isStatic && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500">{t('news.live')}</span>
                    )}
                    <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-[var(--text-primary)] leading-snug mb-2 line-clamp-2">{title}</h3>
                  <p className="text-xs text-[var(--text-muted)]">{item.source}</p>
                </Wrapper>
              );
            })}
          </div>
        </div>
        </DashboardSection>

        {/* Upcoming Events */}
        <DashboardSection title={t('dashboard.upcomingEvents')} defaultOpen={true} storageKey="upcomingEvents">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
          <EarningsCalendar />
        </div>
        </DashboardSection>
      </div>
    </div>
  );
}
