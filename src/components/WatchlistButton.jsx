import { Star } from 'lucide-react';
import { useWatchlist } from '../contexts/WatchlistContext';

export default function WatchlistButton({ companyId, size = 'md' }) {
  const { isWatched, toggleWatchlist } = useWatchlist();
  const watched = isWatched(companyId);

  const sizeClasses = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const padding = size === 'sm' ? 'p-1' : 'p-1.5';

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWatchlist(companyId);
      }}
      className={`${padding} rounded-lg transition-all duration-200 cursor-pointer hover:bg-white/10`}
      title={watched ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <Star
        className={`${sizeClasses} transition-all duration-200 ${
          watched
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
        }`}
      />
    </button>
  );
}
