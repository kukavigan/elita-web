import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Search, X, Clock, ArrowRight } from 'lucide-react';
import { useSearch } from '@/contexts/SearchContext';
import { productsApi } from '@/services/api';
import type { ApiProduct } from '@/services/api';
import { ROUTES } from '@/lib/routes';
import { CURRENCY_SYMBOL } from '@/lib/constants';

const QUICK_CATS = [
  { label: 'Bluza',   slug: 'tshirts' },
  { label: 'Kapuçe',  slug: 'hoodies' },
  { label: 'Vinyl',   slug: 'vinyl' },
  { label: 'CD',      slug: 'cd' },
  { label: 'Aksesore',slug: 'accessories' },
];

export function SearchOverlay() {
  const { query, setQuery, isOpen, close, recentSearches, addRecent, clearRecent } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 80);
  }, [isOpen]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    if (isOpen) window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [isOpen, close]);

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => productsApi.getAll({ search: query, limit: 5 }),
    enabled: query.length >= 2,
  });

  const results: ApiProduct[] = data?.products ?? [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden
          />
          <motion.div
            className="fixed top-0 left-0 right-0 z-[90] bg-[var(--c-bg)] border-b border-[var(--c-border-hi)] shadow-2xl"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Kërko"
          >
            <div className="container-e5">
              {/* Input */}
              <div className="flex items-center gap-4 py-5 border-b border-[var(--c-border)]">
                <Search size={18} className="text-[var(--c-text-3)] flex-shrink-0" aria-hidden />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Kërko produkte Elita5…"
                  className="flex-1 bg-transparent text-[var(--c-text)] text-base placeholder:text-[var(--c-text-3)] outline-none"
                  aria-label="Kërko produkte"
                />
                {isLoading && (
                  <div className="w-4 h-4 border border-[var(--c-text-3)] border-t-[var(--c-text)] rounded-full animate-spin flex-shrink-0" aria-hidden />
                )}
                <div className="hidden md:flex items-center gap-1 border border-[var(--c-border)] px-2 py-0.5">
                  <kbd className="font-mono text-[9px] tracking-wide text-[var(--c-text-3)]">ESC</kbd>
                </div>
                <button onClick={close} className="flex-shrink-0 p-1.5 text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors" aria-label="Mbyll kërkimin">
                  <X size={18} />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto no-scrollbar py-4">
                {/* Search results */}
                {query.length >= 2 && !isLoading && results.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-[var(--c-text-3)] text-sm">
                      Asnjë produkt për "<span className="text-[var(--c-text)]">{query}</span>"
                    </p>
                  </div>
                )}

                {results.length > 0 && (
                  <div>
                    <p className="label-upper text-[var(--c-text-3)] mb-3">Produktet</p>
                    {results.map((p: ApiProduct) => (
                      <Link
                        key={p.id}
                        to={ROUTES.PRODUCT(p.slug)}
                        onClick={() => { addRecent(query); close(); }}
                        className="flex items-center gap-4 py-3 px-2 hover:bg-[rgba(240,237,232,0.04)] transition-colors group"
                      >
                        <div className="w-12 h-14 flex-shrink-0 overflow-hidden bg-[var(--c-bg-3)]">
                          {p.images[0] && <img src={p.images[0].imageUrl} alt="" aria-hidden className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[var(--c-text)] text-sm font-medium line-clamp-1">{p.name}</p>
                          <p className="text-[var(--c-text-3)] font-mono text-[10px] mt-0.5">{p.category?.name ?? ''}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="font-mono text-[12px] text-[var(--c-text)] tabular-nums">{CURRENCY_SYMBOL}{parseFloat(p.price).toFixed(2)}</span>
                          <ArrowRight size={13} className="text-[var(--c-text-3)] group-hover:text-[var(--c-text)] transition-colors" />
                        </div>
                      </Link>
                    ))}

                    {data && data.pagination.total > 5 && (
                      <Link
                        to={`${ROUTES.SHOP}?search=${encodeURIComponent(query)}`}
                        onClick={() => { addRecent(query); close(); }}
                        className="flex items-center justify-center gap-2 py-3 mt-2 border-t border-[var(--c-border)] font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors"
                      >
                        Shiko të gjitha {data.pagination.total} rezultatet <ArrowRight size={11} />
                      </Link>
                    )}
                  </div>
                )}

                {/* Recent searches */}
                {query.length < 2 && recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="label-upper text-[var(--c-text-3)]">Kërkimet e fundit</p>
                      <button onClick={clearRecent} className="font-mono text-[9px] tracking-[0.15em] uppercase text-[var(--c-text-3)] hover:text-[var(--c-red-hi)] transition-colors">Pastro</button>
                    </div>
                    {recentSearches.map(s => (
                      <button
                        key={s}
                        onClick={() => setQuery(s)}
                        className="flex items-center gap-3 w-full px-2 py-2.5 text-[var(--c-text-2)] hover:text-[var(--c-text)] hover:bg-[rgba(240,237,232,0.04)] transition-colors text-sm"
                      >
                        <Clock size={12} className="text-[var(--c-text-3)]" aria-hidden />
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {/* Quick categories */}
                {query.length < 2 && (
                  <div className="mt-6 border-t border-[var(--c-border)] pt-5">
                    <p className="label-upper text-[var(--c-text-3)] mb-3">Kategoritë</p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_CATS.map(cat => (
                        <Link
                          key={cat.slug}
                          to={`${ROUTES.SHOP}?category=${cat.slug}`}
                          onClick={close}
                          className="px-3 py-1.5 border border-[var(--c-border)] font-mono text-[9px] tracking-[0.15em] uppercase text-[var(--c-text-3)] hover:text-[var(--c-text)] hover:border-[var(--c-border-hi)] transition-all"
                        >
                          {cat.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
