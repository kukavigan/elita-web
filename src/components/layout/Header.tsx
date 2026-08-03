import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Search, User, Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useSearch } from '@/contexts/SearchContext';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/routes';

const ANNOUNCEMENTS = [
  'Transport falas në Kosovë për porosi mbi €60',
  'Koleksioni i ri Elita5 2025 — tani në dispozicion',
  'Produkte zyrtare të Elita5 — autentike dhe ekskluzive',
];

const NAV = [
  { label: 'Ballina',     href: '/' },
  { label: 'Dyqani',      href: '/dyqani', hasDropdown: true },
  { label: 'Koleksionet', href: '/koleksionet' },
  { label: 'Muzika',      href: '/muzika' },
  { label: 'Koncertet',   href: '/koncertet' },
  { label: 'Historia',    href: '/rreth-nesh' },
];

const SHOP_MENU = [
  { label: 'Të gjitha', href: ROUTES.SHOP, note: 'Shfleto katalogun e plotë' },
  { label: 'Bluza',     href: `${ROUTES.SHOP}?category=tshirts`, note: 'T-shirts & tops' },
  { label: 'Kapuçe',    href: `${ROUTES.SHOP}?category=hoodies`, note: 'Hoodies & sweatshirts' },
  { label: 'Vinyl & CD',href: `${ROUTES.SHOP}?category=vinyl`,   note: 'Muzikë fizike' },
  { label: 'Aksesore',  href: `${ROUTES.SHOP}?category=accessories`, note: 'Plek, gota, çanta' },
  { label: 'I Kufizuar',href: `${ROUTES.SHOP}?badge=limited`,    note: 'Edicion special' },
];

export function Header() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen,   setShopOpen]   = useState(false);
  const [annIdx,     setAnnIdx]     = useState(0);
  const [annDismissed, setAnnDismissed] = useState(false);
  const shopRef  = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { count: cartCount, openCart } = useCart();
  const { count: wishlistCount }       = useWishlist();
  const { open: openSearch }           = useSearch();
  const { user }                       = useAuth();

  // Scroll listener
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Close mobile on route change
  useEffect(() => { setMobileOpen(false); setShopOpen(false); }, [location.pathname]);

  // Announcement rotation
  useEffect(() => {
    const t = setInterval(() => setAnnIdx(i => (i + 1) % ANNOUNCEMENTS.length), 4000);
    return () => clearInterval(t);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Click-outside to close shop dropdown
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) setShopOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT','TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        openSearch();
      }
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [openSearch]);

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !scrolled;

  return (
    <>
      {/* ── Announcement Bar ── */}
      <AnimatePresence>
        {!annDismissed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-50 bg-[#0f0f0f] border-b border-[var(--c-border)] overflow-hidden"
          >
            <div className="container-e5 flex items-center justify-center py-2.5 relative">
              <AnimatePresence mode="wait">
                <motion.p
                  key={annIdx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35 }}
                  className="font-mono text-[10px] tracking-[0.2em] text-[var(--c-text-2)] uppercase text-center"
                >
                  {ANNOUNCEMENTS[annIdx]}
                </motion.p>
              </AnimatePresence>
              <button
                onClick={() => setAnnDismissed(true)}
                className="absolute right-4 text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors p-1"
                aria-label="Mbyll njoftimin"
              >
                <X size={12} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Header ── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`sticky top-0 z-40 transition-all duration-500 ${
          isTransparent
            ? 'bg-transparent'
            : 'bg-[rgba(8,8,8,0.96)] backdrop-blur-xl border-b border-[var(--c-border)]'
        }`}
      >
        <div className="container-e5">
          <div className="flex items-center justify-between h-[68px]">

            {/* Logo */}
            <Link to={ROUTES.HOME} className="flex-shrink-0 group" aria-label="Elita5 — Ballina">
              <span className="font-display text-[2rem] leading-none text-[var(--c-text)] group-hover:text-[var(--c-red-hi)] transition-colors duration-300 tracking-tight">
                ELITA<span className="text-[var(--c-red)]">5</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center" aria-label="Navigimi kryesor">
              {NAV.map(link => {
                if (link.hasDropdown) {
                  return (
                    <div key={link.href} ref={shopRef} className="relative">
                      <button
                        onClick={() => setShopOpen(v => !v)}
                        onMouseEnter={() => setShopOpen(true)}
                        className={`flex items-center gap-1 px-4 py-5 text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors duration-200 ${
                          location.pathname.startsWith('/dyqani') || shopOpen
                            ? 'text-[var(--c-text)]'
                            : 'text-[var(--c-text-3)] hover:text-[var(--c-text)]'
                        }`}
                        aria-expanded={shopOpen}
                        aria-haspopup="true"
                      >
                        {link.label}
                        <ChevronDown
                          size={11}
                          className={`transition-transform duration-200 ${shopOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      <AnimatePresence>
                        {shopOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{ duration: 0.2 }}
                            onMouseLeave={() => setShopOpen(false)}
                            className="absolute top-full left-0 w-64 bg-[var(--c-bg-2)] border border-[var(--c-border-hi)] py-2 shadow-2xl shadow-black/60"
                            role="menu"
                          >
                            {SHOP_MENU.map(item => (
                              <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setShopOpen(false)}
                                role="menuitem"
                                className="group flex items-start justify-between gap-3 px-5 py-3.5 hover:bg-[rgba(240,237,232,0.04)] transition-colors"
                              >
                                <div>
                                  <p className="text-[var(--c-text)] text-xs font-semibold tracking-wider uppercase">{item.label}</p>
                                  <p className="text-[var(--c-text-3)] text-[10px] mt-0.5">{item.note}</p>
                                </div>
                                <ArrowRight size={12} className="text-[var(--c-text-3)] group-hover:text-[var(--c-text)] mt-1 flex-shrink-0 transition-colors" />
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`relative px-4 py-5 text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors duration-200 group ${
                      isActive ? 'text-[var(--c-text)]' : 'text-[var(--c-text-3)] hover:text-[var(--c-text)]'
                    }`}
                  >
                    {link.label}
                    {/* underline indicator */}
                    <span className={`absolute bottom-4 left-4 right-4 h-px bg-[var(--c-red)] transition-transform duration-200 origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} aria-hidden />
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={openSearch}
                className="relative flex items-center gap-1.5 p-2.5 text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors duration-200"
                aria-label="Kërko  [ / ]"
                title="Kërko  ( / )"
              >
                <Search size={17} />
              </button>

              <Link
                to={user ? ROUTES.ACCOUNT : ROUTES.LOGIN}
                className="p-2.5 text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors duration-200"
                aria-label="Llogaria"
              >
                <User size={17} />
              </Link>

              <Link
                to={ROUTES.WISHLIST}
                className="relative p-2.5 text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors duration-200"
                aria-label={`Lista e dëshirave — ${wishlistCount} produkte`}
              >
                <Heart size={17} />
                <AnimatePresence>
                  {wishlistCount > 0 && (
                    <motion.span
                      key={wishlistCount}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[var(--c-red)] text-white text-[7px] font-bold flex items-center justify-center"
                      aria-hidden
                    >
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <button
                onClick={openCart}
                className="relative p-2.5 text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors duration-200"
                aria-label={`Shporta — ${cartCount} produkte`}
              >
                <ShoppingBag size={17} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[var(--c-red)] text-white text-[7px] font-bold flex items-center justify-center"
                      aria-hidden
                    >
                      {cartCount > 9 ? '9+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen(v => !v)}
                className="lg:hidden ml-1 p-2.5 text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors duration-200"
                aria-label={mobileOpen ? 'Mbyll menunë' : 'Hap menunë'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={19} /> : <Menu size={19} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── Fullscreen Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-[var(--c-bg)] flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigimi mobil"
          >
            {/* Header stripe */}
            <div className="flex items-center justify-between px-6 h-[68px] border-b border-[var(--c-border)] flex-shrink-0">
              <span className="font-display text-[2rem] leading-none text-[var(--c-text)] tracking-tight">
                ELITA<span className="text-[var(--c-red)]">5</span>
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-[var(--c-text-2)] hover:text-[var(--c-text)] transition-colors"
                aria-label="Mbyll menunë"
              >
                <X size={22} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 flex flex-col justify-center px-8 overflow-auto" aria-label="Navigimi mobil">
              {NAV.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 + i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={link.href}
                    className={`flex items-center justify-between py-5 border-b border-[var(--c-border)] group ${
                      location.pathname === link.href
                        ? 'text-[var(--c-text)]'
                        : 'text-[var(--c-text-2)] hover:text-[var(--c-text)]'
                    }`}
                  >
                    <span className="font-display text-[clamp(2rem,9vw,3.5rem)] leading-none tracking-tight">
                      {link.label.toUpperCase()}
                    </span>
                    <ArrowRight
                      size={18}
                      className="text-[var(--c-text-3)] group-hover:text-[var(--c-red)] transition-colors"
                    />
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Footer strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="px-8 py-6 border-t border-[var(--c-border)] flex flex-wrap items-center justify-between gap-4 flex-shrink-0"
            >
              <div className="flex items-center gap-4">
                <Link to={ROUTES.WISHLIST} className="flex items-center gap-2 text-[var(--c-text-3)] hover:text-[var(--c-text)] text-xs tracking-wider transition-colors">
                  <Heart size={14} />
                  Lista ({wishlistCount})
                </Link>
                <button onClick={() => { setMobileOpen(false); openCart(); }} className="flex items-center gap-2 text-[var(--c-text-3)] hover:text-[var(--c-text)] text-xs tracking-wider transition-colors">
                  <ShoppingBag size={14} />
                  Shporta ({cartCount})
                </button>
              </div>
              <Link to={user ? ROUTES.ACCOUNT : ROUTES.LOGIN} className="text-xs tracking-wider text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors">
                {user ? `${user.firstName} ${user.lastName}` : 'Kyçu'}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
