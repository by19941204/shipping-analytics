import { Download } from 'lucide-react';

export default function ExportButton({ onClick, label = 'CSV' }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
    >
      <Download size={12} />
      {label}
    </button>
  );
}
