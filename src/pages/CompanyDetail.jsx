import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts';
import { ArrowLeft, ExternalLink, Ship, Anchor, Globe, Users, Calendar, Building2, Package, Gauge, ClipboardList, Clock, Shield } from 'lucide-react';
import { companies, newsData, fleetByType, shipTypes } from '../data/companies';
import { esgData } from '../data/esgData';
import { useLanguage } from '../i18n/LanguageContext';
import Breadcrumbs from '../components/Breadcrumbs';
import WatchlistButton from '../components/WatchlistButton';
import { formatMarketCap, formatPercent, formatCurrency, formatNumber } from '../utils/format';
import StockChart from '../components/StockChart';
import { earningsCalendar } from '../data/earningsData';

const countryFlags = {
  JP: '\u{1F1EF}\u{1F1F5}',
  DK: '\u{1F1E9}\u{1F1F0}',
  CN: '\u{1F1E8}\u{1F1F3}',
  TW: '\u{1F1F9}\u{1F1FC}',
  DE: '\u{1F1E9}\u{1F1EA}',
  IL: '\u{1F1EE}\u{1F1F1}',
  KR: '\u{1F1F0}\u{1F1F7}',
};

const sectorKeys = {
  container: 'sectorContainer',
  diversified: 'sectorDiversified',
  bulk: 'sectorBulk',
  tanker: 'sectorTanker',
};

const TABS = ['overview', 'financials', 'fleet', 'news', 'esg'];

function RevenueTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)]/95 backdrop-blur-sm px-3 py-2 shadow-xl">
      <p className="text-xs text-[var(--text-secondary)]">{label}</p>
      <p className="text-sm font-semibold text-[var(--text-primary)]">
        {formatNumber(payload[0].value)}
      </p>
    </div>
  );
}

export default function CompanyDetail() {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(() => {
    const hash = location.hash.replace('#', '');
    if (hash && TABS.includes(hash)) return hash;
    return 'overview';
  });

  // Sync tab changes to URL hash
  useEffect(() => {
    const newHash = activeTab === 'overview' ? '' : `#${activeTab}`;
    if (location.hash !== newHash && (newHash || location.hash)) {
      navigate(`${location.pathname}${newHash}`, { replace: true });
    }
  }, [activeTab, location.pathname, location.hash, navigate]);

  // Sync hash changes to tab state (e.g. browser back/forward)
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && TABS.includes(hash) && hash !== activeTab) {
      setActiveTab(hash);
    } else if (!hash && activeTab !== 'overview') {
      setActiveTab('overview');
    }
  }, [location.hash]);

  const company = companies.find((c) => c.id === id);

  if (!company) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center">
          <p className="text-4xl font-bold text-[var(--text-muted)]">404</p>
          <p className="mt-2 text-[var(--text-secondary)]">{t('company.notFound')}</p>
          <Link
            to="/companies"
            className="mt-4 inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
          >
            <ArrowLeft className="h-4 w-4" /> {t('company.backToCompanies')}
          </Link>
        </div>
      </div>
    );
  }

  const isPositive = company.change >= 0;
  const companyNews = newsData.filter((n) => n.companyId === company.id);

  const tabLabels = {
    overview: t('company.overview'),
    financials: t('company.financials'),
    fleet: t('company.fleet'),
    news: t('company.news'),
    esg: 'ESG',
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Breadcrumbs items={[
          { label: t('breadcrumb.home'), path: '/' },
          { label: t('nav.companies'), path: '/companies' },
          { label: company.name[language], path: `/company/${company.id}` },
        ]} />

        {/* Header Card */}
        <div className="mb-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            {/* Company Identity */}
            <div className="flex items-center gap-4">
              <span className="text-4xl">{company.logo}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
                    {company.name[language]}
                  </h1>
                  <WatchlistButton companyId={company.id} />
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  {company.ticker} {countryFlags[company.country]}
                </p>
              </div>
            </div>

            {/* Stock Price */}
            <div className="text-left sm:text-right">
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {formatCurrency(company.stockPrice, company.currency)}
              </p>
              <span
                className={`mt-1 inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium ${
                  isPositive
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-red-500/10 text-red-400'
                }`}
              >
                {formatPercent(company.change)}
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[var(--border-color)] pt-5 sm:grid-cols-4">
            <QuickStat label={t('company.marketCap')} value={formatMarketCap(company.marketCap, language)} />
            <QuickStat label={t('company.peRatio')} value={`${company.peRatio}x`} />
            <QuickStat label={t('company.dividendYield')} value={`${company.dividendYield}%`} />
            <QuickStat label={t('company.roe')} value={`${company.roe}%`} />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-1.5">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === tab
                  ? 'bg-blue-600 text-[var(--text-primary)] shadow-lg shadow-blue-600/25'
                  : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'
              }`}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stock Chart */}
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
              <h2 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">
                {t('company.stockPrice')}
              </h2>
              <StockChart
                data={company.stockHistory}
                color={company.color}
                currency={company.currency}
                height={320}
              />
            </div>

            {/* Description */}
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
              <h2 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">{t('company.about')}</h2>
              <p className="text-sm leading-relaxed text-[var(--text-primary)]">
                {company.description[language]}
              </p>
            </div>

            {/* Key Info */}
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow icon={Calendar} label={t('company.founded')} value={company.founded} />
                <InfoRow icon={Building2} label={t('company.headquarters')} value={company.headquarters[language]} />
                <InfoRow icon={Users} label={t('company.ceo')} value={company.ceo} />
                <InfoRow icon={Users} label={t('company.employees')} value={formatNumber(company.employees)} />
                <InfoRow
                  icon={Globe}
                  label={t('company.website')}
                  value={
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"
                    >
                      {company.website.replace('https://', '')}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  }
                />
              </div>
            </div>

            {/* Key Investment Metrics */}
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
              <h2 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">{t('company.keyInvestmentMetrics')}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-[var(--bg-primary)]/50 border border-[var(--border-color)] p-4">
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{t('company.evEbitda')}</p>
                  <p className="mt-1 text-xl font-bold text-[var(--text-primary)]">
                    {((company.marketCap / (company.currency === 'JPY' || company.currency === 'KRW' ? 1e6 : 1) + company.netDebt) / company.ebitda).toFixed(1)}x
                  </p>
                  <p className="mt-1 text-[10px] text-[var(--text-muted)]">{t('company.evEbitdaDesc')}</p>
                </div>
                <div className="rounded-lg bg-[var(--bg-primary)]/50 border border-[var(--border-color)] p-4">
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{t('company.fcfYield')}</p>
                  <p className="mt-1 text-xl font-bold text-emerald-400">
                    {(company.freeCashFlow / (company.marketCap / (company.currency === 'JPY' || company.currency === 'KRW' ? 1e6 : 1)) * 100).toFixed(1)}%
                  </p>
                  <p className="mt-1 text-[10px] text-[var(--text-muted)]">{t('company.fcfYieldDesc')}</p>
                </div>
                <div className="rounded-lg bg-[var(--bg-primary)]/50 border border-[var(--border-color)] p-4">
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{t('company.dividendCoverage')}</p>
                  <p className="mt-1 text-xl font-bold text-amber-400">
                    {(company.freeCashFlow / (company.netIncome * (company.dividendYield / 100) * company.peRatio)).toFixed(1)}x
                  </p>
                  <p className="mt-1 text-[10px] text-[var(--text-muted)]">{t('company.dividendCoverageDesc')}</p>
                </div>
              </div>
            </div>

            {/* Next Event */}
            <NextEventCard companyId={company.id} t={t} language={language} />
          </div>
        )}

        {activeTab === 'financials' && (
          <div className="space-y-6">
            {/* Revenue Chart */}
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
              <h2 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">
                {t('company.quarterlyRevenue')}
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={company.revenue} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey="q"
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      axisLine={{ stroke: '#1e293b' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<RevenueTooltip />} />
                    <Bar
                      dataKey="value"
                      fill={company.color}
                      radius={[4, 4, 0, 0]}
                      maxBarSize={56}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Financial Metrics */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <MetricCard label={t('company.revenue')} value={formatNumber(company.revenue.reduce((s, r) => s + r.value, 0))} />
              <MetricCard label={t('company.netIncome')} value={formatNumber(company.netIncome)} />
              <MetricCard label={t('company.operatingIncome')} value={formatNumber(company.operatingIncome)} />
              <MetricCard label={t('company.profitMargin')} value={`${company.profitMargin}%`} />
              <MetricCard label={t('company.roe')} value={`${company.roe}%`} />
              <MetricCard label={t('company.debtEquity')} value={company.debtEquity.toFixed(2)} />
            </div>

            {/* Advanced Metrics */}
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
              <h2 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">{t('company.advancedMetrics')}</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{t('company.ebitda')}</p>
                  <p className="mt-0.5 text-lg font-bold text-[var(--text-primary)]">{formatNumber(company.ebitda)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{t('company.ebitdaMargin')}</p>
                  <p className="mt-0.5 text-lg font-bold text-[var(--text-primary)]">{company.ebitdaMargin}%</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{t('company.freeCashFlow')}</p>
                  <p className="mt-0.5 text-lg font-bold text-[var(--text-primary)]">{formatNumber(company.freeCashFlow)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{t('company.netDebt')}</p>
                  <p className="mt-0.5 text-lg font-bold text-[var(--text-primary)]">{formatNumber(company.netDebt)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{t('compare.netDebtEbitda')}</p>
                  <p className="mt-0.5 text-lg font-bold text-[var(--text-primary)]">{(company.netDebt / company.ebitda).toFixed(2)}x</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{t('company.eps')}</p>
                  <p className="mt-0.5 text-lg font-bold text-[var(--text-primary)]">{formatCurrency(company.eps, company.currency)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{t('company.bookValue')}</p>
                  <p className="mt-0.5 text-lg font-bold text-[var(--text-primary)]">{formatCurrency(company.bookValue, company.currency)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{t('company.pbRatio')}</p>
                  <p className="mt-0.5 text-lg font-bold text-[var(--text-primary)]">{(company.stockPrice / company.bookValue).toFixed(2)}x</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fleet' && (
          <FleetTab company={company} t={t} language={language} />
        )}

        {activeTab === 'news' && (
          <div className="space-y-4">
            {companyNews.length === 0 && (
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-12 text-center">
                <p className="text-[var(--text-muted)]">{t('common.noData')}</p>
              </div>
            )}
            {companyNews.map((article) => {
              const categoryColors = {
                earnings: 'bg-emerald-500/10 text-emerald-400',
                market: 'bg-blue-500/10 text-blue-400',
                fleet: 'bg-cyan-500/10 text-cyan-400',
                regulation: 'bg-amber-500/10 text-amber-400',
              };
              return (
                <div
                  key={article.id}
                  className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 transition-all duration-200 hover:border-[var(--border-color)] hover:bg-[var(--bg-card-hover)]"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        categoryColors[article.category] || 'bg-[var(--bg-card-hover)] text-[var(--text-primary)]'
                      }`}
                    >
                      {t(`news.${article.category}`)}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">{article.date}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                    {article.title[language]}
                  </h3>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {t('news.source')}: {article.source}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'esg' && (
          <EsgTab company={company} t={t} />
        )}
      </div>
    </div>
  );
}

function QuickStat({ label, value }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
      <div>
        <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
        <p className="text-sm text-[var(--text-primary)]">{typeof value === 'string' ? value : value}</p>
      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 transition-colors duration-200 hover:bg-[var(--bg-card-hover)]">
      <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 text-lg font-bold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}


function NextEventCard({ companyId, t, language }) {
  const nextEvent = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return earningsCalendar
      .filter((ev) => ev.companyId === companyId && new Date(ev.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  }, [companyId]);

  if (!nextEvent) return null;

  const daysUntil = Math.ceil((new Date(nextEvent.date) - new Date()) / (1000 * 60 * 60 * 24));
  const dotColor = nextEvent.type === 'earnings' ? 'bg-emerald-500' : nextEvent.type === 'dividend_ex' ? 'bg-blue-500' : 'bg-orange-500';
  const label = nextEvent.type === 'earnings'
    ? `${nextEvent.quarter}${t('earnings.earningsLabel')}`
    : nextEvent.type === 'dividend_ex'
      ? t('earnings.dividendEx')
      : t('earnings.dividendPay');

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    if (language === 'ja') return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
    if (language === 'zh') return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
      <h2 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">{t('earnings.nextEvent')}</h2>
      <div className="flex items-center gap-3">
        <span className={`w-3 h-3 rounded-full shrink-0 ${dotColor}`} />
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
          <p className="text-xs text-[var(--text-secondary)]">{formatDate(nextEvent.date)}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-[var(--text-primary)]">{daysUntil}</p>
          <p className="text-[10px] text-[var(--text-muted)]">{t('earnings.daysUntil')}</p>
        </div>
      </div>
    </div>
  );
}

function FleetTab({ company, t, language }) {
  const fleet = fleetByType[company.id] || {};
  const fleetEntries = Object.entries(fleet).filter(([, count]) => count > 0);
  const totalFleetTyped = fleetEntries.reduce((s, [, c]) => s + c, 0);

  const fleetChartData = useMemo(() =>
    fleetEntries
      .map(([type, count]) => ({
        type,
        name: shipTypes[type]?.[language] || shipTypes[type]?.en || type,
        count,
        pct: totalFleetTyped > 0 ? ((count / totalFleetTyped) * 100).toFixed(1) : 0,
        color: shipTypes[type]?.color || '#64748b',
      }))
      .sort((a, b) => b.count - a.count),
    [company.id, language]
  );

  const orderBookPct = company.vessels > 0 ? ((company.orderBook / company.vessels) * 100).toFixed(1) : 0;

  const utilizationColor = company.fleetUtilization >= 93 ? '#10b981' : company.fleetUtilization >= 88 ? '#f59e0b' : '#ef4444';

  const fleetKpis = [
    { icon: Ship, label: t('company.vessels'), value: company.vessels.toLocaleString(), color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-l-blue-500' },
    { icon: Anchor, label: t('company.dwt'), value: `${company.dwt}M`, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', borderColor: 'border-l-cyan-500' },
    { icon: Package, label: t('company.teuCapacity'), value: formatNumber(company.teuCapacity), color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-l-emerald-500' },
    { icon: ClipboardList, label: t('company.orderBook'), value: `${company.orderBook}`, color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-l-amber-500' },
    { icon: Clock, label: t('company.avgVesselAge'), value: `${company.avgVesselAge}y`, color: 'text-violet-400', bgColor: 'bg-violet-500/10', borderColor: 'border-l-violet-500' },
    { icon: Gauge, label: t('company.fleetUtilization'), value: `${company.fleetUtilization}%`, color: company.fleetUtilization >= 93 ? 'text-emerald-400' : company.fleetUtilization >= 88 ? 'text-amber-400' : 'text-red-400', bgColor: company.fleetUtilization >= 93 ? 'bg-emerald-500/10' : company.fleetUtilization >= 88 ? 'bg-amber-500/10' : 'bg-red-500/10', borderColor: company.fleetUtilization >= 93 ? 'border-l-emerald-500' : company.fleetUtilization >= 88 ? 'border-l-amber-500' : 'border-l-red-500' },
    { icon: Shield, label: t('company.alliance'), value: company.alliance, color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-l-blue-500', isTag: true },
  ];

  return (
    <div className="space-y-6">
      {/* Fleet KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {fleetKpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className={`rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] ${kpi.borderColor} border-l-4 p-4 transition-colors duration-200 hover:bg-[var(--bg-card-hover)]`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-lg ${kpi.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
              {kpi.isTag ? (
                <span className="inline-flex rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400 mt-0.5">
                  {kpi.value}
                </span>
              ) : (
                <p className="text-xl font-bold text-[var(--text-primary)]">{kpi.value}</p>
              )}
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mt-1">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Fleet Utilization + Sector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Utilization Gauge */}
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">{t('company.fleetUtilization')}</h2>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={utilizationColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${company.fleetUtilization * 2.64} 264`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-[var(--text-primary)]">
                {company.fleetUtilization}%
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[var(--text-secondary)]">{t('company.fleetUtilization')}</span>
                <span className="text-xs font-medium" style={{ color: utilizationColor }}>
                  {company.fleetUtilization >= 93 ? t('fleet.excellent') : company.fleetUtilization >= 88 ? t('fleet.good') : t('fleet.low')}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[var(--bg-card)]">
                <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${company.fleetUtilization}%`, backgroundColor: utilizationColor }} />
              </div>
              <p className="text-[10px] text-[var(--text-muted)] mt-2">
                {`${Math.round(company.vessels * company.fleetUtilization / 100)} / ${company.vessels} ${t('fleet.active')}`}
              </p>
            </div>
          </div>
        </div>

        {/* Order Book */}
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">{t('company.orderBook')}</h2>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="#f59e0b"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${Math.min(orderBookPct, 100) * 2.64} 264`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-[var(--text-primary)]">
                {company.orderBook}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-[var(--text-secondary)] mb-2">
                {t('fleet.vesselsOnOrder')}
              </p>
              <div className="h-2 w-full rounded-full bg-[var(--bg-card)] mb-1">
                <div className="h-2 rounded-full bg-amber-500 transition-all duration-500" style={{ width: `${Math.min(orderBookPct, 100)}%` }} />
              </div>
              <p className="text-[10px] text-[var(--text-muted)]">
                {`~${orderBookPct}% ${t('fleet.fleetExpansion')}`}
              </p>
              <p className="text-xs font-medium text-amber-400 mt-1">
                {company.orderBook} {t('fleet.underConstruction')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Breakdown by Ship Type */}
      {fleetChartData.length > 0 && (
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
            {t('fleet.breakdown')}
          </h2>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Pie chart */}
            <div className="w-full lg:w-2/5 flex justify-center">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={fleetChartData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={100}
                    paddingAngle={2}
                    stroke="rgba(15,18,33,0.8)"
                    strokeWidth={2}
                  >
                    {fleetChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[var(--bg-card)]/95 backdrop-blur-sm border border-[var(--border-color)] rounded-lg px-3 py-2 shadow-xl">
                          <p className="text-sm font-semibold text-[var(--text-primary)]">{d.name}</p>
                          <p className="text-xs text-[var(--text-secondary)]">{d.count} {t('compare.vesselUnit')} ({d.pct}%)</p>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Horizontal bar breakdown */}
            <div className="flex-1 space-y-3">
              {fleetChartData.map((entry) => (
                <div key={entry.type}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                      <span className="text-xs text-[var(--text-primary)]">{entry.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-[var(--text-primary)]">{entry.count}</span>
                      <span className="text-[10px] text-[var(--text-muted)] w-10 text-right">{entry.pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[var(--bg-card)]">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${entry.pct}%`, backgroundColor: entry.color }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between">
                <span className="text-xs text-[var(--text-secondary)]">{t('fleet.total')}</span>
                <span className="text-sm font-bold text-[var(--text-primary)]">{totalFleetTyped} {t('compare.vesselUnit')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sector badge & visual vessel grid */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">{t('company.fleet')}</h2>
          <span className="inline-flex rounded-full bg-[var(--bg-card)] px-3 py-1 text-xs font-medium text-[var(--text-primary)]">
            {sectorKeys[company.sector] ? t(`company.${sectorKeys[company.sector]}`) : company.sector}
          </span>
        </div>
        <div className="flex flex-wrap gap-0.5">
          {Array.from({ length: Math.min(company.vessels, 200) }).map((_, i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-sm"
              style={{ backgroundColor: company.color, opacity: 0.6 + (i % 5) * 0.1 }}
            />
          ))}
          {company.vessels > 200 && (
            <span className="ml-2 self-end text-xs text-[var(--text-muted)]">
              +{company.vessels - 200} {t('company.more')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function EsgTab({ company, t }) {
  const esg = esgData[company.id];
  if (!esg) {
    return (
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-12 text-center">
        <p className="text-[var(--text-muted)]">{t('common.noData')}</p>
      </div>
    );
  }

  const ciiColors = { A: '#10b981', B: '#6ee7b7', C: '#fbbf24', D: '#f97316', E: '#ef4444' };
  const ciiColor = ciiColors[esg.ciiRating] || '#64748b';

  const exposureColors = { Low: 'bg-emerald-500/10 text-emerald-400', Medium: 'bg-amber-500/10 text-amber-400', High: 'bg-red-500/10 text-red-400' };
  const exposureCls = exposureColors[esg.euEtsExposure] || 'bg-[var(--bg-card-hover)] text-[var(--text-primary)]';

  const trendArrow = esg.trend === 'improving' ? '\u2191' : esg.trend === 'declining' ? '\u2193' : '\u2192';
  const trendColor = esg.trend === 'improving' ? 'text-emerald-400' : esg.trend === 'declining' ? 'text-red-400' : 'text-[var(--text-secondary)]';

  const greenPct = company.vessels > 0 ? ((esg.greenVessels / company.vessels) * 100).toFixed(1) : 0;

  // Industry average carbon intensity
  const allValues = Object.values(esgData).map(e => e.carbonIntensity);
  const industryAvg = (allValues.reduce((a, b) => a + b, 0) / allValues.length).toFixed(1);

  const comparisonData = [
    { name: company.name?.en || company.id, value: esg.carbonIntensity, color: company.color },
    { name: t('esg.industryAvg'), value: parseFloat(industryAvg), color: '#64748b' },
  ];

  return (
    <div className="space-y-6">
      {/* ESG KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-2">{t('esg.ciiRating')}</p>
          <span
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-xl font-bold"
            style={{ backgroundColor: ciiColor + '20', color: ciiColor }}
          >
            {esg.ciiRating}
          </span>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-2">{t('esg.carbonIntensity')}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-[var(--text-primary)]">{esg.carbonIntensity}</p>
            <span className={`text-lg font-bold ${trendColor}`}>{trendArrow}</span>
          </div>
          <p className="text-[10px] text-[var(--text-muted)] mt-1">gCO2/ton-mile</p>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-2">{t('esg.greenVessels')}</p>
          <p className="text-2xl font-bold text-emerald-400">{esg.greenVessels}</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-1">{greenPct}% {t('esg.ofFleet')}</p>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-2">{t('esg.euEts')}</p>
          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${exposureCls}`}>
            {esg.euEtsExposure}
          </span>
        </div>
      </div>

      {/* Carbon Intensity vs Industry */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">{t('esg.vsIndustry')}</h2>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={comparisonData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} width={120} />
            <Tooltip content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="bg-[var(--bg-card)]/95 backdrop-blur-sm border border-[var(--border-color)] rounded-lg px-3 py-2 shadow-xl">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{payload[0].payload.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{payload[0].value} gCO2/ton-mile</p>
                </div>
              );
            }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={28}>
              {comparisonData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Trend */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-2">{t('esg.trend')}</h2>
        <div className="flex items-center gap-3">
          <span className={`text-2xl ${trendColor}`}>{trendArrow}</span>
          <span className="text-sm text-[var(--text-primary)]">{t(`esg.trend_${esg.trend}`)}</span>
        </div>
      </div>
    </div>
  );
}
