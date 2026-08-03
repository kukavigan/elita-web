import React, { createContext, useContext, useState, useCallback } from 'react';

interface SearchContextValue {
  isOpen: boolean;
  query: string;
  open: () => void;
  close: () => void;
  setQuery: (q: string) => void;
  recentSearches: string[];
  addRecent: (q: string) => void;
  clearRecent: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

const MAX_RECENT = 6;

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('e5_recent_searches') ?? '[]'); }
    catch { return []; }
  });

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => { setIsOpen(false); setQuery(''); }, []);

  const addRecent = useCallback((q: string) => {
    if (!q.trim()) return;
    setRecentSearches(prev => {
      const next = [q, ...prev.filter(s => s !== q)].slice(0, MAX_RECENT);
      localStorage.setItem('e5_recent_searches', JSON.stringify(next));
      return next;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem('e5_recent_searches');
  }, []);

  return (
    <SearchContext.Provider value={{ isOpen, query, open, close, setQuery, recentSearches, addRecent, clearRecent }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within SearchProvider');
  return ctx;
}
