import { useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronLeft, ChevronRight, LayoutGrid, Rows3, ArrowRight } from 'lucide-react';
import { productsApi } from '@/services/api';
import { ROUTES } from '@/lib/routes';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import { ProductCard } from '@/components/shared/ProductCard';
import { ProductCardSkeleton } from '@/components/shared/ProductCardSkeleton';

const CATEGORIES = [
  { value: '', label: 'Të Gjitha' },
  { value: 'tshirts',     label: 'Bluza' },
  { value: 'hoodies',     label: 'Kapuçe' },
  { value: 'vinyl',       label: 'Vinyl' },
  { value: 'cd',          label: 'CD' },
  { value: 'caps',        label: 'Kapela' },
  { value: 'accessories', label: 'Aksesore' },
  { value: 'posters',     label: 'Postera' },
  { value: 'signed',      label: 'Të Nënshkruara' },
  { value: 'limited',     label: 'Edicion i Kufizuar' },
  { value: 'bundles',     label: 'Pako' },
];

const BADGES = [
  { value: '', label: 'Të Gjitha' },
  { value: 'new',        label: 'Të Reja' },
  { value: 'bestseller', label: 'Bestseller' },
  { value: 'limited',    label: 'I Kufizuar' },
  { value: 'featured',   label: 'Zgjedhja Jonë' },
];

const SORTS = [
  { value: 'newest',     label: 'Më të Rejat' },
  { value: 'popular',    label: 'Më të Shitura' },
  { value: 'price_asc',  label: 'Çmimi: Ulët — Lartë' },
  { value: 'price_desc', label: 'Çmimi: Lartë — Ulët' },
  { value: 'name_asc',   label: 'Emri: A — Z' },
];

export function ShopPage() {
  const [sp, setSp] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const category = sp.get('category') ?? '';
  const badge    = sp.get('badge') ?? '';
  const sort     = sp.get('sort') ?? 'newest';
  const search   = sp.get('search') ?? '';
  const page     = Math.max(1, parseInt(sp.get('page') ?? '1', 10));
  const minPrice = sp.get('minPrice') ?? '';
  const maxPrice = sp.get('maxPrice') ?? '';

  const setParam = useCallback((key: string, value: string) => {
    setSp(prev => {
      const n = new URLSearchParams(prev);
      if (value) n.set(key, value); else n.delete(key);
      n.delete('page');
      return n;
    });
  }, [setSp]);

  const setPage = useCallback((p: number) => {
    setSp(prev => { const n = new URLSearchParams(prev); n.set('page', String(p)); return n; });
  }, [setSp]);

  const clearFilters = () => setSp({});
  const hasFilters = !!(category || badge || search || minPrice || maxPrice);

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['products', { category, badge, sort, search, page, minPrice, maxPrice }],
    queryFn: () => productsApi.getAll({ ...(category && { category }), ...(badge && { badge }), sort, ...(search && { search }), ...(minPrice && { minPrice }), ...(maxPrice && { maxPrice }), page, limit: 24 }),
    placeholderData: prev => prev,
  });

  const products   = data?.products ?? [];
  const total      = data?.pagination.total ?? 0;
  const totalPages = data?.pagination.totalPages ?? 1;

  const activeFilters = [
    ...(category ? [{ key: 'category', label: CATEGORIES.find(c => c.value === category)?.label ?? category }] : []),
    ...(badge    ? [{ key: 'badge',    label: BADGES.find(b => b.value === badge)?.label ?? badge }] : []),
    ...(search   ? [{ key: 'search',   label: `"${search}"` }] : []),
    ...(minPrice ? [{ key: 'minPrice', label: `Min ${CURRENCY_SYMBOL}${minPrice}` }] : []),
    ...(maxPrice ? [{ key: 'maxPrice', label: `Max ${CURRENCY_SYMBOL}${maxPrice}` }] : []),
  ];

  const headingLabel = category
    ? CATEGORIES.find(c => c.value === category)?.label ?? 'DYQANI'
    : search ? `"${search}"` : 'DYQANI';

  return (
    <main className="pt-[68px] min-h-screen">
      {/* ── Shop header ── */}
      <div className="bg-[var(--c-bg-2)] border-b border-[var(--c-border)]">
        <div className="container-e5 py-12 md:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="section-label mb-2">Koleksioni Zyrtar</span>
              <h1 className="font-display text-[clamp(3rem,9vw,7rem)] leading-none text-[var(--c-text)] tracking-tight">
                {headingLabel.toUpperCase()}
              </h1>
              {!isLoading && (
                <p className="font-mono text-[11px] tracking-[0.2em] text-[var(--c-text-3)] mt-2 uppercase">
                  {total} produkte
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setFilterOpen(v => !v)}
                className="flex items-center gap-2 btn-outline text-[10px] py-2.5 px-4 relative"
              >
                <SlidersHorizontal size={13} />
                Filtrat
                {hasFilters && <span className="w-4 h-4 bg-[var(--c-red)] text-white font-bold text-[8px] flex items-center justify-center absolute -top-1.5 -right-1.5">{activeFilters.length}</span>}
              </button>

              <select
                value={sort}
                onChange={e => setParam('sort', e.target.value)}
                className="input-e5 py-2.5 text-[11px] pr-8 min-w-[160px] cursor-pointer"
                aria-label="Rendit produktet"
              >
                {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>

              <div className="flex border border-[var(--c-border)]">
                {[{ mode: 'grid' as const, Icon: LayoutGrid }, { mode: 'list' as const, Icon: Rows3 }].map(({ mode, Icon }) => (
                  <button
                    key={mode}
                    onClick={() => setView(mode)}
                    className={`w-9 h-9 flex items-center justify-center transition-colors ${view === mode ? 'bg-[var(--c-text)] text-[var(--c-text-inv)]' : 'text-[var(--c-text-3)] hover:text-[var(--c-text)]'}`}
                    aria-label={mode === 'grid' ? 'Grid' : 'List'}
                    aria-pressed={view === mode}
                  >
                    <Icon size={14} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-5">
              {activeFilters.map(f => (
                <button
                  key={f.key}
                  onClick={() => setParam(f.key, '')}
                  className="flex items-center gap-1.5 px-3 py-1 border border-[var(--c-border-hi)] bg-[var(--c-surface)] font-mono text-[9px] tracking-[0.15em] uppercase text-[var(--c-text-2)] hover:border-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors"
                  aria-label={`Hiq filtrin: ${f.label}`}
                >
                  {f.label} <X size={9} />
                </button>
              ))}
              <button onClick={clearFilters} className="font-mono text-[9px] tracking-[0.15em] uppercase text-[var(--c-text-3)] hover:text-[var(--c-red-hi)] transition-colors px-2">
                Pastro të gjitha
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="container-e5 py-8">
        <div className="grid lg:grid-cols-[220px_1fr] gap-8">

          {/* ── Sidebar ── */}
          <AnimatePresence>
            {(filterOpen || true) && (
              <motion.aside
                className={`${filterOpen ? 'block' : 'hidden lg:block'} space-y-7`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {filterOpen && (
                  <div className="flex items-center justify-between lg:hidden mb-1">
                    <span className="label-upper text-[var(--c-text-2)]">Filtrat</span>
                    <button onClick={() => setFilterOpen(false)} className="text-[var(--c-text-3)] hover:text-[var(--c-text)]"><X size={16} /></button>
                  </div>
                )}

                {/* Category */}
                <div>
                  <p className="label-upper text-[var(--c-text-3)] mb-3">Kategoria</p>
                  <div className="space-y-0.5">
                    {CATEGORIES.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setParam('category', opt.value)}
                        className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                          category === opt.value
                            ? 'text-[var(--c-text)] border-l-2 border-[var(--c-red)] bg-[var(--c-red-dim)] pl-[10px]'
                            : 'text-[var(--c-text-3)] hover:text-[var(--c-text)] border-l-2 border-transparent hover:border-[var(--c-border-hi)]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Badge */}
                <div>
                  <p className="label-upper text-[var(--c-text-3)] mb-3">Lloji</p>
                  <div className="space-y-0.5">
                    {BADGES.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setParam('badge', opt.value)}
                        className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                          badge === opt.value
                            ? 'text-[var(--c-text)] border-l-2 border-[var(--c-red)] bg-[var(--c-red-dim)] pl-[10px]'
                            : 'text-[var(--c-text-3)] hover:text-[var(--c-text)] border-l-2 border-transparent hover:border-[var(--c-border-hi)]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <p className="label-upper text-[var(--c-text-3)] mb-3">Çmimi ({CURRENCY_SYMBOL})</p>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Min" value={minPrice} onChange={e => setParam('minPrice', e.target.value)} className="input-e5 text-sm py-2" min={0} aria-label="Çmimi minimal" />
                    <input type="number" placeholder="Max" value={maxPrice} onChange={e => setParam('maxPrice', e.target.value)} className="input-e5 text-sm py-2" min={0} aria-label="Çmimi maksimal" />
                  </div>
                </div>

                {hasFilters && (
                  <button onClick={clearFilters} className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--c-text-3)] hover:text-[var(--c-red-hi)] transition-colors">
                    <X size={10} /> Pastro Filtrat
                  </button>
                )}
              </motion.aside>
            )}
          </AnimatePresence>

          {/* ── Product area ── */}
          <div>
            {search && (
              <div className="flex items-center gap-2 mb-6 font-mono text-[11px] tracking-wider">
                <span className="text-[var(--c-text-3)]">Rezultate për:</span>
                <span className="text-[var(--c-text)]">"{search}"</span>
                <button onClick={() => setParam('search', '')} className="text-[var(--c-text-3)] hover:text-[var(--c-red-hi)] transition-colors ml-1"><X size={12} /></button>
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10">
                {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="font-display text-4xl text-[var(--c-text)] tracking-tight mb-3">ASNJË PRODUKT</p>
                <p className="text-[var(--c-text-3)] text-sm mb-8">Provoni të ndryshoni filtrat tuaj ose shikoni koleksionin e plotë.</p>
                <button onClick={clearFilters} className="btn-outline text-[11px]">Pastro Filtrat</button>
              </div>
            ) : view === 'grid' ? (
              <div className={`grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 transition-opacity ${isPlaceholderData ? 'opacity-50' : ''}`}>
                {products.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.05, 0.35) }}
                  >
                    <ProductCard product={p} priority={i < 2} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {products.map(p => {
                  const img = p.images[0]?.imageUrl;
                  const price = parseFloat(p.price);
                  const orig  = p.originalPrice ? parseFloat(p.originalPrice) : null;
                  return (
                    <Link
                      key={p.id}
                      to={ROUTES.PRODUCT(p.slug)}
                      className="flex gap-5 p-4 border border-[var(--c-border)] hover:border-[var(--c-border-hi)] hover:bg-[rgba(240,237,232,0.025)] transition-all group"
                    >
                      {img && (
                        <div className="w-20 h-24 flex-shrink-0 overflow-hidden bg-[var(--c-bg-3)]">
                          <img src={img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <p className="text-[var(--c-text)] font-medium text-sm line-clamp-1 group-hover:text-[var(--c-text-2)] transition-colors">{p.name}</p>
                        {p.shortDescription && <p className="text-[var(--c-text-3)] text-xs mt-1 line-clamp-1">{p.shortDescription}</p>}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[var(--c-text)] font-semibold text-sm">{CURRENCY_SYMBOL}{price.toFixed(2)}</span>
                          {orig && <span className="text-[var(--c-text-3)] text-xs line-through">{CURRENCY_SYMBOL}{orig.toFixed(2)}</span>}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <ArrowRight size={15} className="text-[var(--c-text-3)] group-hover:text-[var(--c-text)] transition-colors" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-14">
                <button onClick={() => setPage(page - 1)} disabled={page === 1} className="w-9 h-9 flex items-center justify-center border border-[var(--c-border)] text-[var(--c-text-3)] hover:text-[var(--c-text)] hover:border-[var(--c-border-hi)] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                  .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                    if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) => (
                    typeof p === 'number'
                      ? <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 font-mono text-[11px] border transition-all ${p === page ? 'border-[var(--c-text)] bg-[var(--c-text)] text-[var(--c-text-inv)]' : 'border-[var(--c-border)] text-[var(--c-text-3)] hover:text-[var(--c-text)] hover:border-[var(--c-border-hi)]'}`}>{p}</button>
                      : <span key={`d${i}`} className="text-[var(--c-text-3)] px-1 font-mono text-xs">…</span>
                  ))}
                <button onClick={() => setPage(page + 1)} disabled={page >= totalPages} className="w-9 h-9 flex items-center justify-center border border-[var(--c-border)] text-[var(--c-text-3)] hover:text-[var(--c-text)] hover:border-[var(--c-border-hi)] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
