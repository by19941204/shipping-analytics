import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const shortcuts = [
  { keys: ['Ctrl', 'K'], action: 'shortcuts.commandPalette' },
  { keys: ['G', 'D'], action: 'shortcuts.goToDashboard' },
  { keys: ['G', 'C'], action: 'shortcuts.goToCompanies' },
  { keys: ['G', 'N'], action: 'shortcuts.goToNews' },
  { keys: ['G', 'X'], action: 'shortcuts.goToCompare' },
  { keys: ['G', 'W'], action: 'shortcuts.goToWatchlist' },
  { keys: ['G', 'S'], action: 'shortcuts.goToScreener' },
  { keys: ['G', 'M'], action: 'shortcuts.goToMarket' },
  { keys: ['?'], action: 'shortcuts.toggleHelp' },
  { keys: ['Esc'], action: 'shortcuts.closeModal' },
];

function KeyBadge({ children }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 text-xs font-mono font-medium text-slate-300 bg-slate-800/80 border border-slate-600/50 rounded-md shadow-sm">
      {children}
    </kbd>
  );
}

export default function ShortcutsHelp({ open, onClose }) {
  const { t } = useLanguage();
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleEsc = () => onClose();
    window.addEventListener('close-modals', handleEsc);
    return () => window.removeEventListener('close-modals', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="w-full max-w-md mx-4 rounded-xl border border-slate-700/60 bg-[#111827] shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60">
          <h2 className="text-sm font-semibold text-white">{t('shortcuts.title')}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-3">
          {shortcuts.map(({ keys, action }) => (
            <div key={action} className="flex items-center justify-between">
              <span className="text-sm text-slate-300">{t(action)}</span>
              <div className="flex items-center gap-1">
                {keys.map((k, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <span className="text-xs text-slate-600 mx-0.5">+</span>}
                    <KeyBadge>{k}</KeyBadge>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
