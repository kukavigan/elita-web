import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { ROUTES } from '@/lib/routes';
import { CURRENCY_SYMBOL } from '@/lib/constants';

export function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  useEffect(() => { document.title = 'Lista e Dëshirave — Elita5 Store'; }, []);

  const handleMoveToCart = async (product: typeof items[0]) => {
    const v = product.variants.find(v => v.active && v.stockQuantity > 0);
    await addItem(product, 1, v?.id, v);
    removeItem(product.id);
    toast.success(`${product.name} u shtua në shportë.`);
  };

  return (
    <main className="pt-[68px] min-h-screen">
      <div className="bg-[var(--c-bg-2)] border-b border-[var(--c-border)] py-14">
        <div className="container-e5">
          <span className="section-label mb-2">E Shpëtuar</span>
          <h1 className="font-display text-[clamp(3rem,8vw,6rem)] leading-none text-[var(--c-text)] tracking-tight">
            LISTA E<br /><span className="text-[var(--c-text-3)]">DËSHIRAVE</span>
          </h1>
          {items.length > 0 && (
            <p className="font-mono text-[11px] tracking-[0.2em] text-[var(--c-text-3)] mt-2 uppercase">
              {items.length} {items.length === 1 ? 'produkt' : 'produkte'}
            </p>
          )}
        </div>
      </div>

      <div className="container-e5 py-12">
        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
            <div className="w-20 h-20 border border-[var(--c-border)] flex items-center justify-center mx-auto mb-6">
              <Heart size={28} className="text-[var(--c-text-3)]" />
            </div>
            <p className="font-display text-4xl text-[var(--c-text)] tracking-tight mb-3">LISTA BOSH</p>
            <p className="text-[var(--c-text-3)] text-sm mb-8 max-w-xs mx-auto">Shfleto koleksionin dhe shto produktet e preferuara.</p>
            <Link to={ROUTES.SHOP} className="btn-primary text-[11px] inline-flex">Zbulo Produktet <ArrowRight size={13} /></Link>
          </motion.div>
        ) : (
          <div className="space-y-px">
            <AnimatePresence initial={false}>
              {items.map(product => {
                const inStock = product.variants.reduce((s, v) => s + (v.active ? v.stockQuantity : 0), 0) > 0;
                const img = product.images[0]?.imageUrl;
                const price = parseFloat(product.price);
                const orig  = product.originalPrice ? parseFloat(product.originalPrice) : null;

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    className="flex items-center gap-5 p-5 border border-[var(--c-border)] hover:border-[var(--c-border-hi)] transition-colors group"
                  >
                    {img && (
                      <Link to={ROUTES.PRODUCT(product.slug)} className="flex-shrink-0 w-16 h-20 bg-[var(--c-bg-3)] overflow-hidden">
                        <img src={img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </Link>
                    )}
                    <div className="flex-1 min-w-0">
                      <Link to={ROUTES.PRODUCT(product.slug)}>
                        <h3 className="text-[var(--c-text)] font-medium text-sm hover:text-[var(--c-text-2)] transition-colors line-clamp-1">{product.name}</h3>
                      </Link>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[var(--c-text)] font-semibold text-sm tabular-nums">{CURRENCY_SYMBOL}{price.toFixed(2)}</span>
                        {orig && <span className="text-[var(--c-text-3)] text-xs line-through tabular-nums">{CURRENCY_SYMBOL}{orig.toFixed(2)}</span>}
                        {product.limitedEdition && <span className="px-2 py-0.5 bg-[var(--c-red-dim)] font-mono text-[8px] tracking-[0.2em] uppercase text-[var(--c-red-hi)]">I Limituar</span>}
                      </div>
                      {!inStock && <p className="font-mono text-[10px] text-[var(--c-text-3)] mt-1 uppercase tracking-wider">I Shitur</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleMoveToCart(product)}
                        disabled={!inStock}
                        className="btn-primary text-[10px] py-2.5 px-4 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ShoppingBag size={11} />
                        <span className="hidden sm:inline">Shto</span>
                      </button>
                      <button
                        onClick={() => { removeItem(product.id); toast(`${product.name} u hoq nga lista.`); }}
                        className="w-9 h-9 flex items-center justify-center border border-[var(--c-border)] text-[var(--c-text-3)] hover:text-[var(--c-red-hi)] hover:border-[var(--c-red)]/30 transition-all"
                        aria-label="Hiq nga lista"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div className="mt-8 flex justify-end">
              <Link to={ROUTES.SHOP} className="btn-outline text-[11px]">Vazhdo Blerjen <ArrowRight size={13} /></Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
