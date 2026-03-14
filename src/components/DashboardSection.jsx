import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function DashboardSection({ title, defaultOpen = true, storageKey, children }) {
  const [isOpen, setIsOpen] = useState(() => {
    if (storageKey) {
      try {
        const saved = localStorage.getItem(`shiptracker-section-${storageKey}`);
        if (saved !== null) return saved === 'true';
      } catch {}
    }
    return defaultOpen;
  });

  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState(isOpen ? 'none' : '0px');

  useEffect(() => {
    if (isOpen) {
      // Measure and set, then switch to none for dynamic content
      const el = contentRef.current;
      if (el) {
        setMaxHeight(`${el.scrollHeight}px`);
        const timer = setTimeout(() => setMaxHeight('none'), 300);
        return () => clearTimeout(timer);
      }
    } else {
      // First set to current height, then collapse
      const el = contentRef.current;
      if (el) {
        setMaxHeight(`${el.scrollHeight}px`);
        // Force reflow
        el.offsetHeight;
        requestAnimationFrame(() => setMaxHeight('0px'));
      }
    }
  }, [isOpen]);

  function toggle() {
    const next = !isOpen;
    setIsOpen(next);
    if (storageKey) {
      try {
        localStorage.setItem(`shiptracker-section-${storageKey}`, String(next));
      } catch {}
    }
  }

  return (
    <div className="border-t border-slate-800/60 pt-2 mb-8">
      <button
        onClick={toggle}
        className="flex items-center justify-between w-full py-3 group cursor-pointer"
      >
        <h2 className="text-lg font-semibold text-white group-hover:text-slate-200 transition-colors">
          {title}
        </h2>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-500 group-hover:text-slate-300 transition-colors" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-500 group-hover:text-slate-300 transition-colors" />
        )}
      </button>
      <div
        ref={contentRef}
        style={{
          maxHeight,
          overflow: maxHeight === 'none' ? 'visible' : 'hidden',
          transition: maxHeight === 'none' ? 'none' : 'max-height 0.3s ease-in-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}
