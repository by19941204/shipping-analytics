import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Newspaper, Calendar, Building2, ExternalLink, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { companies } from '../data/companies';
import { useLanguage } from '../i18n/LanguageContext';
import { useNews } from '../hooks/useNews';
import Breadcrumbs from '../components/Breadcrumbs';

const categories = ['all', 'earnings', 'fleet', 'market', 'regulation'];

const categoryStyles = {
  earnings: 'bg-emerald-500/10 text-emerald-400',
  fleet: 'bg-blue-500/10 text-blue-400',
  market: 'bg-amber-500/10 text-amber-400',
  regulation: 'bg-purple-500/10 text-purple-400',
};

function formatDate(dateStr, language) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString(
    language === 'ja' ? 'ja-JP' : language === 'zh' ? 'zh-CN' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' }
  );
}

export default function News() {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selected, setSelected] = useState(() => {
    const cat = searchParams.get('category');
    if (cat && categories.includes(cat)) return cat;
    return 'all';
  });

  // Sync category to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (selected !== 'all') {
      params.set('category', selected);
    }
    setSearchParams(params, { replace: true });
  }, [selected, setSearchParams]);

  const { news, loading, lastFetched, liveCount, refresh } = useNews(language);

  const filtered = useMemo(() => {
    const items = selected === 'all'
      ? [...news]
      : news.filter((n) => n.category === selected);
    return items;
  }, [selected, news]);

  return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumbs items={[
        { label: t('breadcrumb.home'), path: '/' },
        { label: t('nav.news'), path: '/news' },
      ]} />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Newspaper className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">{t('news.title')}</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="flex items-center gap-2 text-xs">
              {liveCount > 0 ? (
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Wifi className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('news.live')}</span>
                  <span className="bg-emerald-500/15 px-1.5 py-0.5 rounded text-emerald-400">{liveCount}</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-slate-500">
                  <WifiOff className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('news.offline')}</span>
                </span>
              )}
            </div>
            {/* Refresh button */}
            <button
              onClick={refresh}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? t('news.refreshing') : t('news.refresh')}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-slate-400 text-sm">{t('news.subtitle')}</p>
          {lastFetched && (
            <p className="text-slate-600 text-xs">
              {t('common.lastUpdated')}: {lastFetched.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              selected === cat
                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {t(`news.${cat}`)}
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading && news.length === 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-[#111827] border border-slate-800/60 rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-20 mb-3" />
              <div className="h-5 bg-slate-800 rounded w-3/4 mb-2" />
              <div className="h-4 bg-slate-800 rounded w-full mb-1" />
              <div className="h-4 bg-slate-800 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* News Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map((article) => {
          const company = article.companyId
            ? companies.find((c) => c.id === article.companyId)
            : null;

          const title = typeof article.title === 'object'
            ? article.title[language] || article.title.en
            : article.title;

          const summary = typeof article.description === 'object'
            ? article.description[language] || article.description.en
            : article.description || '';

          return (
            <article
              key={article.id}
              className="bg-[#111827] border border-slate-800/60 rounded-xl p-5 hover:border-slate-700 hover:bg-[#151d2e] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      categoryStyles[article.category] || categoryStyles.market
                    }`}
                  >
                    {t(`news.${article.category}`)}
                  </span>
                  {!article.isStatic && (
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-500">
                      {t('news.live')}
                    </span>
                  )}
                </div>
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="w-3 h-3" />
                  {formatDate(article.date, language)}
                </span>
              </div>

              {article.link ? (
                <a href={article.link} target="_blank" rel="noopener noreferrer" className="block group">
                  <h2 className="text-white font-semibold leading-snug mb-2 group-hover:text-blue-400 transition-colors">
                    {title}
                  </h2>
                </a>
              ) : (
                <h2 className="text-white font-semibold leading-snug mb-2">
                  {title}
                </h2>
              )}

              {summary && (
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4">
                  {summary}
                </p>
              )}

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <ExternalLink className="w-3 h-3" />
                  {article.source}
                </span>

                {company && (
                  <Link
                    to={`/company/${company.id}`}
                    className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Building2 className="w-3 h-3" />
                    {company.name[language]}
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="text-center py-16 text-slate-500">
          {t('common.noData')}
        </div>
      )}
    </div>
  );
}
