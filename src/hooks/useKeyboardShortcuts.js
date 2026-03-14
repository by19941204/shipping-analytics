import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const NAV_SHORTCUTS = {
  d: '/',
  c: '/companies',
  n: '/news',
  x: '/compare',
  w: '/watchlist',
  s: '/screener',
  m: '/market-analysis',
};

export default function useKeyboardShortcuts({ onToggleHelp }) {
  const navigate = useNavigate();
  const gPrefixRef = useRef(false);
  const gTimerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) {
        return;
      }

      // Ctrl/Cmd+K → command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('open-command-palette'));
        return;
      }

      // Esc → close any modal
      if (e.key === 'Escape') {
        window.dispatchEvent(new CustomEvent('close-modals'));
        return;
      }

      // ? → toggle shortcuts help
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        onToggleHelp?.();
        return;
      }

      // G prefix system
      if (e.key === 'g' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        gPrefixRef.current = true;
        clearTimeout(gTimerRef.current);
        gTimerRef.current = setTimeout(() => {
          gPrefixRef.current = false;
        }, 1000);
        return;
      }

      if (gPrefixRef.current) {
        const path = NAV_SHORTCUTS[e.key];
        if (path) {
          e.preventDefault();
          navigate(path);
          gPrefixRef.current = false;
          clearTimeout(gTimerRef.current);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(gTimerRef.current);
    };
  }, [navigate, onToggleHelp]);
}
