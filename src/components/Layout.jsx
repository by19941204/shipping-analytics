import { NavLink, Outlet } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  BarChart3, Building2, Newspaper, GitCompareArrows, Star, Filter,
  Globe, Ship, Menu, X, Search, Sun, Moon, Keyboard, TrendingUp
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import CommandPalette from './CommandPalette';
import ShortcutsHelp from './ShortcutsHelp';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';

const langs = [
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'en', label: 'English' },
];

export default function Layout() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const toggleShortcutsHelp = useCallback(() => setShortcutsOpen((v) => !v), []);
  useKeyboardShortcuts({ onToggleHelp: toggleShortcutsHelp });

  useEffect(() => {
    const handleOpenPalette = () => setPaletteOpen((v) => !v);
    const handleCloseModals = () => {
      setPaletteOpen(false);
      setShortcutsOpen(false);
    };
    window.addEventListener('open-command-palette', handleOpenPalette);
    window.addEventListener('close-modals', handleCloseModals);
    return () => {
      window.removeEventListener('open-command-palette', handleOpenPalette);
      window.removeEventListener('close-modals', handleCloseModals);
    };
  }, []);

  const navItems = [
    { to: '/', icon: BarChart3, label: t('nav.dashboard') },
    { to: '/companies', icon: Building2, label: t('nav.companies') },
    { to: '/news', icon: Newspaper, label: t('nav.news') },
    { to: '/compare', icon: GitCompareArrows, label: t('nav.compare') },
    { to: '/watchlist', icon: Star, label: t('nav.watchlist') },
    { to: '/screener', icon: Filter, label: t('nav.screener') },
    { to: '/market-analysis', icon: TrendingUp, label: t('nav.market') },
  ];

  return (
    <>
      <style>{`
        .theme-wrapper {
          background-color: var(--bg-primary);
          color: var(--text-primary);
        }
      `}</style>
    <div className="theme-wrapper flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[var(--bg-card)]/80 backdrop-blur-xl border-r border-[var(--border-color)]
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-[var(--border-color)]">
          <div className="p-1.5 rounded-lg bg-blue-500/10">
            <Ship className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">ShipTracker</h1>
            <p className="text-[11px] text-[var(--text-muted)]">Maritime Analytics</p>
          </div>
        </div>

        <nav className="mt-4 px-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm shadow-blue-500/5'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <Icon className="w-4.5 h-4.5" />
              {label}
            </NavLink>
          ))}
          <button
            onClick={() => setPaletteOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 border border-transparent transition-all duration-200 cursor-pointer"
          >
            <Search className="w-4.5 h-4.5" />
            <span className="flex-1 text-left">{t('search.placeholder')}</span>
            <kbd className="hidden lg:inline text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-card)]/50 px-1.5 py-0.5 rounded border border-[var(--border-color)]">
              ⌘K
            </kbd>
          </button>
        </nav>

        {/* Shortcuts hint + Theme Toggle & Language Switcher */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border-color)]">
          <button
            onClick={() => setShortcutsOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-1.5 mb-3 rounded-md text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-white/5 transition-all duration-200 cursor-pointer"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span className="flex-1 text-left">{t('shortcuts.title')}</span>
            <kbd className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-card)]/50 px-1.5 py-0.5 rounded border border-[var(--border-color)]">?</kbd>
          </button>
          {/* Theme Toggle */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              {theme === 'dark' ? t('theme.dark') : t('theme.light')}
            </div>
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all duration-200 cursor-pointer"
              title={theme === 'dark' ? t('theme.light') : t('theme.dark')}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-2 mb-2 text-xs text-[var(--text-muted)]">
            <Globe className="w-3.5 h-3.5" />
            {t('common.language')}
          </div>
          <div className="flex gap-1">
            {langs.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer ${
                  language === l.code
                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/25'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-white/5 border border-transparent'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-auto">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-[var(--bg-card)]/80 backdrop-blur-xl border-b border-[var(--border-color)]">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Ship className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-semibold text-[var(--text-primary)]">ShipTracker</span>
        </div>

        <div className="flex-1 p-6 lg:p-8">
          <Outlet />
        </div>

        {/* Data Attribution Footer */}
        <footer className="border-t border-[var(--border-color)] py-2 px-4">
          <p className="text-xs text-[var(--text-muted)]">{t('footer.disclaimer')}</p>
        </footer>
      </main>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <ShortcutsHelp open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
    </>
  );
}
