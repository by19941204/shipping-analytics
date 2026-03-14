import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, Legend,
} from 'recharts';
import { useLanguage } from '../i18n/LanguageContext';
import { globalFleet, orderbook, fleetGrowth } from '../data/marketData';
import Breadcrumbs from '../components/Breadcrumbs';

const SEGMENT_COLORS = {
  container: '#3b82f6',
  dryBulk: '#f59e0b',
  tanker: '#ef4444',
  lng: '#10b981',
  lpg: '#8b5cf6',
};

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: p.color || '#fff' }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
}

export default function MarketAnalysis() {
  const { t, language } = useLanguage();

  const segmentLabel = (key) => t(`market.seg.${key}`);

  // Fleet overview chart data
  const fleetChartData = globalFleet.map((s) => ({
    segment: segmentLabel(s.segment),
    vessels: s.vessels,
    growth: s.growth,
  }));

  // Orderbook chart data
  const orderbookData = orderbook.map((o) => ({
    year: String(o.year),
    [segmentLabel('container')]: o.container,
    [segmentLabel('dryBulk')]: o.dryBulk,
    [segmentLabel('tanker')]: o.tanker,
    [segmentLabel('lng')]: o.lng,
  }));

  // Fleet growth chart data
  const growthData = fleetGrowth.map((g) => ({
    year: String(g.year),
    deliveries: g.deliveries,
    demolitions: g.demolitions,
    netGrowth: g.netGrowth,
  }));

  // Total fleet vessels
  const totalVessels = globalFleet.reduce((s, f) => s + f.vessels, 0);
  // Total orderbook
  const totalOrders = orderbook.reduce((s, o) => s + o.container + o.dryBulk + o.tanker + o.lng, 0);
  // Orderbook as % of fleet
  const orderbookPct = ((totalOrders / totalVessels) * 100).toFixed(1);
  // Latest net growth
  const latestGrowth = fleetGrowth[fleetGrowth.length - 1].netGrowth;

  return (
    <div className="min-h-screen bg-[#0b0e17] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[
          { label: t('breadcrumb.home'), path: '/' },
          { label: t('market.title'), path: '/market-analysis' },
        ]} />

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{t('market.title')}</h1>
          <p className="text-slate-400 mt-1">{t('market.subtitle')}</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl border border-slate-800/60 bg-[#111827] p-4">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">{t('market.totalFleet')}</p>
            <p className="mt-1 text-2xl font-bold text-white">{totalVessels.toLocaleString()}</p>
            <p className="text-xs text-slate-500">{t('company.vessels')}</p>
          </div>
          <div className="rounded-xl border border-slate-800/60 bg-[#111827] p-4">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">{t('market.totalOrders')}</p>
            <p className="mt-1 text-2xl font-bold text-amber-400">{totalOrders.toLocaleString()}</p>
            <p className="text-xs text-slate-500">{t('company.vessels')}</p>
          </div>
          <div className="rounded-xl border border-slate-800/60 bg-[#111827] p-4">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">{t('market.orderbookRatio')}</p>
            <p className="mt-1 text-2xl font-bold text-blue-400">{orderbookPct}%</p>
            <p className="text-xs text-slate-500">{t('market.ofFleet')}</p>
          </div>
          <div className="rounded-xl border border-slate-800/60 bg-[#111827] p-4">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">{t('market.netGrowth')}</p>
            <p className="mt-1 text-2xl font-bold text-emerald-400">{latestGrowth}%</p>
            <p className="text-xs text-slate-500">2026</p>
          </div>
        </div>

        {/* Section 1: Global Fleet Overview */}
        <div className="bg-[#111827] border border-slate-800/60 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">{t('market.globalFleet')}</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={fleetChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="segment" tick={{ fill: '#cbd5e1', fontSize: 11 }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="vessels" name={t('company.vessels')} radius={[4, 4, 0, 0]} maxBarSize={56}>
                {fleetChartData.map((_, i) => {
                  const seg = globalFleet[i].segment;
                  return <rect key={i} fill={SEGMENT_COLORS[seg]} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Growth badges */}
          <div className="flex flex-wrap gap-3 mt-4">
            {globalFleet.map((s) => (
              <div key={s.segment} className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: SEGMENT_COLORS[s.segment] }} />
                <span className="text-slate-300">{segmentLabel(s.segment)}</span>
                <span className="text-xs text-emerald-400">+{s.growth}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Orderbook Pipeline */}
        <div className="bg-[#111827] border border-slate-800/60 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">{t('market.orderbook')}</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={orderbookData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" tick={{ fill: '#cbd5e1', fontSize: 11 }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              <Bar dataKey={segmentLabel('container')} fill={SEGMENT_COLORS.container} radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey={segmentLabel('dryBulk')} fill={SEGMENT_COLORS.dryBulk} radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey={segmentLabel('tanker')} fill={SEGMENT_COLORS.tanker} radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey={segmentLabel('lng')} fill={SEGMENT_COLORS.lng} radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Section 3: Fleet Growth */}
        <div className="bg-[#111827] border border-slate-800/60 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">{t('market.fleetGrowth')}</h2>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={growthData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" tick={{ fill: '#cbd5e1', fontSize: 11 }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              <Line yAxisId="left" type="monotone" dataKey="deliveries" name={t('market.deliveries')} stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              <Line yAxisId="left" type="monotone" dataKey="demolitions" name={t('market.demolitions')} stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="netGrowth" name={t('market.netGrowth')} stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Section 4: Supply/Demand Balance */}
        <div className="bg-[#111827] border border-slate-800/60 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">{t('market.supplyDemand')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Supply indicator */}
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">{t('market.supplyGrowth')}</p>
              <div className="relative w-28 h-28 mx-auto">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${latestGrowth * 26.4} 264`} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">
                  {latestGrowth}%
                </span>
              </div>
            </div>

            {/* Balance gauge */}
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">{t('market.balance')}</p>
              <div className="flex flex-col items-center gap-2">
                <div className="w-full h-4 rounded-full bg-slate-800 relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full" style={{ width: '62%' }} />
                </div>
                <div className="flex justify-between w-full text-[10px] text-slate-500">
                  <span>{t('market.oversupply')}</span>
                  <span>{t('market.tight')}</span>
                </div>
                <span className="inline-flex rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400 mt-1">
                  {t('market.balanced')}
                </span>
              </div>
            </div>

            {/* Demand indicator */}
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">{t('market.demandGrowth')}</p>
              <div className="relative w-28 h-28 mx-auto">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${3.5 * 26.4} 264`} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">
                  3.5%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
