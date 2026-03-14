import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Search } from 'lucide-react';
import { companies } from '../data/companies';
import { useLanguage } from '../i18n/LanguageContext';
import Breadcrumbs from '../components/Breadcrumbs';
import WatchlistButton from '../components/WatchlistButton';
import { formatMarketCap, formatPercent, formatCurrency } from '../utils/format';

const countryFlags = {
  JP: '\u{1F1EF}\u{1F1F5}',
  DK: '\u{1F1E9}\u{1F1F0}',
  CN: '\u{1F1E8}\u{1F1F3}',
  TW: '\u{1F1F9}\u{1F1FC}',
  DE: '\u{1F1E9}\u{1F1EA}',
  IL: '\u{1F1EE}\u{1F1F1}',
  KR: '\u{1F1F0}\u{1F1F7}',
};

export default function Companies() {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return companies;
    const q = search.toLowerCase();
    return companies.filter((c) =>
      c.name[language]?.toLowerCase().includes(q) ||
      c.ticker.toLowerCase().includes(q)
    );
  }, [search, language]);

  return (
    <div className="min-h-screen bg-[#0b0e17] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Breadcrumbs items={[
          { label: t('breadcrumb.home'), path: '/' },
          { label: t('nav.companies'), path: '/companies' },
        ]} />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            {t('nav.companies')}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('common.search')}
            className="w-full rounded-xl border border-slate-800/60 bg-[#111827] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:bg-[#0f1521]"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((company) => {
            const isPositive = company.change >= 0;
            const sparkData = company.stockHistory.slice(-30);

            return (
              <Link
                key={company.id}
                to={`/company/${company.id}`}
                className="group relative rounded-xl border border-slate-800/60 bg-[#111827] p-5 transition-all duration-200 hover:border-slate-700/80 hover:bg-[#151d2e] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
              >
                <div className="absolute top-3 right-3 z-10">
                  <WatchlistButton companyId={company.id} size="sm" />
                </div>
                {/* Card Header */}
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{company.logo}</span>
                    <div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition">
                        {company.name[language]}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">
                        {company.ticker} {countryFlags[company.country]}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`mr-6 inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                      isPositive
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {formatPercent(company.change)}
                  </span>
                </div>

                {/* Price & Sparkline */}
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <p className="text-lg font-bold text-white">
                      {formatCurrency(company.stockPrice, company.currency)}
                    </p>
                    <p className="text-xs text-slate-500">{t('company.stockPrice')}</p>
                  </div>
                  <div className="h-12 w-28">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparkData}>
                        <defs>
                          <linearGradient id={`spark-${company.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke={isPositive ? '#10b981' : '#ef4444'}
                          strokeWidth={1.5}
                          fill={`url(#spark-${company.id})`}
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 border-t border-slate-800/60 pt-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                      {t('company.marketCap')}
                    </p>
                    <p className="text-xs font-medium text-slate-300">
                      {formatMarketCap(company.marketCap, language)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                      {t('company.peRatio')}
                    </p>
                    <p className="text-xs font-medium text-slate-300">
                      {company.peRatio}x
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                      {t('company.dividendYield')}
                    </p>
                    <p className="text-xs font-medium text-slate-300">
                      {company.dividendYield}%
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-slate-500">{t('common.noData')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
