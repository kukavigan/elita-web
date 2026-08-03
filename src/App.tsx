import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from '@/components/ui/sonner';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { PageLayout } from '@/components/layout/PageLayout';
import { ROUTES } from '@/lib/routes';

// Pages
import { HomePage }              from '@/pages/home/HomePage';
import { ShopPage }              from '@/pages/shop/ShopPage';
import { ProductPage }           from '@/pages/product/ProductPage';
import { CartPage }              from '@/pages/cart/CartPage';
import { CheckoutPage }          from '@/pages/checkout/CheckoutPage';
import { OrderConfirmationPage } from '@/pages/checkout/OrderConfirmationPage';
import { LoginPage }             from '@/pages/account/LoginPage';
import { RegisterPage }          from '@/pages/account/RegisterPage';
import { AccountPage }           from '@/pages/account/AccountPage';
import { WishlistPage }          from '@/pages/account/WishlistPage';
import { ConcertsPage }          from '@/pages/ConcertsPage';
import { AboutPage }             from '@/pages/AboutPage';
import { MusicPage }             from '@/pages/MusicPage';
import { AdminDashboard }        from '@/pages/admin/AdminDashboard';
import { ContactPage }           from '@/pages/info/ContactPage';
import { FaqPage }               from '@/pages/info/FaqPage';
import { ShippingPage }          from '@/pages/info/ShippingPage';
import { ReturnsPage }           from '@/pages/info/ReturnsPage';
import { PrivacyPage }           from '@/pages/info/PrivacyPage';
import { TermsPage }             from '@/pages/info/TermsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1, refetchOnWindowFocus: false },
  },
});

const EASE = [0.16, 1, 0.3, 1] as const;

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function NotFoundPage() {
  useEffect(() => { document.title = '404 — Elita5 Store'; }, []);
  return (
    <main className="pt-[68px] min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <p className="font-display text-[clamp(8rem,25vw,16rem)] leading-none text-[var(--c-border-hi)] tracking-tight select-none">404</p>
        <h1 className="font-display text-4xl md:text-6xl text-[var(--c-text)] tracking-tight -mt-4">FAQJA NUK U GJEt</h1>
        <p className="text-[var(--c-text-3)] text-sm mt-4 mb-8 max-w-xs mx-auto">Faqja që kërkuat nuk ekziston ose është zhvendosur.</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href={ROUTES.HOME} className="btn-primary text-[11px]">Kthehu në Ballina</a>
          <a href={ROUTES.SHOP} className="btn-outline text-[11px]">Shiko Dyqanin</a>
        </div>
      </div>
    </main>
  );
}

function SimplePage({ title, message }: { title: string; message?: string }) {
  return (
    <main className="pt-[68px] min-h-screen flex items-center justify-center text-center">
      <div>
        <h1 className="font-display text-5xl text-[var(--c-text)] tracking-tight mb-3">{title}</h1>
        <p className="text-[var(--c-text-3)] text-sm">{message ?? 'Kjo faqe është duke u ndërtuar.'}</p>
      </div>
    </main>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); }, [pathname]);
  return null;
}

function AppRoutes() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public */}
          <Route path={ROUTES.HOME}                      element={<PageLayout><PageTransition><HomePage /></PageTransition></PageLayout>} />
          <Route path={ROUTES.SHOP}                      element={<PageLayout><PageTransition><ShopPage /></PageTransition></PageLayout>} />
          <Route path={ROUTES.PRODUCT_PARAM}             element={<PageLayout><PageTransition><ProductPage /></PageTransition></PageLayout>} />
          <Route path={ROUTES.CART}                      element={<PageLayout><PageTransition><CartPage /></PageTransition></PageLayout>} />
          <Route path={ROUTES.CHECKOUT}                  element={<PageLayout noFooter><PageTransition><CheckoutPage /></PageTransition></PageLayout>} />
          <Route path={ROUTES.ORDER_CONFIRMATION_PARAM}  element={<PageLayout><PageTransition><OrderConfirmationPage /></PageTransition></PageLayout>} />
          <Route path={ROUTES.CONCERTS}                  element={<PageLayout><PageTransition><ConcertsPage /></PageTransition></PageLayout>} />
          <Route path={ROUTES.ABOUT}                     element={<PageLayout><PageTransition><AboutPage /></PageTransition></PageLayout>} />
          <Route path={ROUTES.MUSIC}                     element={<PageLayout><PageTransition><MusicPage /></PageTransition></PageLayout>} />
          <Route path={ROUTES.COLLECTIONS}               element={<PageLayout><PageTransition><ShopPage /></PageTransition></PageLayout>} />
          <Route path={ROUTES.WISHLIST}                  element={<PageLayout><PageTransition><WishlistPage /></PageTransition></PageLayout>} />

          {/* Auth */}
          <Route path={ROUTES.LOGIN}           element={<PageLayout noFooter><PageTransition><LoginPage /></PageTransition></PageLayout>} />
          <Route path={ROUTES.REGISTER}        element={<PageLayout noFooter><PageTransition><RegisterPage /></PageTransition></PageLayout>} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<PageLayout noFooter><PageTransition><SimplePage title="FJALËKALIMI I HARRUAR" message="Funksioni i resetimit është duke u zhvilluar." /></PageTransition></PageLayout>} />

          {/* Account */}
          <Route path={ROUTES.ACCOUNT}          element={<PageLayout><PageTransition><AccountPage /></PageTransition></PageLayout>} />
          <Route path={ROUTES.ACCOUNT_ORDERS}   element={<PageLayout><PageTransition><AccountPage /></PageTransition></PageLayout>} />
          <Route path={ROUTES.ACCOUNT_PROFILE}  element={<PageLayout><PageTransition><AccountPage /></PageTransition></PageLayout>} />
          <Route path={ROUTES.ACCOUNT_ADDRESSES}element={<PageLayout><PageTransition><AccountPage /></PageTransition></PageLayout>} />
          <Route path={ROUTES.ACCOUNT_SETTINGS} element={<PageLayout><PageTransition><AccountPage /></PageTransition></PageLayout>} />

          {/* Info */}
          <Route path={ROUTES.CONTACT}    element={<PageLayout><PageTransition><ContactPage /></PageTransition></PageLayout>} />
          <Route path={ROUTES.FAQ}        element={<PageLayout><PageTransition><FaqPage /></PageTransition></PageLayout>} />
          <Route path={ROUTES.SHIPPING}   element={<PageLayout><PageTransition><ShippingPage /></PageTransition></PageLayout>} />
          <Route path={ROUTES.RETURNS}    element={<PageLayout><PageTransition><ReturnsPage /></PageTransition></PageLayout>} />
          <Route path={ROUTES.SIZE_GUIDE} element={<PageLayout><PageTransition><SimplePage title="MADHËSITË" message="XS · S · M · L · XL · XXL" /></PageTransition></PageLayout>} />
          <Route path={ROUTES.PRIVACY}    element={<PageLayout><PageTransition><PrivacyPage /></PageTransition></PageLayout>} />
          <Route path={ROUTES.TERMS}      element={<PageLayout><PageTransition><TermsPage /></PageTransition></PageLayout>} />

          {/* Admin */}
          <Route path="/admin/*" element={<PageLayout noFooter><PageTransition><AdminDashboard /></PageTransition></PageLayout>} />

          {/* 404 */}
          <Route path="*" element={<PageLayout><PageTransition><NotFoundPage /></PageTransition></PageLayout>} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <SearchProvider>
              <BrowserRouter>
                <AppRoutes />
                <Toaster
                  theme="dark"
                  position="bottom-right"
                  toastOptions={{
                    style: {
                      background: '#1c1c1c',
                      border: '1px solid rgba(240,237,232,0.1)',
                      color: '#f0ede8',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '13px',
                    },
                  }}
                />
              </BrowserRouter>
            </SearchProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
