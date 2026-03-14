import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm mb-6">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={item.path} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />}
            {isLast ? (
              <span className="text-[var(--text-primary)] font-medium">{item.label}</span>
            ) : (
              <Link
                to={item.path}
                className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
