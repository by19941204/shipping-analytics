import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { companies } from '../data/companies';
import { useLanguage } from '../i18n/LanguageContext';
import { toUSD, formatCurrency } from '../utils/format';

const COUNTRY_FLAGS = {
  JP: '\u{1F1EF}\u{1F1F5}',
  DK: '\u{1F1E9}\u{1F1F0}',
  CN: '\u{1F1E8}\u{1F1F3}',
  TW: '\u{1F1F9}\u{1F1FC}',
  DE: '\u{1F1E9}\u{1F1EA}',
  IL: '\u{1F1EE}\u{1F1F1}',
  KR: '\u{1F1F0}\u{1F1F7}',
};

function getChangeColor(change) {
  if (change <= -5) return '#991b1b';
  if (change <= -2) return '#dc2626';
  if (change < -0.1) return 'rgba(239,68,68,0.5)';
  if (change <= 0.1) return '#374151';
  if (change <= 2) return 'rgba(34,197,94,0.5)';
  if (change <= 5) return '#16a34a';
  return '#15803d';
}

function getTextColor(change) {
  if (Math.abs(change) < 0.1) return '#9ca3af';
  return '#ffffff';
}

const SECTOR_LABELS = {
  container: { en: 'Container', ja: 'コンテナ', zh: '集装箱' },
  diversified: { en: 'Diversified', ja: '総合', zh: '综合' },
  bulk: { en: 'Bulk', ja: 'ばら積み', zh: '散货' },
  tanker: { en: 'Tanker', ja: 'タンカー', zh: '油轮' },
};

export default function Heatmap() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('marketCap');

  const viewModes = [
    { key: 'marketCap', label: t('dashboard.byMarketCap') },
    { key: 'sector', label: t('dashboard.bySector') },
    { key: 'alliance', label: t('dashboard.byAlliance') },
  ];

  // Compute USD market caps for sizing
  const companiesWithUSD = useMemo(() =>
    companies.map(c => ({
      ...c,
      marketCapUSD: toUSD(c.marketCap, c.currency),
    })),
    []
  );

  const totalUSD = useMemo(() =>
    companiesWithUSD.reduce((sum, c) => sum + c.marketCapUSD, 0),
    [companiesWithUSD]
  );

  // Group companies based on view mode
  const groups = useMemo(() => {
    if (viewMode === 'marketCap') {
      return [{ label: null, companies: companiesWithUSD }];
    }
    if (viewMode === 'sector') {
      const sectorMap = {};
      companiesWithUSD.forEach(c => {
        const s = c.sector || 'other';
        if (!sectorMap[s]) sectorMap[s] = [];
        sectorMap[s].push(c);
      });
      return Object.entries(sectorMap).map(([key, comps]) => ({
        label: SECTOR_LABELS[key]?.[language] || key,
        companies: comps,
      }));
    }
    // alliance
    const allianceMap = {};
    companiesWithUSD.forEach(c => {
      const a = c.alliance || 'Independent';
      if (!allianceMap[a]) allianceMap[a] = [];
      allianceMap[a].push(c);
    });
    return Object.entries(allianceMap).map(([key, comps]) => ({
      label: key,
      companies: comps,
    }));
  }, [viewMode, companiesWithUSD, language]);

  function renderTile(company, sizePercent) {
    const bgColor = getChangeColor(company.change);
    const textColor = getTextColor(company.change);
    const changePrefix = company.change >= 0 ? '+' : '';
    const flag = COUNTRY_FLAGS[company.country] || '';
    // Determine font sizes based on tile relative size
    const isLarge = sizePercent > 15;
    const isMedium = sizePercent > 8;

    return (
      <div
        key={company.id}
        onClick={() => navigate(`/company/${company.id}`)}
        className="relative cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:z-10 hover:ring-1 hover:ring-white/30 rounded-md overflow-hidden"
        style={{
          backgroundColor: bgColor,
          flex: `${Math.max(sizePercent, 4)} 0 0%`,
          minWidth: 0,
          minHeight: '80px',
        }}
      >
        <div className="absolute inset-0 p-2 sm:p-3 flex flex-col justify-center items-center text-center" style={{ color: textColor }}>
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-xs sm:text-sm">{flag}</span>
            <span className={`font-bold truncate max-w-full ${isLarge ? 'text-sm sm:text-base' : isMedium ? 'text-xs sm:text-sm' : 'text-[10px] sm:text-xs'}`}>
              {company.name[language]}
            </span>
          </div>
          <div className={`font-semibold ${isLarge ? 'text-sm' : isMedium ? 'text-xs' : 'text-[10px]'}`}>
            {formatCurrency(company.stockPrice, company.currency)}
          </div>
          <div className={`font-bold ${isLarge ? 'text-sm' : isMedium ? 'text-xs' : 'text-[10px]'} ${company.change >= 0 ? 'text-emerald-200' : 'text-red-200'}`}
            style={{ color: Math.abs(company.change) < 0.1 ? '#9ca3af' : undefined }}
          >
            {changePrefix}{company.change.toFixed(2)}%
          </div>
        </div>
      </div>
    );
  }

  function renderGroup(group) {
    const groupTotal = group.companies.reduce((s, c) => s + c.marketCapUSD, 0);
    // Sort by market cap descending within group
    const sorted = [...group.companies].sort((a, b) => b.marketCapUSD - a.marketCapUSD);

    // Split into rows: first row gets the top companies, second row gets the rest
    const topCount = Math.ceil(sorted.length / 2);
    const topRow = sorted.slice(0, topCount);
    const bottomRow = sorted.slice(topCount);

    const renderRow = (row) => (
      <div className="flex gap-1 w-full" style={{ minHeight: '80px' }}>
        {row.map(c => {
          const pct = (c.marketCapUSD / (viewMode === 'marketCap' ? totalUSD : groupTotal)) * 100;
          return renderTile(c, pct);
        })}
      </div>
    );

    return (
      <div key={group.label || 'all'} className="flex-1 min-w-0">
        {group.label && (
          <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 px-1">
            {group.label}
          </div>
        )}
        <div className="flex flex-col gap-1">
          {renderRow(topRow)}
          {bottomRow.length > 0 && renderRow(bottomRow)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">{t('dashboard.heatmap')}</h2>
        <div className="flex items-center gap-1 bg-[var(--bg-card)]/50 rounded-lg p-0.5">
          {viewModes.map(mode => (
            <button
              key={mode.key}
              onClick={() => setViewMode(mode.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer ${
                viewMode === mode.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]/50'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Color legend */}
      <div className="flex items-center justify-center gap-1 mb-4 text-[10px] text-[var(--text-secondary)]">
        <span>-5%+</span>
        <div className="flex gap-0 rounded overflow-hidden">
          {[
            { bg: '#991b1b', label: '' },
            { bg: '#dc2626', label: '' },
            { bg: 'rgba(239,68,68,0.5)', label: '' },
            { bg: '#374151', label: '' },
            { bg: 'rgba(34,197,94,0.5)', label: '' },
            { bg: '#16a34a', label: '' },
            { bg: '#15803d', label: '' },
          ].map((c, i) => (
            <div key={i} className="w-6 h-3" style={{ backgroundColor: c.bg }} />
          ))}
        </div>
        <span>+5%+</span>
      </div>

      {/* Heatmap grid */}
      <div className={`flex gap-3 ${viewMode !== 'marketCap' ? 'flex-col sm:flex-row' : 'flex-col'}`}>
        {groups.map(group => renderGroup(group))}
      </div>
    </div>
  );
}
