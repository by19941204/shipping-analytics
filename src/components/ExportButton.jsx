import { Download } from 'lucide-react';

export default function ExportButton({ onClick, label = 'CSV' }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--bg-card-hover)] hover:bg-[var(--bg-card-hover)] text-xs text-[var(--text-primary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
    >
      <Download size={12} />
      {label}
    </button>
  );
}
