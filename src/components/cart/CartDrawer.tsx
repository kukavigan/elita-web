import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { CURRENCY_SYMBOL, FREE_SHIPPING_THRESHOLD } from '@/lib/constants';
import { ROUTES } from '@/lib/routes';

export function CartDrawer() {
  const { items, count, subtotal, isOpen, closeCart, updateQty, removeItem } = useCart();
  const shipping  = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 3;
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const progress  = Math.min(subtotal / FREE_SHIPPING_THRESHOLD, 1);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            className="fixed inset-y-0 right-0 z-[70] w-full max-w-[400px] bg-[var(--c-bg-2)] border-l border-[var(--c-border)] flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 280 }}
            role="dialog"
            aria-label="Shporta"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--c-border)]">
              <div className="flex items-center gap-3">
                <ShoppingBag size={16} className="text-[var(--c-text-2)]" />
                <span className="font-display text-xl leading-none tracking-tight text-[var(--c-text)]">SHPORTA</span>
                {count > 0 && (
                  <span className="w-5 h-5 bg-[var(--c-red)] text-white font-mono text-[9px] font-bold flex items-center justify-center">
                    {count}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors"
                aria-label="Mbyll shportën"
              >
                <X size={18} />
              </button>
            </div>

            {/* Shipping progress */}
            {subtotal > 0 && (
              <div className="px-6 py-3 border-b border-[var(--c-border)]">
                {subtotal < FREE_SHIPPING_THRESHOLD ? (
                  <p className="font-mono text-[10px] tracking-[0.15em] text-[var(--c-text-3)] mb-2 uppercase">
                    Edhe <span className="text-[var(--c-text)]">{CURRENCY_SYMBOL}{remaining.toFixed(2)}</span> për transport falas
                  </p>
                ) : (
                  <p className="font-mono text-[10px] tracking-[0.15em] text-green-400 mb-2 uppercase">Transport falas i fituar!</p>
                )}
                <div className="h-0.5 bg-[var(--c-border)] overflow-hidden">
                  <motion.div
                    className={`h-full ${subtotal >= FREE_SHIPPING_THRESHOLD ? 'bg-green-400' : 'bg-[var(--c-red)]'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-5 px-6 space-y-5 no-scrollbar">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="w-16 h-16 border border-[var(--c-border)] flex items-center justify-center mb-5">
                    <ShoppingBag size={22} className="text-[var(--c-text-3)]" />
                  </div>
                  <p className="font-display text-2xl text-[var(--c-text)] tracking-tight mb-2">SHPORTA BOSH</p>
                  <p className="text-[var(--c-text-3)] text-sm mb-6">Shfleto produktet dhe zgjedh diçka.</p>
                  <button onClick={closeCart} className="btn-outline text-[11px]">Vazhdo Blerjen</button>
                </div>
              ) : (
                items.map(item => {
                  const img  = item.product?.images?.[0]?.imageUrl;
                  const name = item.product?.name ?? 'Produkt';
                  const slug = item.product?.slug ?? '';
                  return (
                    <motion.div
                      key={`${item.productId}_${item.variantId ?? ''}`}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      className="flex gap-4"
                    >
                      {img && (
                        <Link to={ROUTES.PRODUCT(slug)} onClick={closeCart} className="flex-shrink-0 w-16 h-20 overflow-hidden bg-[var(--c-bg-3)]">
                          <img src={img} alt={name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </Link>
                      )}
                      <div className="flex-1 min-w-0">
                        <Link to={ROUTES.PRODUCT(slug)} onClick={closeCart} className="text-[var(--c-text)] text-sm font-medium hover:text-[var(--c-text-2)] transition-colors line-clamp-2">
                          {name}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          {item.variant?.size && <span className="font-mono text-[10px] text-[var(--c-text-3)] uppercase">{item.variant.size}</span>}
                          {item.variant?.color && <span className="font-mono text-[10px] text-[var(--c-text-3)]">· {item.variant.color}</span>}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-[var(--c-border)]">
                            <button
                              onClick={() => item.quantity > 1 ? updateQty(item.productId, item.quantity - 1) : removeItem(item.productId)}
                              className="w-7 h-7 flex items-center justify-center text-[var(--c-text-3)] hover:text-[var(--c-text)] hover:bg-[rgba(240,237,232,0.05)] transition-colors"
                              aria-label="Zvogëlo"
                            >
                              {item.quantity === 1 ? <Trash2 size={10} /> : <Minus size={10} />}
                            </button>
                            <span className="w-7 text-center font-mono text-[11px] text-[var(--c-text)] tabular-nums">{item.quantity}</span>
                            <button
                              onClick={() => updateQty(item.productId, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-[var(--c-text-3)] hover:text-[var(--c-text)] hover:bg-[rgba(240,237,232,0.05)] transition-colors"
                              aria-label="Rrit"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                          <span className="text-[var(--c-text)] font-semibold text-sm tabular-nums">
                            {CURRENCY_SYMBOL}{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[var(--c-border)] px-6 py-5 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-[var(--c-text-2)] text-sm">Nëntotali</span>
                  <span className="font-display text-2xl text-[var(--c-text)] leading-none tabular-nums">
                    {CURRENCY_SYMBOL}{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--c-text-3)]">Transport</span>
                  <span className={`font-mono text-[11px] ${shipping === 0 ? 'text-green-400' : 'text-[var(--c-text-2)]'}`}>
                    {shipping === 0 ? 'Falas' : `${CURRENCY_SYMBOL}${shipping.toFixed(2)}`}
                  </span>
                </div>
                <Link to={ROUTES.CHECKOUT} onClick={closeCart} className="btn-accent w-full justify-center text-[11px]">
                  Vazhdo Checkout <ArrowRight size={13} />
                </Link>
                <Link to={ROUTES.CART} onClick={closeCart} className="btn-ghost w-full justify-center font-mono text-[10px] tracking-[0.15em] uppercase">
                  Shiko Shportën e Plotë
                </Link>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
