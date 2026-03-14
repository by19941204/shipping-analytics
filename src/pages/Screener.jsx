import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import { companies } from '../data/companies';
import { useLanguage } from '../i18n/LanguageContext';
import { formatCurrency, formatPercent, toUSD } from '../utils/format';
import { generateCSV, downloadCSV } from '../utils/export';
import ExportButton from '../components/ExportButton';

const FIELDS = [
  'peRatio',
  'dividendYield',
  'roe',
  'profitMargin',
  'ebitdaMargin',
  'debtEquity',
  'fleetUtilization',
  'avgVesselAge',
  'marketCap',
  'change',
];

const OPERATORS = ['gt', 'lt', 'eq', 'between'];

function getFieldValue(company, field) {
  if (field === 'marketCap') return toUSD(company.marketCap, company.currency);
  return company[field];
}

function applyFilter(company, filter) {
  const val = getFieldValue(company, filter.field);
  if (val == null) return false;
  const v1 = parseFloat(filter.value1);
  if (isNaN(v1)) return true;
  switch (filter.operator) {
    case 'gt': return val > v1;
    case 'lt': return val < v1;
    case 'eq': return Math.abs(val - v1) < 0.01;
    case 'between': {
      const v2 = parseFloat(filter.value2);
      if (isNaN(v2)) return true;
      return val >= Math.min(v1, v2) && val <= Math.max(v1, v2);
    }
    default: return true;
  }
}

const PRESETS = {
  value: [
    { field: 'peRatio', operator: 'lt', value1: '8', value2: '' },
    { field: 'dividendYield', operator: 'gt', value1: '3', value2: '' },
  ],
  growth: [
    { field: 'roe', operator: 'gt', value1: '12', value2: '' },
    { field: 'fleetUtilization', operator: 'gt', value1: '90', value2: '' },
  ],
  highDividend: [
    { field: 'dividendYield', operator: 'gt', value1: '3.5', value2: '' },
  ],
  lowDebt: [
    { field: 'debtEquity', operator: 'lt', value1: '0.7', value2: '' },
  ],
};

export default function Screener() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [filters, setFilters] = useState([]);
  const [activePreset, setActivePreset] = useState(null);
  const [sortKey, setSortKey] = useState('marketCap');
  const [sortDir, setSortDir] = useState('desc');

  const addFilter = useCallback(() => {
    setFilters(prev => [...prev, { field: 'peRatio', operator: 'gt', value1: '', value2: '' }]);
    setActivePreset(null);
  }, []);

  const removeFilter = useCallback((index) => {
    setFilters(prev => prev.filter((_, i) => i !== index));
    setActivePreset(null);
  }, []);

  const updateFilter = useCallback((index, key, value) => {
    setFilters(prev => prev.map((f, i) => i === index ? { ...f, [key]: value } : f));
    setActivePreset(null);
  }, []);

  const applyPreset = useCallback((key) => {
    if (key === 'showAll') {
      setFilters([]);
      setActivePreset('showAll');
    } else {
      setFilters(PRESETS[key].map(f => ({ ...f })));
      setActivePreset(key);
    }
  }, []);

  const filtered = useMemo(() => {
    if (filters.length === 0) return companies;
    return companies.filter(c => filters.every(f => applyFilter(c, f)));
  }, [filters]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av, bv;
      if (sortKey === 'name') {
        av = a.name[language];
        bv = b.name[language];
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      av = getFieldValue(a, sortKey);
      bv = getFieldValue(b, sortKey);
      return sortDir === 'asc' ? av - bv : bv - av;
    });
  }, [filtered, sortKey, sortDir, language]);

  const handleSort = useCallback((key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }, [sortKey]);

  const matchText = useMemo(() => {
    return t('screener.matches').replace('{count}', filtered.length);
  }, [filtered.length, t]);

  const handleExport = useCallback(() => {
    const headers = ['Rank', 'Name', 'Ticker', 'Price', 'Change%', 'P/E', 'Div Yield', 'ROE', 'EBITDA Margin', 'D/E', 'Fleet Util'];
    const rows = sorted.map((c, i) => [
      i + 1,
      c.name[language],
      c.ticker,
      `${c.currency} ${c.stockPrice}`,
      c.change.toFixed(2),
      c.peRatio,
      c.dividendYield,
      c.roe,
      c.ebitdaMargin,
      c.debtEquity,
      c.fleetUtilization,
    ]);
    const csv = generateCSV(headers, rows);
    downloadCSV(csv, 'screener-results.csv');
  }, [sorted, language]);

  const SortIcon = ({ field }) => {
    if (sortKey !== field) return <ArrowUpDown className="w-3 h-3 text-slate-600" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-blue-400" />
      : <ChevronDown className="w-3 h-3 text-blue-400" />;
  };

  const presetButtons = [
    { key: 'value', label: t('screener.value') },
    { key: 'growth', label: t('screener.growth') },
    { key: 'highDividend', label: t('screener.highDividend') },
    { key: 'lowDebt', label: t('screener.lowDebt') },
    { key: 'showAll', label: t('screener.showAll') },
  ];

  const columns = [
    { key: 'rank', label: t('screener.rank'), sortable: false },
    { key: 'name', label: t('dashboard.company'), sortable: true },
    { key: 'ticker', label: t('dashboard.ticker'), sortable: false },
    { key: 'stockPrice', label: t('company.stockPrice'), sortable: true },
    { key: 'change', label: t('dashboard.change'), sortable: true },
    { key: 'peRatio', label: t('screener.field.peRatio'), sortable: true },
    { key: 'dividendYield', label: t('screener.field.dividendYield'), sortable: true },
    { key: 'roe', label: t('screener.field.roe'), sortable: true },
    { key: 'ebitdaMargin', label: t('screener.field.ebitdaMargin'), sortable: true },
    { key: 'debtEquity', label: t('screener.field.debtEquity'), sortable: true },
    { key: 'fleetUtilization', label: t('screener.field.fleetUtilization'), sortable: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">{t('screener.title')}</h1>
      </div>

      {/* Preset Filters */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-slate-400">{t('screener.presets')}</h2>
        <div className="flex flex-wrap gap-2">
          {presetButtons.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                activePreset === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Filter Builder */}
      <div className="space-y-3">
        {filters.map((filter, index) => (
          <div key={index} className="flex flex-wrap items-center gap-2 bg-[#111827] rounded-lg px-4 py-2.5">
            <select
              value={filter.field}
              onChange={(e) => updateFilter(index, 'field', e.target.value)}
              className="bg-slate-800 text-slate-200 text-sm rounded-md px-3 py-1.5 border border-slate-700 focus:border-blue-500 focus:outline-none"
            >
              {FIELDS.map(f => (
                <option key={f} value={f}>{t(`screener.field.${f}`)}</option>
              ))}
            </select>

            <select
              value={filter.operator}
              onChange={(e) => updateFilter(index, 'operator', e.target.value)}
              className="bg-slate-800 text-slate-200 text-sm rounded-md px-3 py-1.5 border border-slate-700 focus:border-blue-500 focus:outline-none"
            >
              {OPERATORS.map(op => (
                <option key={op} value={op}>{t(`screener.operator.${op}`)}</option>
              ))}
            </select>

            <input
              type="number"
              value={filter.value1}
              onChange={(e) => updateFilter(index, 'value1', e.target.value)}
              placeholder="0"
              className="w-24 bg-slate-800 text-slate-200 text-sm rounded-md px-3 py-1.5 border border-slate-700 focus:border-blue-500 focus:outline-none"
            />

            {filter.operator === 'between' && (
              <>
                <span className="text-slate-500 text-sm">{t('screener.and')}</span>
                <input
                  type="number"
                  value={filter.value2}
                  onChange={(e) => updateFilter(index, 'value2', e.target.value)}
                  placeholder="0"
                  className="w-24 bg-slate-800 text-slate-200 text-sm rounded-md px-3 py-1.5 border border-slate-700 focus:border-blue-500 focus:outline-none"
                />
              </>
            )}

            <button
              onClick={() => removeFilter(index)}
              className="p-1 rounded hover:bg-slate-700 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        <button
          onClick={addFilter}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-sm text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {t('screener.addFilter')}
        </button>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{matchText}</p>
        <ExportButton onClick={handleExport} label={t('common.csv')} />
      </div>

      {/* Results Table */}
      {sorted.length === 0 ? (
        <div className="text-center py-12 text-slate-500">{t('screener.noResults')}</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800/60">
                {columns.map(col => (
                  <th
                    key={col.key}
                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                    className={`px-4 py-3 text-left text-xs font-medium text-slate-400 whitespace-nowrap ${
                      col.sortable ? 'cursor-pointer hover:text-slate-200 select-none' : ''
                    }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {col.sortable && <SortIcon field={col.key} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((company, index) => (
                <tr
                  key={company.id}
                  onClick={() => navigate(`/company/${company.id}`)}
                  className="border-b border-slate-800/30 hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                  <td className="px-4 py-3 text-white font-medium whitespace-nowrap">
                    <span className="mr-2">{company.logo}</span>
                    {company.name[language]}
                  </td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">{company.ticker}</td>
                  <td className="px-4 py-3 text-white">{formatCurrency(company.stockPrice, company.currency)}</td>
                  <td className={`px-4 py-3 font-medium ${company.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {formatPercent(company.change)}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{company.peRatio.toFixed(1)}</td>
                  <td className="px-4 py-3 text-slate-300">{company.dividendYield.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-slate-300">{company.roe.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-slate-300">{company.ebitdaMargin.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-slate-300">{company.debtEquity.toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-300">{company.fleetUtilization.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
