import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Trash2, TrendingUp, TrendingDown, Briefcase } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useWatchlist } from '../contexts/WatchlistContext';
import { companies } from '../data/companies';
import Breadcrumbs from '../components/Breadcrumbs';
import { formatCurrency, formatPercent } from '../utils/format';

export default function Watchlist() {
  const { t, language } = useLanguage();
  const { watchlist, toggleWatchlist, updatePosition, getPosition } = useWatchlist();
  const navigate = useNavigate();

  const watchedCompanies = companies.filter((c) => watchlist.has(c.id));

  // Calculate portfolio summary
  const summary = watchedCompanies.reduce(
    (acc, company) => {
      const pos = getPosition(company.id);
      const marketValue = pos.shares * company.stockPrice;
      const totalCost = pos.shares * pos.costBasis;
      const gainLoss = marketValue - totalCost;
      acc.totalValue += marketValue;
      acc.totalGainLoss += gainLoss;
      if (pos.shares > 0) acc.positions += 1;
      return acc;
    },
    { totalValue: 0, totalGainLoss: 0, positions: 0 }
  );

  if (watchedCompanies.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs items={[
            { label: t('breadcrumb.home'), path: '/' },
            { label: t('nav.watchlist'), path: '/watchlist' },
          ]} />
          <h1 className="mb-8 text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
            {t('watchlist.title')}
          </h1>
          <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] py-20">
            <Star className="mb-4 h-12 w-12 text-[var(--text-muted)]" />
            <p className="text-lg font-medium text-[var(--text-secondary)]">
              {t('watchlist.empty')}
            </p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {t('watchlist.addPrompt')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Breadcrumbs items={[
          { label: t('breadcrumb.home'), path: '/' },
          { label: t('nav.watchlist'), path: '/watchlist' },
        ]} />

        <h1 className="mb-8 text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
          {t('watchlist.title')}
        </h1>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-4 w-4 text-blue-400" />
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                {t('watchlist.totalValue')}
              </p>
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {summary.totalValue > 0 ? summary.totalValue.toLocaleString() : '--'}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
            <div className="flex items-center gap-2 mb-2">
              {summary.totalGainLoss >= 0 ? (
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                {t('watchlist.gainLoss')}
              </p>
            </div>
            <p className={`text-2xl font-bold ${summary.totalGainLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {summary.totalGainLoss !== 0 ? summary.totalGainLoss.toLocaleString() : '--'}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-yellow-400" />
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                {t('watchlist.positions')}
              </p>
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {summary.positions}
            </p>
          </div>
        </div>

        {/* Watchlist Table */}
        <div className="overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium">
                  {t('dashboard.company')}
                </th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium">
                  {t('dashboard.ticker')}
                </th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium text-right">
                  {t('company.stockPrice')}
                </th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium text-right">
                  {t('dashboard.change')}
                </th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium text-right">
                  {t('watchlist.shares')}
                </th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium text-right">
                  {t('watchlist.costBasis')}
                </th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium text-right">
                  {t('watchlist.marketValue')}
                </th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium text-right">
                  {t('watchlist.gainLoss')}
                </th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium text-right">
                  {t('watchlist.gainLoss')} %
                </th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium text-center">
                  {t('watchlist.remove')}
                </th>
              </tr>
            </thead>
            <tbody>
              {watchedCompanies.map((company) => (
                <WatchlistRow
                  key={company.id}
                  company={company}
                  position={getPosition(company.id)}
                  language={language}
                  onNavigate={() => navigate(`/company/${company.id}`)}
                  onUpdatePosition={(shares, costBasis) => updatePosition(company.id, shares, costBasis)}
                  onRemove={() => toggleWatchlist(company.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function WatchlistRow({ company, position, language, onNavigate, onUpdatePosition, onRemove }) {
  const [editingShares, setEditingShares] = useState(false);
  const [editingCost, setEditingCost] = useState(false);
  const [sharesValue, setSharesValue] = useState(String(position.shares));
  const [costValue, setCostValue] = useState(String(position.costBasis));

  const isPositive = company.change >= 0;
  const marketValue = position.shares * company.stockPrice;
  const totalCost = position.shares * position.costBasis;
  const gainLoss = marketValue - totalCost;
  const gainLossPct = totalCost > 0 ? ((gainLoss / totalCost) * 100) : 0;

  const handleSharesSave = () => {
    const parsed = parseFloat(sharesValue) || 0;
    onUpdatePosition(parsed, position.costBasis);
    setEditingShares(false);
  };

  const handleCostSave = () => {
    const parsed = parseFloat(costValue) || 0;
    onUpdatePosition(position.shares, parsed);
    setEditingCost(false);
  };

  return (
    <tr className="border-b border-[var(--border-color)] transition-colors hover:bg-white/[0.02]">
      <td
        className="px-4 py-3 cursor-pointer"
        onClick={onNavigate}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{company.logo}</span>
          <span className="font-medium text-[var(--text-primary)] hover:text-blue-400 transition-colors">
            {company.name[language]}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)]">{company.ticker}</td>
      <td className="px-4 py-3 text-right font-medium text-[var(--text-primary)]">
        {formatCurrency(company.stockPrice, company.currency)}
      </td>
      <td className="px-4 py-3 text-right">
        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
          isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {formatPercent(company.change)}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        {editingShares ? (
          <input
            type="number"
            value={sharesValue}
            onChange={(e) => setSharesValue(e.target.value)}
            onBlur={handleSharesSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSharesSave()}
            className="w-20 rounded border border-blue-500/50 bg-[var(--bg-primary)] px-2 py-1 text-right text-xs text-[var(--text-primary)] outline-none"
            autoFocus
          />
        ) : (
          <span
            className="cursor-pointer rounded px-2 py-1 text-[var(--text-primary)] hover:bg-white/5 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSharesValue(String(position.shares));
              setEditingShares(true);
            }}
          >
            {position.shares}
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        {editingCost ? (
          <input
            type="number"
            value={costValue}
            onChange={(e) => setCostValue(e.target.value)}
            onBlur={handleCostSave}
            onKeyDown={(e) => e.key === 'Enter' && handleCostSave()}
            className="w-24 rounded border border-blue-500/50 bg-[var(--bg-primary)] px-2 py-1 text-right text-xs text-[var(--text-primary)] outline-none"
            autoFocus
          />
        ) : (
          <span
            className="cursor-pointer rounded px-2 py-1 text-[var(--text-primary)] hover:bg-white/5 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setCostValue(String(position.costBasis));
              setEditingCost(true);
            }}
          >
            {formatCurrency(position.costBasis, company.currency)}
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-right font-medium text-[var(--text-primary)]">
        {position.shares > 0 ? formatCurrency(marketValue, company.currency) : '--'}
      </td>
      <td className="px-4 py-3 text-right">
        {position.shares > 0 ? (
          <span className={gainLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}>
            {gainLoss >= 0 ? '+' : ''}{formatCurrency(gainLoss, company.currency)}
          </span>
        ) : '--'}
      </td>
      <td className="px-4 py-3 text-right">
        {position.shares > 0 && totalCost > 0 ? (
          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
            gainLossPct >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
          }`}>
            {gainLossPct >= 0 ? '+' : ''}{gainLossPct.toFixed(2)}%
          </span>
        ) : '--'}
      </td>
      <td className="px-4 py-3 text-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}
