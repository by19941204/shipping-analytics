import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { companies } from '../data/companies';
import { pearsonCorrelation, calculateReturns } from '../utils/statistics';
import { useLanguage } from '../i18n/LanguageContext';
import { formatMarketCapUSD, formatPercent, formatCurrency, formatNumber, toUSD, formatUSD, FX_RATES } from '../utils/format';
import { generateCSV, downloadCSV } from '../utils/export';
import ExportButton from '../components/ExportButton';

const countryFlags = {
  JP: '\u{1F1EF}\u{1F1F5}',
  DK: '\u{1F1E9}\u{1F1F0}',
  CN: '\u{1F1E8}\u{1F1F3}',
  TW: '\u{1F1F9}\u{1F1FC}',
  DE: '\u{1F1E9}\u{1F1EA}',
  IL: '\u{1F1EE}\u{1F1F1}',
  KR: '\u{1F1F0}\u{1F1F7}',
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--bg-card)]/95 backdrop-blur-sm border border-[var(--border-color)] rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-[var(--text-secondary)]">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: p.color || '#fff' }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
}

const sectionIds = ['overview', 'valuation', 'performance', 'fleet'];
const validPeriods = ['1W', '1M', '3M', '6M', '1Y'];

export default function Compare() {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selected, setSelected] = useState(() => {
    const param = searchParams.get('companies');
    if (param) {
      const ids = param.split(',').filter(id => companies.some(c => c.id === id));
      if (ids.length > 0) return new Set(ids);
    }
    return new Set(['nyk', 'mol', 'kline']);
  });

  const [activeSection, setActiveSection] = useState(() => {
    const tab = searchParams.get('tab');
    if (tab && sectionIds.includes(tab)) return tab;
    return 'overview';
  });

  const [perfPeriod, setPerfPeriod] = useState(() => {
    const period = searchParams.get('period');
    if (period && validPeriods.includes(period)) return period;
    return '3M';
  });

  // Sync state changes to URL
  useEffect(() => {
    const params = new URLSearchParams();
    const companiesStr = [...selected].join(',');
    if (companiesStr && companiesStr !== 'nyk,mol,kline') {
      params.set('companies', companiesStr);
    }
    if (activeSection !== 'overview') {
      params.set('tab', activeSection);
    }
    if (perfPeriod !== '3M') {
      params.set('period', perfPeriod);
    }
    setSearchParams(params, { replace: true });
  }, [selected, activeSection, perfPeriod, setSearchParams]);

  const selectedCompanies = useMemo(
    () => companies.filter((c) => selected.has(c.id)),
    [selected]
  );

  const allCompanyIds = companies.map(c => c.id);

  const presets = [
    { key: 'japanBigThree', ids: ['nyk', 'mol', 'kline'] },
    { key: 'topMarketCap', ids: ['maersk', 'cosco', 'nyk', 'mol', 'hapag'] },
    { key: 'highDividend', ids: ['mol', 'zim', 'yangming', 'hmmarine'] },
    { key: 'containerMajors', ids: ['maersk', 'cosco', 'evergreen', 'hapag'] },
    { key: 'selectAll', ids: allCompanyIds },
    { key: 'reset', ids: [] },
  ];

  function setsEqual(a, b) {
    if (a.size !== b.size) return false;
    for (const v of a) if (!b.has(v)) return false;
    return true;
  }

  function handleExportCSV() {
    const headers = [
      t('compare.metric'),
      ...normalizedData.map(c => c.name[language]),
    ];
    const metricRows = [
      { label: t('compare.stockPriceLocal'), render: c => formatCurrency(c.stockPrice, c.currency) },
      { label: t('compare.stockPriceUSD'), render: c => `$${c.stockPriceUSD.toFixed(2)}` },
      { label: t('compare.change'), render: c => formatPercent(c.change) },
      { label: t('compare.marketCapUSD'), render: c => formatMarketCapUSD(c.marketCap, c.currency) },
      { label: t('company.peRatio'), render: c => c.peRatio.toFixed(1) + 'x' },
      { label: t('company.evEbitda'), render: c => {
        const ev = c.marketCapUSD + toUSD(c.netDebt * 1e6, c.currency);
        const ebitda = toUSD(c.ebitda * 1e6, c.currency);
        return (ev / ebitda).toFixed(1) + 'x';
      }},
      { label: t('company.pbRatio'), render: c => c.bookValue ? (c.stockPrice / c.bookValue).toFixed(2) + 'x' : '-' },
      { label: t('company.dividendYield'), render: c => c.dividendYield.toFixed(1) + '%' },
      { label: t('company.roe'), render: c => c.roe.toFixed(1) + '%' },
      { label: t('company.profitMargin'), render: c => c.profitMargin.toFixed(1) + '%' },
      { label: t('company.ebitdaMargin'), render: c => c.ebitdaMargin.toFixed(1) + '%' },
      { label: t('compare.fcfYield'), render: c => {
        const fcfUSD = toUSD(c.freeCashFlow * 1e6, c.currency);
        return (fcfUSD / c.marketCapUSD * 100).toFixed(1) + '%';
      }},
      { label: t('company.debtEquity'), render: c => c.debtEquity.toFixed(2) },
      { label: t('compare.netDebtEbitda'), render: c => c.netDebt && c.ebitda ? (c.netDebt / c.ebitda).toFixed(2) + 'x' : '-' },
    ];
    const rows = metricRows.map(row => [
      row.label,
      ...normalizedData.map(c => {
        const val = row.render(c);
        return typeof val === 'object' ? formatPercent(c.change) : String(val);
      }),
    ]);
    const date = new Date().toISOString().slice(0, 10);
    const csv = generateCSV(headers, rows);
    downloadCSV(csv, `shiptracker-compare-${date}.csv`);
  }

  function toggleCompany(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Compute USD-normalized values for fair comparison
  const normalizedData = useMemo(() => {
    return selectedCompanies.map(c => {
      const marketCapUSD = toUSD(c.marketCap, c.currency);
      const stockPriceUSD = toUSD(c.stockPrice, c.currency);
      const totalRevenue = c.revenue.reduce((s, q) => s + q.value, 0);
      // Revenue is in millions of local currency for JP companies
      const revenueUSD = c.currency === 'JPY' ? totalRevenue * 1000000 * FX_RATES.JPY
        : c.currency === 'KRW' ? totalRevenue * 1000000 * FX_RATES.KRW
        : c.currency === 'TWD' ? totalRevenue * 1000000 * FX_RATES.TWD
        : c.currency === 'HKD' ? totalRevenue * 1000000 * FX_RATES.HKD
        : c.currency === 'DKK' ? totalRevenue * 1000000 * FX_RATES.DKK
        : c.currency === 'EUR' ? totalRevenue * 1000000 * FX_RATES.EUR
        : totalRevenue * 1000000;
      const epsUSD = toUSD(c.eps, c.currency);

      return {
        ...c,
        marketCapUSD,
        stockPriceUSD,
        revenueUSD,
        epsUSD,
        nameLocalized: c.name[language],
      };
    });
  }, [selectedCompanies, language]);

  // Valuation comparison chart data
  const valuationData = useMemo(() => {
    return normalizedData.map(c => ({
      name: c.name[language],
      color: c.color,
      pe: c.peRatio,
      evEbitda: c.netDebt && c.ebitda ? ((toUSD(c.marketCap, c.currency) + toUSD(c.netDebt * 1000000, c.currency)) / toUSD(c.ebitda * 1000000, c.currency)).toFixed(1) : null,
      pbRatio: c.bookValue ? (c.stockPrice / c.bookValue).toFixed(2) : null,
      dividendYield: c.dividendYield,
    }));
  }, [normalizedData, language]);

  // Profitability comparison
  const profitabilityData = useMemo(() => {
    return normalizedData.map(c => ({
      name: c.name[language],
      color: c.color,
      roe: c.roe,
      profitMargin: c.profitMargin,
      ebitdaMargin: c.ebitdaMargin,
    }));
  }, [normalizedData, language]);

  // Fleet comparison data
  const fleetData = useMemo(() => {
    return normalizedData.map(c => ({
      name: c.name[language],
      color: c.color,
      vessels: c.vessels,
      teu: c.teuCapacity,
      utilization: c.fleetUtilization,
      avgAge: c.avgVesselAge,
      orderBook: c.orderBook,
    }));
  }, [normalizedData, language]);

  // Market cap bubble chart (MarketCap vs P/E, bubble = dividend yield)
  const bubbleData = useMemo(() => {
    return normalizedData.map(c => ({
      name: c.name[language],
      x: c.peRatio,
      y: c.marketCapUSD / 1e9,
      z: c.dividendYield * 100,
      color: c.color,
      dividend: c.dividendYield,
    }));
  }, [normalizedData, language]);

  // Stock performance comparison (normalize to 100)
  const performanceData = useMemo(() => {
    if (selectedCompanies.length === 0) return [];
    const periodDays = perfPeriod === '1W' ? 7 : perfPeriod === '1M' ? 30 : perfPeriod === '3M' ? 90 : perfPeriod === '6M' ? 180 : 365;

    // Slice each company's history to the selected period
    const slicedHistories = selectedCompanies.map(c => {
      const hist = c.stockHistory || [];
      return hist.slice(-periodDays);
    });

    const maxLen = Math.min(...slicedHistories.map(h => h.length));
    if (maxLen === 0) return [];

    const result = [];
    for (let i = 0; i < maxLen; i++) {
      const point = { day: i + 1 };
      selectedCompanies.forEach((c, ci) => {
        const sliced = slicedHistories[ci];
        const basePrice = sliced[0]?.price || 1;
        const currentPrice = sliced[i]?.price || basePrice;
        point[c.name[language]] = ((currentPrice / basePrice) * 100).toFixed(1);
      });
      if (slicedHistories[0]?.[i]?.date) {
        point.date = slicedHistories[0][i].date;
      }
      result.push(point);
    }
    return result;
  }, [selectedCompanies, language, perfPeriod]);

  // Radar chart
  const radarData = useMemo(() => {
    if (normalizedData.length === 0) return [];
    const allCompanies = companies;
    const maxMarketCap = Math.max(...allCompanies.map(c => toUSD(c.marketCap, c.currency)));
    const maxDividend = Math.max(...allCompanies.map(c => c.dividendYield));
    const maxROE = Math.max(...allCompanies.map(c => c.roe));
    const maxProfitMargin = Math.max(...allCompanies.map(c => c.profitMargin));
    const maxTEU = Math.max(...allCompanies.map(c => c.teuCapacity));
    const maxEbitdaMargin = Math.max(...allCompanies.map(c => c.ebitdaMargin));

    const metrics = [
      { label: t('company.marketCap'), key: 'marketCapUSD', max: maxMarketCap },
      { label: t('company.dividendYield'), key: 'dividendYield', max: maxDividend },
      { label: t('company.roe'), key: 'roe', max: maxROE },
      { label: t('company.profitMargin'), key: 'profitMargin', max: maxProfitMargin },
      { label: t('company.teuCapacity'), key: 'teuCapacity', max: maxTEU },
      { label: t('company.ebitdaMargin'), key: 'ebitdaMargin', max: maxEbitdaMargin },
    ];

    return metrics.map(m => {
      const point = { metric: m.label };
      normalizedData.forEach(c => {
        const value = m.key === 'marketCapUSD' ? c.marketCapUSD : c[m.key];
        point[c.name[language]] = Math.round((value / m.max) * 100);
      });
      return point;
    });
  }, [normalizedData, language, t]);

  // Correlation matrix
  const correlationMatrix = useMemo(() => {
    if (selectedCompanies.length < 2) return [];
    const returnsMap = {};
    selectedCompanies.forEach(c => {
      returnsMap[c.id] = calculateReturns(c.stockHistory || []);
    });
    return selectedCompanies.map(a => ({
      id: a.id,
      name: a.name[language],
      cells: selectedCompanies.map(b => {
        if (a.id === b.id) return 1;
        return parseFloat(pearsonCorrelation(returnsMap[a.id], returnsMap[b.id]).toFixed(3));
      }),
    }));
  }, [selectedCompanies, language]);

  const sections = [
    { id: 'overview', label: t('compare.overview') },
    { id: 'valuation', label: t('compare.valuation') },
    { id: 'performance', label: t('compare.performance') },
    { id: 'fleet', label: t('compare.fleetTab') },
    { id: 'correlation', label: t('compare.correlation') },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">{t('compare.title')}</h1>
          <p className="text-[var(--text-secondary)] mt-1">{t('compare.subtitle')}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {'※ ' + t('compare.usdDisclaimer')}
          </p>
        </div>

        {/* Company Selector */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 mb-6">
          <h2 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            {t('compare.presets')}
          </h2>
          <div className="flex flex-nowrap gap-2 overflow-x-auto pb-3 mb-4 border-b border-[var(--border-color)]">
            {presets.map((preset) => {
              const presetSet = new Set(preset.ids);
              const isActive = preset.key !== 'reset' && setsEqual(selected, presetSet);
              return (
                <button
                  key={preset.key}
                  onClick={() => setSelected(new Set(preset.ids))}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-500/30 border-indigo-500/60 text-indigo-300'
                      : 'bg-indigo-500/10 border-indigo-500/30 text-[var(--text-secondary)] hover:text-indigo-300 hover:bg-indigo-500/20'
                  }`}
                >
                  {t(`compare.${preset.key}`)}
                </button>
              );
            })}
          </div>
          <h2 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-4">
            {t('compare.selectCompanies')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {companies.map((company) => {
              const isSelected = selected.has(company.id);
              return (
                <button
                  key={company.id}
                  onClick={() => toggleCompany(company.id)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border cursor-pointer hover:scale-[1.02]"
                  style={
                    isSelected
                      ? { backgroundColor: company.color + '20', borderColor: company.color + '80', color: company.color }
                      : { backgroundColor: 'transparent', borderColor: '#334155', color: '#94a3b8' }
                  }
                >
                  <span className="text-xs">{countryFlags[company.country] || ''}</span>
                  <span>{company.name[language]}</span>
                  {isSelected && <span className="text-xs opacity-60">({formatMarketCapUSD(company.marketCap, company.currency)})</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeSection === s.id
                  ? 'bg-blue-600 text-[var(--text-primary)] shadow-lg shadow-blue-600/20'
                  : 'bg-[var(--bg-card)]/50 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]/50'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {selectedCompanies.length === 0 && (
          <div className="text-center py-20 text-[var(--text-muted)]">
            {t('compare.selectPrompt')}
          </div>
        )}

        {selectedCompanies.length > 0 && activeSection === 'overview' && (
          <>
            {/* Key Metrics Comparison Table (USD normalized) */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 mb-6 overflow-x-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  {t('compare.keyMetricsUSD')}
                </h2>
                <ExportButton onClick={handleExportCSV} label={t('common.csv')} />
              </div>
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="text-left pb-3 pr-4 text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">{t('compare.metric')}</th>
                    {normalizedData.map(c => (
                      <th key={c.id} className="text-right pb-3 px-3">
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="text-xs">{countryFlags[c.country]}</span>
                          <span className="text-sm font-semibold text-[var(--text-primary)]">{c.name[language]}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: t('compare.stockPriceLocal'), render: c => formatCurrency(c.stockPrice, c.currency) },
                    { label: t('compare.stockPriceUSD'), render: c => `$${c.stockPriceUSD.toFixed(2)}`, highlight: true },
                    { label: t('compare.change'), render: c => <span className={c.change >= 0 ? 'text-emerald-400' : 'text-red-400'}>{formatPercent(c.change)}</span> },
                    { label: t('compare.marketCapUSD'), render: c => formatMarketCapUSD(c.marketCap, c.currency), highlight: true },
                    { label: t('company.peRatio'), render: c => c.peRatio.toFixed(1) + 'x' },
                    { label: t('company.evEbitda'), render: c => {
                      const ev = c.marketCapUSD + toUSD(c.netDebt * 1e6, c.currency);
                      const ebitda = toUSD(c.ebitda * 1e6, c.currency);
                      return (ev / ebitda).toFixed(1) + 'x';
                    }},
                    { label: t('company.pbRatio'), render: c => c.bookValue ? (c.stockPrice / c.bookValue).toFixed(2) + 'x' : '-' },
                    { label: t('company.dividendYield'), render: c => c.dividendYield.toFixed(1) + '%' },
                    { label: t('company.roe'), render: c => c.roe.toFixed(1) + '%' },
                    { label: t('company.profitMargin'), render: c => c.profitMargin.toFixed(1) + '%' },
                    { label: t('company.ebitdaMargin'), render: c => c.ebitdaMargin.toFixed(1) + '%' },
                    { label: t('compare.fcfYield'), render: c => {
                      const fcfUSD = toUSD(c.freeCashFlow * 1e6, c.currency);
                      return (fcfUSD / c.marketCapUSD * 100).toFixed(1) + '%';
                    }},
                    { label: t('company.debtEquity'), render: c => c.debtEquity.toFixed(2) },
                    { label: t('compare.netDebtEbitda'), render: c => c.netDebt && c.ebitda ? (c.netDebt / c.ebitda).toFixed(2) + 'x' : '-' },
                  ].map((row, i) => (
                    <tr key={i} className={`border-b border-[var(--border-color)] transition-colors duration-150 hover:bg-white/[0.03] ${row.highlight ? 'bg-blue-500/[0.03]' : i % 2 === 0 ? 'bg-[var(--bg-primary)]/20' : ''}`}>
                      <td className="py-2.5 pr-4 text-sm text-[var(--text-secondary)] font-medium whitespace-nowrap">{row.label}</td>
                      {normalizedData.map(c => (
                        <td key={c.id} className="py-2.5 px-3 text-right text-sm font-medium text-[var(--text-primary)]">
                          {row.render(c)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Radar Chart */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 mb-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{t('compare.radarTitle')}</h2>
              <p className="text-sm text-[var(--text-secondary)] mb-4">{t('compare.radarSubtitle')}</p>
              <div className="flex flex-wrap gap-4 mb-4">
                {normalizedData.map(c => (
                  <div key={c.id} className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-[var(--text-primary)]">{c.name[language]}</span>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={380}>
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} />
                  {normalizedData.map(c => (
                    <Radar key={c.id} name={c.name[language]} dataKey={c.name[language]} stroke={c.color} fill={c.color} fillOpacity={0.1} strokeWidth={2} />
                  ))}
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Bubble Chart: Market Cap vs P/E vs Dividend */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                {t('compare.valuationMap')}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                {t('compare.valuationMapDesc')}
              </p>
              <ResponsiveContainer width="100%" height={350}>
                <ScatterChart margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" dataKey="x" name="P/E" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e293b' }} label={{ value: t('company.peRatio'), position: 'bottom', fill: '#64748b', fontSize: 11 }} />
                  <YAxis type="number" dataKey="y" name="Market Cap" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e293b' }} tickFormatter={v => `$${v.toFixed(0)}B`} label={{ value: t('company.marketCap') + ' ($B)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }} />
                  <ZAxis type="number" dataKey="z" range={[200, 1200]} />
                  <Tooltip content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-[var(--bg-card)]/95 backdrop-blur-sm border border-[var(--border-color)] rounded-lg px-3 py-2 shadow-xl">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{d.name}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{t('company.peRatio')}: {d.x}x</p>
                        <p className="text-xs text-[var(--text-secondary)]">{t('company.marketCap')}: ${d.y.toFixed(1)}B</p>
                        <p className="text-xs text-[var(--text-secondary)]">{t('company.dividendYield')}: {d.dividend}%</p>
                      </div>
                    );
                  }} />
                  <Scatter data={bubbleData}>
                    {bubbleData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} fillOpacity={0.7} stroke={entry.color} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {selectedCompanies.length > 0 && activeSection === 'valuation' && (
          <>
            {/* Valuation Bar Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* P/E Comparison */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
                <h3 className="text-md font-semibold text-[var(--text-primary)] mb-4">
                  {t('compare.peComparison')}
                </h3>
                <ResponsiveContainer width="100%" height={normalizedData.length * 48 + 20}>
                  <BarChart data={[...normalizedData].sort((a, b) => a.peRatio - b.peRatio).map(c => ({ name: c.name[language], value: c.peRatio, color: c.color }))} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => v + 'x'} />
                    <YAxis type="category" dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} width={120} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={24} shape={(props) => <rect {...props} fill={props.payload.color} rx={4} ry={4} />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* EV/EBITDA Comparison */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
                <h3 className="text-md font-semibold text-[var(--text-primary)] mb-4">{t('company.evEbitda')}</h3>
                <ResponsiveContainer width="100%" height={normalizedData.length * 48 + 20}>
                  <BarChart data={[...normalizedData].sort((a, b) => {
                    const aVal = (a.marketCapUSD + toUSD(a.netDebt * 1e6, a.currency)) / toUSD(a.ebitda * 1e6, a.currency);
                    const bVal = (b.marketCapUSD + toUSD(b.netDebt * 1e6, b.currency)) / toUSD(b.ebitda * 1e6, b.currency);
                    return aVal - bVal;
                  }).map(c => {
                    const ev = c.marketCapUSD + toUSD(c.netDebt * 1e6, c.currency);
                    const ebitda = toUSD(c.ebitda * 1e6, c.currency);
                    return { name: c.name[language], value: parseFloat((ev / ebitda).toFixed(1)), color: c.color };
                  })} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => v + 'x'} />
                    <YAxis type="category" dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} width={120} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={24} shape={(props) => <rect {...props} fill={props.payload.color} rx={4} ry={4} />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Profitability Comparison */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                {t('compare.profitabilityComparison')}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={profitabilityData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => v + '%'} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                  <Bar dataKey="roe" name={t('company.roe')} fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="profitMargin" name={t('company.profitMargin')} fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="ebitdaMargin" name={t('company.ebitdaMargin')} fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Dividend & FCF Yield */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                {t('compare.dividendFcfYield')}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={normalizedData.map(c => ({
                  name: c.name[language],
                  dividend: c.dividendYield,
                  fcfYield: parseFloat((toUSD(c.freeCashFlow * 1e6, c.currency) / c.marketCapUSD * 100).toFixed(1)),
                  color: c.color,
                }))} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => v + '%'} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                  <Bar dataKey="dividend" name={t('company.dividendYield')} fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="fcfYield" name={t('compare.fcfYield')} fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {selectedCompanies.length > 0 && activeSection === 'performance' && (
          <>
            {/* Stock Price Performance (indexed to 100) */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  {t('compare.stockPerformance')}
                </h3>
                <div className="flex gap-1">
                  {['1W', '1M', '3M', '6M', '1Y'].map(p => (
                    <button
                      key={p}
                      onClick={() => setPerfPeriod(p)}
                      className={`px-3 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                        perfPeriod === p
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                {t('compare.stockPerformanceDesc')}
              </p>
              <div className="flex flex-wrap gap-4 mb-4">
                {normalizedData.map(c => (
                  <div key={c.id} className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-[var(--text-primary)]">{c.name[language]}</span>
                    <span className={`text-xs font-medium ${c.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatPercent(c.change)}
                    </span>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => v ? v.slice(5) : ''} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} domain={['auto', 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  {normalizedData.map(c => (
                    <Line key={c.id} type="monotone" dataKey={c.name[language]} stroke={c.color} strokeWidth={2} dot={false} />
                  ))}
                  {/* Reference line at 100 */}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Market Cap Ranking (USD) */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                {t('compare.marketCapRanking')}
              </h3>
              <ResponsiveContainer width="100%" height={companies.length * 44 + 20}>
                <BarChart data={[...companies].sort((a, b) => toUSD(b.marketCap, b.currency) - toUSD(a.marketCap, a.currency)).map(c => ({
                  name: c.name[language],
                  value: parseFloat((toUSD(c.marketCap, c.currency) / 1e9).toFixed(1)),
                  color: c.color,
                  isSelected: selected.has(c.id),
                }))} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `$${v}B`} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} width={140} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={24} shape={(props) => {
                    const opacity = props.payload.isSelected ? 1 : 0.3;
                    return <rect {...props} fill={props.payload.color} fillOpacity={opacity} rx={4} ry={4} />;
                  }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {selectedCompanies.length > 0 && activeSection === 'fleet' && (
          <>
            {/* Fleet Size Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
                <h3 className="text-md font-semibold text-[var(--text-primary)] mb-4">
                  {t('compare.vesselCount')}
                </h3>
                <ResponsiveContainer width="100%" height={normalizedData.length * 48 + 20}>
                  <BarChart data={[...fleetData].sort((a, b) => b.vessels - a.vessels)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} width={120} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="vessels" name={t('company.vessels')} radius={[0, 4, 4, 0]} maxBarSize={24} shape={(props) => <rect {...props} fill={props.payload.color} rx={4} ry={4} />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
                <h3 className="text-md font-semibold text-[var(--text-primary)] mb-4">{t('company.teuCapacity')}</h3>
                <ResponsiveContainer width="100%" height={normalizedData.length * 48 + 20}>
                  <BarChart data={[...fleetData].sort((a, b) => b.teu - a.teu)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => v >= 1000000 ? `${(v/1e6).toFixed(1)}M` : `${(v/1000).toFixed(0)}K`} />
                    <YAxis type="category" dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} width={120} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="teu" name={t('company.teuCapacity')} radius={[0, 4, 4, 0]} maxBarSize={24} shape={(props) => <rect {...props} fill={props.payload.color} rx={4} ry={4} />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Fleet Utilization & Age */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                {t('compare.utilizationAge')}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={fleetData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                  <Bar dataKey="utilization" name={t('company.fleetUtilization') + ' (%)'} fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={35} />
                  <Bar dataKey="avgAge" name={t('company.avgVesselAge') + ' (yrs)'} fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={35} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Order Book */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                {t('compare.orderBookTitle')}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[...normalizedData].sort((a, b) => b.orderBook - a.orderBook).map(c => (
                  <div key={c.id} className="text-center p-4 rounded-xl bg-[var(--bg-primary)]/50 border border-[var(--border-color)]">
                    <div className="text-3xl font-bold mb-1" style={{ color: c.color }}>{c.orderBook}</div>
                    <div className="text-xs text-[var(--text-secondary)]">{t('compare.vesselUnit')}</div>
                    <div className="text-sm font-medium text-[var(--text-primary)] mt-2">{c.name[language]}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">{t('company.alliance')}: {c.alliance}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {selectedCompanies.length >= 2 && activeSection === 'correlation' && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{t('compare.correlation')}</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-6">{t('compare.correlationDesc')}</p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="p-2" />
                    {selectedCompanies.map(c => (
                      <th key={c.id} className="p-2 text-xs font-medium text-[var(--text-secondary)] text-center whitespace-nowrap">
                        {c.name[language]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {correlationMatrix.map((row, ri) => (
                    <tr key={row.id}>
                      <td className="p-2 text-xs font-medium text-[var(--text-secondary)] whitespace-nowrap">{row.name}</td>
                      {row.cells.map((val, ci) => {
                        // Color: red(-1) -> white(0) -> green(+1)
                        const r = val < 0 ? 255 : Math.round(255 * (1 - val));
                        const g = val > 0 ? 255 : Math.round(255 * (1 + val));
                        const b = Math.round(255 * (1 - Math.abs(val)));
                        const bg = `rgb(${r}, ${g}, ${b})`;
                        const textColor = Math.abs(val) > 0.5 ? '#000' : '#fff';
                        return (
                          <td
                            key={ci}
                            className="p-2 text-center text-xs font-mono font-semibold"
                            style={{ backgroundColor: bg, color: textColor, minWidth: '60px' }}
                          >
                            {val === 1 && ri === ci ? '1.000' : val.toFixed(3)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-1">
                <span className="w-4 h-3 rounded" style={{ backgroundColor: 'rgb(255,0,0)' }} />
                <span>-1</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-3 rounded" style={{ backgroundColor: 'rgb(255,255,255)' }} />
                <span>0</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-3 rounded" style={{ backgroundColor: 'rgb(0,255,0)' }} />
                <span>+1</span>
              </div>
            </div>
          </div>
        )}

        {selectedCompanies.length < 2 && activeSection === 'correlation' && (
          <div className="text-center py-20 text-[var(--text-muted)]">
            {t('compare.selectPrompt')}
          </div>
        )}
      </div>
    </div>
  );
}
