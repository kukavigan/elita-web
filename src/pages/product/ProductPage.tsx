import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, ChevronRight, Star, RotateCcw, Truck, Shield, Plus, Minus, ArrowRight, ZoomIn } from 'lucide-react';
import { toast } from 'sonner';
import { productsApi } from '@/services/api';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { ROUTES } from '@/lib/routes';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import { ProductCard } from '@/components/shared/ProductCard';
import { ProductCardSkeleton } from '@/components/shared/ProductCardSkeleton';

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const [selectedImage,    setSelectedImage]    = useState(0);
  const [selectedVariantId,setSelectedVariantId] = useState<string | undefined>();
  const [qty,              setQty]              = useState(1);
  const [adding,           setAdding]           = useState(false);
  const [sizeError,        setSizeError]        = useState(false);
  const [openSection,      setOpenSection]      = useState<string>('description');

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsApi.getBySlug(slug!),
    enabled: !!slug,
  });

  const { data: related } = useQuery({
    queryKey: ['related', product?.id, product?.categoryId],
    queryFn: () => productsApi.getRelated(product!.id, product!.categoryId ?? ''),
    enabled: !!product?.id,
  });

  useEffect(() => {
    if (product) document.title = `${product.name} — Elita5 Store`;
  }, [product]);

  useEffect(() => {
    if (product?.variants.length === 1) setSelectedVariantId(product.variants[0].id);
  }, [product]);

  if (isLoading) return (
    <main className="pt-[68px] min-h-screen pb-24 md:pb-0">
      <div className="container-e5 py-10">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-[3/4] skeleton" />
          <div className="space-y-5 pt-4">
            <div className="h-6 skeleton w-1/3" />
            <div className="h-10 skeleton w-4/5" />
            <div className="h-8 skeleton w-1/4" />
          </div>
        </div>
      </div>
    </main>
  );

  if (!product) return (
    <main className="pt-[68px] min-h-screen flex items-center justify-center text-center">
      <div>
        <p className="font-display text-4xl text-[var(--c-text)] tracking-tight mb-3">PRODUKTI NUK U GJEt</p>
        <Link to={ROUTES.SHOP} className="btn-outline text-[11px] inline-flex mt-4">Kthehu në Dyqan</Link>
      </div>
    </main>
  );

  const inWishlist = isInWishlist(product.id);
  const selectedVariant = product.variants.find(v => v.id === selectedVariantId);
  const totalStock = product.variants.reduce((s, v) => s + (v.active ? v.stockQuantity : 0), 0);
  const inStock = selectedVariant ? selectedVariant.stockQuantity > 0 : totalStock > 0;
  const lowStock = inStock && (selectedVariant ? selectedVariant.stockQuantity <= 3 : totalStock <= 3);
  const discount = product.originalPrice ? Math.round((1 - parseFloat(product.price) / parseFloat(product.originalPrice)) * 100) : null;
  const sizes = [...new Set(product.variants.filter(v => v.size && v.active).map(v => v.size!))];
  const colors = [...new Map(product.variants.filter(v => v.colorHex).map(v => [v.colorHex, v])).values()];

  const handleAddToCart = async () => {
    if (sizes.length > 0 && !selectedVariantId) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 3000);
      return;
    }
    setAdding(true);
    try {
      await addItem(product, qty, selectedVariantId, selectedVariant);
      toast.success(`${product.name} u shtua në shportë.`, { duration: 2200 });
      setTimeout(() => setAdding(false), 2200);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Gabim gjatë shtimit.');
      setAdding(false);
    }
  };

  const accordions = [
    { id: 'description', label: 'Përshkrimi', content: product.description ?? product.shortDescription ?? 'Pa përshkrim.' },
    ...(product.materials ? [{ id: 'materials', label: 'Materialet', content: product.materials }] : []),
    ...(product.careInstructions ? [{ id: 'care', label: 'Kujdesi', content: product.careInstructions }] : []),
  ];

  return (
    <main className="pt-[68px] min-h-screen pb-24 md:pb-0">
      <div className="container-e5 py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] text-[var(--c-text-3)] uppercase mb-8" aria-label="Rruga e navigimit">
          <Link to={ROUTES.HOME} className="hover:text-[var(--c-text)] transition-colors">Ballina</Link>
          <ChevronRight size={11} aria-hidden />
          <Link to={ROUTES.SHOP} className="hover:text-[var(--c-text)] transition-colors">Dyqani</Link>
          {product.category && <>
            <ChevronRight size={11} aria-hidden />
            <Link to={`${ROUTES.SHOP}?category=${product.category.slug}`} className="hover:text-[var(--c-text)] transition-colors">{product.category.name}</Link>
          </>}
          <ChevronRight size={11} aria-hidden />
          <span className="text-[var(--c-text-2)] truncate max-w-[120px]">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-[55fr_45fr] gap-8 md:gap-12 lg:gap-16">
          {/* ── Gallery ── */}
          <div className="space-y-3">
            <div className="relative aspect-[3/4] overflow-hidden bg-[var(--c-bg-3)] group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage]?.imageUrl ?? product.images[0]?.imageUrl}
                  alt={product.images[selectedImage]?.altText ?? product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  loading="eager"
                />
              </AnimatePresence>
              <button className="absolute top-3 right-3 w-8 h-8 bg-[var(--c-bg)]/80 border border-[var(--c-border)] flex items-center justify-center text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors opacity-0 group-hover:opacity-100" aria-label="Zmadho imazhin">
                <ZoomIn size={13} />
              </button>
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {product.limitedEdition && <span className="product-badge bg-[var(--c-red)] text-white">I Limituar</span>}
                {product.newArrival && !product.limitedEdition && <span className="product-badge bg-[var(--c-text)] text-[var(--c-text-inv)]">I Ri</span>}
                {discount !== null && discount > 0 && <span className="product-badge bg-[var(--c-red)] text-white">-{discount}%</span>}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-14 h-16 overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-[var(--c-text)]' : 'border-transparent opacity-50 hover:opacity-75'}`}
                    aria-label={`Foto ${i + 1}`}
                    aria-pressed={selectedImage === i}
                  >
                    <img src={img.imageUrl} alt={img.altText ?? `Foto ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info panel ── */}
          <div className="space-y-6 md:sticky md:top-24 md:self-start">
            {product.category && (
              <Link to={`${ROUTES.SHOP}?category=${product.category.slug}`} className="label-upper text-[var(--c-text-3)] hover:text-[var(--c-red-hi)] transition-colors">
                {product.category.name}
              </Link>
            )}

            <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-none text-[var(--c-text)] tracking-tight">{product.name}</h1>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="font-display text-4xl text-[var(--c-text)] leading-none tabular-nums">
                {CURRENCY_SYMBOL}{parseFloat(product.price).toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-[var(--c-text-3)] text-xl line-through tabular-nums">
                  {CURRENCY_SYMBOL}{parseFloat(product.originalPrice).toFixed(2)}
                </span>
              )}
            </div>

            {/* Reviews */}
            {product.reviews && product.reviews.length > 0 && (() => {
              const avg = product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length;
              return (
                <div className="flex items-center gap-2">
                  <div className="flex" aria-label={`${avg.toFixed(1)} yje mesatare`}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= avg ? 'text-yellow-400 fill-yellow-400' : 'text-[var(--c-text-3)]'} />)}
                  </div>
                  <span className="font-mono text-[10px] text-[var(--c-text-3)]">({product.reviews.length} vlerësime)</span>
                </div>
              );
            })()}

            {/* Colors */}
            {colors.length > 0 && (
              <div>
                <p className="label-upper text-[var(--c-text-3)] mb-2">Ngjyra</p>
                <div className="flex gap-2">
                  {colors.map(v => (
                    <button
                      key={v.colorHex}
                      onClick={() => { const variant = product.variants.find(pv => pv.colorHex === v.colorHex); if (variant) setSelectedVariantId(variant.id); }}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${selectedVariant?.colorHex === v.colorHex ? 'border-[var(--c-text)] scale-110' : 'border-[var(--c-border-hi)] hover:border-[var(--c-border-st)]'}`}
                      style={{ background: v.colorHex! }}
                      title={v.color ?? ''}
                      aria-label={v.color ?? 'Ngjyrë'}
                      aria-pressed={selectedVariant?.colorHex === v.colorHex}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div>
                <p className={`label-upper mb-2 ${sizeError ? 'text-[var(--c-red-hi)]' : 'text-[var(--c-text-3)]'}`}>
                  Madhësia {sizeError && '— Zgjidhni madhësinë'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => {
                    const v = product.variants.find(pv => pv.size === size && pv.active);
                    const avail = (v?.stockQuantity ?? 0) > 0;
                    const sel   = selectedVariant?.size === size;
                    return (
                      <button
                        key={size}
                        onClick={() => v && setSelectedVariantId(v.id)}
                        disabled={!avail}
                        aria-pressed={sel}
                        className={`px-4 py-2 font-mono text-[11px] tracking-wider border transition-all ${
                          sel     ? 'border-[var(--c-text)] bg-[var(--c-text)] text-[var(--c-text-inv)]'
                          : avail ? 'border-[var(--c-border-hi)] text-[var(--c-text)] hover:border-[var(--c-border-st)]'
                                  : 'border-[var(--c-border)] text-[var(--c-text-3)] cursor-not-allowed opacity-40 line-through'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock indicator */}
            {lowStock && inStock && (
              <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-yellow-400">
                ⚡ Vetëm {selectedVariant?.stockQuantity ?? totalStock} copë të mbetura
              </p>
            )}
            {!inStock && <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--c-red-hi)]">Ky produkt është shitur</p>}

            {/* Quantity + actions */}
            <div className="flex gap-3">
              <div className="flex items-center border border-[var(--c-border-hi)]">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-12 flex items-center justify-center text-[var(--c-text-3)] hover:text-[var(--c-text)] hover:bg-[rgba(240,237,232,0.05)] transition-colors" aria-label="Zvogëlo sasinë">
                  <Minus size={13} />
                </button>
                <span className="w-10 text-center font-mono text-[12px] text-[var(--c-text)] tabular-nums">{qty}</span>
                <button onClick={() => setQty(q => Math.min(10, q + 1))} className="w-10 h-12 flex items-center justify-center text-[var(--c-text-3)] hover:text-[var(--c-text)] hover:bg-[rgba(240,237,232,0.05)] transition-colors" aria-label="Rrit sasinë">
                  <Plus size={13} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!inStock || adding}
                className={`hidden md:flex flex-1 items-center justify-center gap-2 h-12 font-mono text-[10px] tracking-[0.18em] uppercase transition-all ${
                  !inStock ? 'bg-[var(--c-surface)] text-[var(--c-text-3)] cursor-not-allowed'
                    : adding ? 'bg-green-600 text-white'
                    : 'bg-[var(--c-text)] text-[var(--c-text-inv)] hover:bg-[#e8e3dc]'
                }`}
                aria-label={!inStock ? 'I Shitur' : 'Shto në Shportë'}
              >
                <ShoppingBag size={14} aria-hidden />
                {!inStock ? 'I Shitur' : adding ? 'Shtuar!' : 'Shto në Shportë'}
              </button>

              <button
                onClick={() => toggleItem(product)}
                className={`w-12 h-12 flex items-center justify-center border transition-all ${inWishlist ? 'bg-[var(--c-red)] border-[var(--c-red)] text-white' : 'border-[var(--c-border-hi)] text-[var(--c-text-2)] hover:text-white hover:bg-[var(--c-red)] hover:border-[var(--c-red)]'}`}
                aria-label={inWishlist ? 'Hiq nga lista e dëshirave' : 'Shto në listën e dëshirave'}
                aria-pressed={inWishlist}
              >
                <Heart size={15} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 border-t border-[var(--c-border)] pt-5">
              {[
                { Icon: Truck,    text: 'Dërgim falas mbi €60' },
                { Icon: RotateCcw,text: 'Kthim brenda 30 ditëve' },
                { Icon: Shield,   text: 'Produkt zyrtar' },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex flex-col items-center text-center gap-1.5">
                  <Icon size={15} className="text-[var(--c-text-3)]" aria-hidden />
                  <span className="font-mono text-[9px] leading-snug text-[var(--c-text-3)]">{text}</span>
                </div>
              ))}
            </div>

            {/* Product SKU */}
            <p className="font-mono text-[9px] tracking-[0.2em] text-[var(--c-text-3)] uppercase">SKU: {product.sku}</p>

            {/* Accordion */}
            <div className="border-t border-[var(--c-border)]">
              {accordions.map(a => (
                <div key={a.id} className="border-b border-[var(--c-border)]">
                  <button
                    onClick={() => setOpenSection(openSection === a.id ? '' : a.id)}
                    className="w-full flex items-center justify-between py-4 text-left"
                    aria-expanded={openSection === a.id}
                  >
                    <span className="text-[var(--c-text-2)] text-sm font-semibold">{a.label}</span>
                    <Plus size={13} className={`text-[var(--c-text-3)] transition-transform ${openSection === a.id ? 'rotate-45' : ''}`} aria-hidden />
                  </button>
                  <AnimatePresence>
                    {openSection === a.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="text-[var(--c-text-3)] text-sm leading-relaxed pb-4">{a.content}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related && related.length > 0 && (
          <div className="mt-20 md:mt-28">
            <div className="flex items-end justify-between mb-10">
              <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-none text-[var(--c-text)] tracking-tight">
                PRODUKTE TË NGJASHME
              </h2>
              <Link to={ROUTES.SHOP} className="hidden md:flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors group">
                Shiko të Gjitha <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
              {related.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* Mobile sticky add-to-cart */}
      {inStock && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--c-bg)]/95 backdrop-blur-xl border-t border-[var(--c-border)] p-4 flex gap-3">
          <button
            onClick={() => toggleItem(product)}
            className={`w-12 h-12 flex-shrink-0 flex items-center justify-center border transition-all ${inWishlist ? 'bg-[var(--c-red)] border-[var(--c-red)] text-white' : 'border-[var(--c-border-hi)] text-[var(--c-text-2)]'}`}
            aria-label={inWishlist ? 'Hiq nga lista' : 'Shto në listë'}
          >
            <Heart size={15} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={`flex-1 flex items-center justify-center gap-2 h-12 font-mono text-[10px] tracking-[0.18em] uppercase transition-all ${adding ? 'bg-green-600 text-white' : 'bg-[var(--c-text)] text-[var(--c-text-inv)]'}`}
          >
            <ShoppingBag size={13} aria-hidden />
            {adding ? 'Shtuar!' : 'Shto në Shportë'}
          </button>
        </div>
      )}
    </main>
  );
}
