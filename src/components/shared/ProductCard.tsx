import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { ApiProduct } from '@/services/api';
import { ROUTES } from '@/lib/routes';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface Props {
  product: ApiProduct;
  priority?: boolean;
}

function getBadge(p: ApiProduct): { label: string; class: string } | null {
  if (p.limitedEdition) return { label: 'Edicion i Kufizuar', class: 'bg-[var(--c-red)] text-white' };
  if (p.newArrival)     return { label: 'I Ri',               class: 'bg-[var(--c-text)] text-[var(--c-text-inv)]' };
  if (p.bestSeller)     return { label: 'Bestseller',         class: 'bg-[var(--c-surface)] text-[var(--c-text-2)]' };
  return null;
}

export function ProductCard({ product, priority = false }: Props) {
  const [hovered, setHovered] = useState(false);
  const [adding,  setAdding]  = useState(false);
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const inWl = isInWishlist(product.id);

  const img1 = product.images[0]?.imageUrl ?? '';
  const img2 = product.images[1]?.imageUrl ?? img1;
  const price = parseFloat(product.price);
  const origPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;
  const discount = origPrice ? Math.round((1 - price / origPrice) * 100) : null;
  const totalStock = product.variants.reduce((s, v) => s + (v.active ? v.stockQuantity : 0), 0);
  const inStock = totalStock > 0;
  const lowStock = inStock && totalStock <= 3;
  const badge = getBadge(product);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inStock || adding) return;
    const v = product.variants.find(v => v.active && v.stockQuantity > 0);
    setAdding(true);
    try {
      await addItem(product, 1, v?.id, v);
      toast.success(`${product.name} u shtua në shportë.`, { duration: 2200 });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Gabim gjatë shtimit.');
    }
    setTimeout(() => setAdding(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem(product);
    if (inWl) toast(`${product.name} u hoq nga lista e dëshirave.`, { duration: 2000 });
    else      toast.success(`${product.name} u shtua në listën e dëshirave.`, { duration: 2200 });
  };

  return (
    <article
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        to={ROUTES.PRODUCT(product.slug)}
        className="block focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--c-red-hi)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--c-bg)]"
      >
        {/* ── Image ── */}
        <div className="relative overflow-hidden bg-[var(--c-bg-3)] aspect-[3/4]">
          {/* Primary image */}
          <motion.img
            src={img1}
            alt={product.images[0]?.altText ?? product.name}
            loading={priority ? 'eager' : 'lazy'}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ scale: hovered ? 1.04 : 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Secondary image crossfade */}
          {img2 !== img1 && (
            <motion.img
              src={img2}
              alt=""
              aria-hidden
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            />
          )}

          {/* Dark scrim on hover */}
          <motion.div
            className="absolute inset-0 bg-black/15"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            aria-hidden
          />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {badge && (
              <span className={`product-badge ${badge.class}`}>
                {badge.label}
              </span>
            )}
            {discount !== null && discount > 0 && (
              <span className="product-badge bg-[var(--c-red)] text-white">
                -{discount}%
              </span>
            )}
            {lowStock && (
              <span className="product-badge bg-[var(--c-bg)] text-[var(--c-text-2)] border border-[var(--c-border-hi)]">
                Vetëm {totalStock} copë
              </span>
            )}
            {!inStock && (
              <span className="product-badge bg-[var(--c-bg)] text-[var(--c-text-3)]">
                I Shitur
              </span>
            )}
          </div>

          {/* Wishlist */}
          <motion.button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center border transition-colors ${
              inWl
                ? 'bg-[var(--c-red)] border-[var(--c-red)] text-white'
                : 'bg-[var(--c-bg)]/80 border-[var(--c-border)] text-[var(--c-text-2)] hover:text-white hover:bg-[var(--c-red)] hover:border-[var(--c-red)]'
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: hovered || inWl ? 1 : 0, scale: hovered || inWl ? 1 : 0.8 }}
            transition={{ duration: 0.2 }}
            aria-label={inWl ? 'Hiq nga lista e dëshirave' : 'Shto në listën e dëshirave'}
            aria-pressed={inWl}
          >
            <Heart size={12} fill={inWl ? 'currentColor' : 'none'} />
          </motion.button>

          {/* Quick Add bar */}
          <AnimatePresence>
            {hovered && inStock && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                onClick={handleAddToCart}
                className={`absolute bottom-0 left-0 right-0 py-3 flex items-center justify-center gap-2 font-mono text-[9px] tracking-[0.2em] uppercase transition-colors ${
                  adding
                    ? 'bg-green-600 text-white'
                    : 'bg-[var(--c-text)] text-[var(--c-text-inv)] hover:bg-[#e8e3dc]'
                }`}
                aria-label={`Shto ${product.name} në shportë`}
              >
                <ShoppingBag size={11} aria-hidden />
                {adding ? 'Shtuar!' : 'Shto në Shportë'}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* ── Info ── */}
        <div className="mt-3.5 space-y-1">
          <h3 className="text-[var(--c-text)] text-[13px] font-medium leading-snug line-clamp-2 group-hover:text-[var(--c-text-2)] transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-[var(--c-text)] font-semibold text-[13px] tabular-nums">
              {CURRENCY_SYMBOL}{price.toFixed(2)}
            </span>
            {origPrice && (
              <span className="text-[var(--c-text-3)] text-[12px] line-through tabular-nums">
                {CURRENCY_SYMBOL}{origPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Color swatches */}
          {product.variants.some(v => v.colorHex) && (
            <div className="flex gap-1.5 pt-0.5">
              {[...new Map(product.variants.filter(v => v.colorHex).map(v => [v.colorHex, v])).values()]
                .slice(0, 5)
                .map(v => (
                  <span
                    key={v.colorHex}
                    className="w-2.5 h-2.5 rounded-full border border-[var(--c-border-hi)]"
                    style={{ background: v.colorHex! }}
                    title={v.color ?? ''}
                    aria-hidden
                  />
                ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
