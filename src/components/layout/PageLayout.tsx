import { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchOverlay } from '@/components/search/SearchOverlay';

interface Props {
  children: ReactNode;
  noFooter?: boolean;
}

export function PageLayout({ children, noFooter }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0B]">
      <Header />
      <div className="flex-1">{children}</div>
      {!noFooter && <Footer />}
      <CartDrawer />
      <SearchOverlay />
    </div>
  );
}
