import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WatchlistContext = createContext();

const STORAGE_KEY = 'shiptracker-watchlist';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return new Map(parsed);
    }
  } catch {
    // ignore corrupted data
  }
  return new Map();
}

function saveToStorage(map) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...map]));
}

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() => loadFromStorage());

  useEffect(() => {
    saveToStorage(watchlist);
  }, [watchlist]);

  const toggleWatchlist = useCallback((id) => {
    setWatchlist((prev) => {
      const next = new Map(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.set(id, { shares: 0, costBasis: 0 });
      }
      return next;
    });
  }, []);

  const updatePosition = useCallback((id, shares, costBasis) => {
    setWatchlist((prev) => {
      const next = new Map(prev);
      if (next.has(id)) {
        next.set(id, { shares, costBasis });
      }
      return next;
    });
  }, []);

  const isWatched = useCallback((id) => watchlist.has(id), [watchlist]);

  const getPosition = useCallback((id) => watchlist.get(id) || { shares: 0, costBasis: 0 }, [watchlist]);

  return (
    <WatchlistContext.Provider value={{ watchlist, toggleWatchlist, updatePosition, isWatched, getPosition }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export const useWatchlist = () => useContext(WatchlistContext);
