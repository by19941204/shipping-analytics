import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BarChart3, Building2, Newspaper, GitCompareArrows, Star, Filter, TrendingUp } from 'lucide-react';
import { companies } from '../data/companies';
import { useLanguage } from '../i18n/LanguageContext';

const pages = [
  { id: 'dashboard', path: '/', icon: BarChart3, labelKey: 'nav.dashboard' },
  { id: 'companies', path: '/companies', icon: Building2, labelKey: 'nav.companies' },
  { id: 'news', path: '/news', icon: Newspaper, labelKey: 'nav.news' },
  { id: 'compare', path: '/compare', icon: GitCompareArrows, labelKey: 'nav.compare' },
  { id: 'watchlist', path: '/watchlist', icon: Star, labelKey: 'nav.watchlist' },
  { id: 'screener', path: '/screener', icon: Filter, labelKey: 'nav.screener' },
  { id: 'market', path: '/market-analysis', icon: TrendingUp, labelKey: 'nav.market' },
];

function fuzzyMatch(text, query) {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  if (lower.includes(q)) return true;
  let qi = 0;
  for (let i = 0; i < lower.length && qi < q.length; i++) {
    if (lower[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) {
      return {
        pages: pages.map((p) => ({ ...p, label: t(p.labelKey) })),
        companies: companies.slice(0, 5).map((c) => ({
          id: c.id,
          name: c.name[language],
          ticker: c.ticker,
          logo: c.logo,
          path: `/company/${c.id}`,
        })),
      };
    }

    const matchedPages = pages
      .filter((p) => fuzzyMatch(t(p.labelKey), q))
      .map((p) => ({ ...p, label: t(p.labelKey) }));

    const matchedCompanies = companies
      .filter((c) =>
        fuzzyMatch(c.name.en, q) ||
        fuzzyMatch(c.name.ja, q) ||
        fuzzyMatch(c.name.zh, q) ||
        fuzzyMatch(c.ticker, q)
      )
      .map((c) => ({
        id: c.id,
        name: c.name[language],
        ticker: c.ticker,
        logo: c.logo,
        path: `/company/${c.id}`,
      }));

    return { pages: matchedPages, companies: matchedCompanies };
  }, [query, language, t]);

  const allItems = useMemo(() => [
    ...results.pages.map((p) => ({ type: 'page', ...p })),
    ...results.companies.map((c) => ({ type: 'company', ...c })),
  ], [results]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item) => {
    navigate(item.path);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, allItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && allItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(allItems[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (listRef.current) {
      const selected = listRef.current.querySelector('[data-selected="true"]');
      selected?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!open) return null;

  let itemIndex = -1;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)]/95 backdrop-blur shadow-2xl">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-[var(--border-color)] px-4 py-3">
          <Search className="w-5 h-5 text-[var(--text-secondary)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('search.placeholder')}
            className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-[var(--bg-card)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-muted)] border border-[var(--border-color)]">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
          {allItems.length === 0 && (
            <div className="py-8 text-center text-sm text-[var(--text-muted)]">
              {t('search.noResults')}
            </div>
          )}

          {results.pages.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {t('search.pages')}
              </div>
              {results.pages.map((page) => {
                itemIndex++;
                const idx = itemIndex;
                const Icon = page.icon;
                return (
                  <button
                    key={page.id}
                    data-selected={selectedIndex === idx}
                    onClick={() => handleSelect({ ...page, type: 'page' })}
                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors cursor-pointer ${
                      selectedIndex === idx
                        ? 'bg-blue-500/15 text-[var(--text-primary)]'
                        : 'text-[var(--text-primary)] hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[var(--text-secondary)]" />
                    <span>{page.label}</span>
                  </button>
                );
              })}
            </>
          )}

          {results.companies.length > 0 && (
            <>
              <div className="px-2 py-1.5 mt-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {t('search.companies')}
              </div>
              {results.companies.map((company) => {
                itemIndex++;
                const idx = itemIndex;
                return (
                  <button
                    key={company.id}
                    data-selected={selectedIndex === idx}
                    onClick={() => handleSelect({ ...company, type: 'company' })}
                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors cursor-pointer ${
                      selectedIndex === idx
                        ? 'bg-blue-500/15 text-[var(--text-primary)]'
                        : 'text-[var(--text-primary)] hover:bg-white/5'
                    }`}
                  >
                    <span className="text-base">{company.logo}</span>
                    <span className="flex-1 text-left">{company.name}</span>
                    <span className="text-xs font-mono text-[var(--text-muted)]">{company.ticker}</span>
                  </button>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
