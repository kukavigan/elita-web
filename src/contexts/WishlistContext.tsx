import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { wishlistApi, ApiProduct } from '@/services/api';
import { useAuth } from './AuthContext';

interface WishlistContextValue {
  items: ApiProduct[];
  count: number;
  addItem: (product: ApiProduct) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: ApiProduct) => void;
  isInWishlist: (productId: string) => boolean;
  clear: () => void;
  syncAfterLogin: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);
const LS_KEY = 'e5_wishlist_local';

function loadLocal(): ApiProduct[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]'); }
  catch { return []; }
}

function saveLocal(items: ApiProduct[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<ApiProduct[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) {
      wishlistApi.get()
        .then(wl => setItems(wl.items.map(i => i.product)))
        .catch(() => setItems(loadLocal()));
    } else {
      setItems(loadLocal());
    }
  }, [isAuthenticated, authLoading]);

  const addItem = useCallback((product: ApiProduct) => {
    if (isAuthenticated) {
      wishlistApi.addItem(product.id).then(wl => setItems(wl.items.map(i => i.product))).catch(() => {});
    }
    setItems(prev => {
      if (prev.find(p => p.id === product.id)) return prev;
      const next = [...prev, product];
      saveLocal(next);
      return next;
    });
  }, [isAuthenticated]);

  const removeItem = useCallback((productId: string) => {
    if (isAuthenticated) {
      wishlistApi.removeItem(productId).then(wl => setItems(wl.items.map(i => i.product))).catch(() => {});
    }
    setItems(prev => {
      const next = prev.filter(p => p.id !== productId);
      saveLocal(next);
      return next;
    });
  }, [isAuthenticated]);

  const toggleItem = useCallback((product: ApiProduct) => {
    const inWl = items.some(p => p.id === product.id);
    if (inWl) removeItem(product.id);
    else addItem(product);
  }, [items, addItem, removeItem]);

  const isInWishlist = useCallback((productId: string) => items.some(p => p.id === productId), [items]);

  const clear = useCallback(() => {
    setItems([]);
    saveLocal([]);
  }, []);

  const syncAfterLogin = useCallback(async () => {
    const local = loadLocal();
    if (!local.length) return;
    try {
      const wl = await wishlistApi.sync(local.map(p => p.id));
      setItems(wl.items.map(i => i.product));
      saveLocal([]);
    } catch { /* Keep local */ }
  }, []);

  return (
    <WishlistContext.Provider value={{
      items, count: items.length,
      addItem, removeItem, toggleItem, isInWishlist, clear, syncAfterLogin,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
}
