import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag, X, Heart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { CURRENCY_SYMBOL, FREE_SHIPPING_THRESHOLD } from '@/lib/constants';
import { ROUTES } from '@/lib/routes';

export function CartPage() {
  const { items, subtotal, removeItem, updateQty, couponCode, couponDiscount, applyCoupon, removeCoupon, isLoading } = useCart();
  const { addItem: addToWishlist } = useWishlist();
  const [couponInput,   setCouponInput]   = useState('');
  const [couponError,   setCouponError]   = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => { document.title = 'Shporta — Elita5 Store'; }, []);

  const discountAmount = couponDiscount ? (subtotal * couponDiscount) / 100 : 0;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 3;
  const tax   = (subtotal - discountAmount) * 0.18;
  const total = subtotal - discountAmount + shipping + tax;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponError('');
    setCouponLoading(true);
    try {
      await applyCoupon(couponInput.trim());
      setCouponInput('');
    } catch (err: unknown) {
      setCouponError(err instanceof Error ? err.message : 'Kodi nuk është i vlefshëm.');
    } finally {
      setCouponLoading(false);
    }
  };

  if (isLoading) {
    return (
      <main className="pt-[68px] min-h-screen flex items-center justify-center">
        <Loader2 size={22} className="animate-spin text-[var(--c-text-3)]" />
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="pt-[68px] min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <div className="w-20 h-20 border border-[var(--c-border)] flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={28} className="text-[var(--c-text-3)]" />
          </div>
          <p className="font-display text-4xl text-[var(--c-text)] tracking-tight mb-3">SHPORTA BOSH</p>
          <p className="text-[var(--c-text-3)] text-sm mb-8 max-w-xs mx-auto">Shfleto koleksionin tonë dhe zgjedh produktet e tua.</p>
          <Link to={ROUTES.SHOP} className="btn-primary text-[11px] inline-flex">Shfleto Dyqanin <ArrowRight size={13} /></Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-[68px] min-h-screen">
      <div className="bg-[var(--c-bg-2)] border-b border-[var(--c-border)] py-12">
        <div className="container-e5">
          <span className="section-label mb-2">Porosia Juaj</span>
          <h1 className="font-display text-[clamp(3rem,9vw,7rem)] leading-none text-[var(--c-text)] tracking-tight">SHPORTA</h1>
          <p className="font-mono text-[11px] tracking-[0.2em] text-[var(--c-text-3)] mt-2 uppercase">{items.reduce((s, i) => s + i.quantity, 0)} artikuj</p>
        </div>
      </div>

      <div className="container-e5 py-10">
        <div className="grid lg:grid-cols-[1fr_340px] gap-10">
          {/* Items */}
          <div className="space-y-px">
            <AnimatePresence initial={false}>
              {items.map(item => {
                const img  = item.product?.images?.[0]?.imageUrl;
                const name = item.product?.name ?? 'Produkt';
                const slug = item.product?.slug ?? '';

                return (
                  <motion.div
                    key={`${item.productId}_${item.variantId ?? ''}`}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    className="flex gap-5 p-5 border border-[var(--c-border)] hover:border-[var(--c-border-hi)] transition-colors"
                  >
                    {img && (
                      <Link to={ROUTES.PRODUCT(slug)} className="flex-shrink-0 w-20 h-24 bg-[var(--c-bg-3)] overflow-hidden">
                        <img src={img} alt={name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      </Link>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <Link to={ROUTES.PRODUCT(slug)}>
                          <h3 className="text-[var(--c-text)] font-medium text-sm hover:text-[var(--c-text-2)] transition-colors line-clamp-2">{name}</h3>
                        </Link>
                        <span className="text-[var(--c-text)] font-semibold text-sm tabular-nums flex-shrink-0">
                          {CURRENCY_SYMBOL}{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-1.5">
                        {item.variant?.size  && <span className="font-mono text-[10px] text-[var(--c-text-3)]">Madhësia: {item.variant.size}</span>}
                        {item.variant?.color && <span className="font-mono text-[10px] text-[var(--c-text-3)]">· {item.variant.color}</span>}
                        <span className="font-mono text-[10px] text-[var(--c-text-3)]">{CURRENCY_SYMBOL}{item.price.toFixed(2)}/copë</span>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-[var(--c-border)]">
                          <button
                            onClick={() => item.quantity > 1 ? updateQty(item.productId, item.quantity - 1) : removeItem(item.productId)}
                            className="w-8 h-8 flex items-center justify-center text-[var(--c-text-3)] hover:text-[var(--c-text)] hover:bg-[rgba(240,237,232,0.05)] transition-colors"
                            aria-label="Zvogëlo sasinë"
                          >
                            {item.quantity === 1 ? <Trash2 size={11} /> : <Minus size={11} />}
                          </button>
                          <span className="w-9 text-center font-mono text-[12px] text-[var(--c-text)] tabular-nums">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.productId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-[var(--c-text-3)] hover:text-[var(--c-text)] hover:bg-[rgba(240,237,232,0.05)] transition-colors"
                            aria-label="Rrit sasinë"
                          >
                            <Plus size={11} />
                          </button>
                        </div>

                        <div className="flex gap-4">
                          <button
                            onClick={() => { if (item.product) { addToWishlist(item.product); removeItem(item.productId); toast(`${name} u zhvendos në listën e dëshirave.`); } }}
                            className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors"
                          >
                            <Heart size={11} /> <span className="hidden sm:inline">Ruaj</span>
                          </button>
                          <button
                            onClick={() => { removeItem(item.productId); toast(`${name} u hoq nga shporta.`); }}
                            className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--c-text-3)] hover:text-[var(--c-red-hi)] transition-colors"
                          >
                            <Trash2 size={11} /> <span className="hidden sm:inline">Hiq</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 space-y-5">
            {/* Coupon */}
            {!couponCode ? (
              <div>
                <p className="label-upper text-[var(--c-text-3)] mb-2">Kodi i Zbritjes</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                    className="input-e5 flex-1 font-mono text-xs tracking-[0.15em] uppercase"
                    placeholder="KOD ZBRITJE"
                    onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                    aria-label="Kodi i zbritjes"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="w-11 flex-shrink-0 border border-[var(--c-border)] bg-[var(--c-surface)] text-[var(--c-text-3)] hover:text-[var(--c-text)] hover:border-[var(--c-border-hi)] transition-all flex items-center justify-center"
                    aria-label="Apliko kodin"
                  >
                    {couponLoading ? <Loader2 size={13} className="animate-spin" /> : <Tag size={13} />}
                  </button>
                </div>
                {couponError && <p className="mt-1.5 font-mono text-[10px] text-[var(--c-red-hi)]">{couponError}</p>}
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 border border-green-500/20 bg-green-500/5">
                <div className="flex items-center gap-2">
                  <Tag size={12} className="text-green-400" />
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-green-400">{couponCode}</span>
                  <span className="font-mono text-[10px] text-green-400/60">(-{couponDiscount}%)</span>
                </div>
                <button onClick={removeCoupon} className="text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors" aria-label="Hiq kodin"><X size={12} /></button>
              </div>
            )}

            {/* Totals */}
            <div className="border border-[var(--c-border)] p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--c-text-2)]">Nëntotali</span>
                <span className="text-[var(--c-text)] tabular-nums">{CURRENCY_SYMBOL}{subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-400">
                  <span>Zbritja</span>
                  <span className="tabular-nums">-{CURRENCY_SYMBOL}{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-[var(--c-text-2)]">Transport</span>
                <span className={shipping === 0 ? 'text-green-400' : 'text-[var(--c-text)] tabular-nums'}>
                  {shipping === 0 ? 'Falas' : `${CURRENCY_SYMBOL}${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--c-text-2)]">TVSH (18%)</span>
                <span className="text-[var(--c-text)] tabular-nums">{CURRENCY_SYMBOL}{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[var(--c-border)]">
                <span className="font-display text-xl text-[var(--c-text)] tracking-tight">TOTALI</span>
                <span className="font-display text-xl text-[var(--c-text)] tabular-nums">{CURRENCY_SYMBOL}{total.toFixed(2)}</span>
              </div>
            </div>

            <Link to={ROUTES.CHECKOUT} className="btn-accent w-full justify-center text-[11px]">
              Vazhdo Checkout <ArrowRight size={13} />
            </Link>
            <Link to={ROUTES.SHOP} className="btn-ghost w-full justify-center font-mono text-[10px] tracking-[0.15em] uppercase">
              ← Vazhdo Blerjen
            </Link>

            {/* Shipping note */}
            {subtotal < FREE_SHIPPING_THRESHOLD && (
              <p className="font-mono text-[10px] tracking-[0.12em] text-[var(--c-text-3)] text-center">
                Shto {CURRENCY_SYMBOL}{(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} më shumë për transport falas.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
