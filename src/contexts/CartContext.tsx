import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { toast } from 'sonner';
import { cartApi, ApiCart, ApiProduct, ApiProductVariant } from '@/services/api';
import { useAuth } from './AuthContext';

interface LocalCartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  product: ApiProduct;
  variant?: ApiProductVariant;
}

interface CartContextValue {
  items: LocalCartItem[];
  count: number;
  subtotal: number;
  couponCode: string | null;
  couponDiscount: number;
  isOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: ApiProduct, qty: number, variantId?: string, variant?: ApiProductVariant) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQty: (itemId: string, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  isInCart: (productId: string, variantId?: string) => boolean;
  syncAfterLogin: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const LS_KEY = 'e5_cart_local';

function loadLocal(): LocalCartItem[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveLocal(items: LocalCartItem[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

function cartToLocal(cart: ApiCart): LocalCartItem[] {
  return cart.items.map(i => ({
    productId: i.productId,
    variantId: i.variantId ?? undefined,
    quantity: i.quantity,
    price: parseFloat(i.price),
    product: i.product,
    variant: i.variant ?? undefined,
  }));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<LocalCartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Load cart on auth change
  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) {
      setIsLoading(true);
      cartApi.get()
        .then(cart => setItems(cartToLocal(cart)))
        .catch(() => setItems(loadLocal()))
        .finally(() => setIsLoading(false));
    } else {
      setItems(loadLocal());
    }
  }, [isAuthenticated, authLoading]);

  const addItem = useCallback(async (
    product: ApiProduct,
    qty: number,
    variantId?: string,
    variant?: ApiProductVariant,
  ) => {
    if (isAuthenticated) {
      const dbVariantId = variantId;
      await cartApi.addItem(product.id, dbVariantId, qty);
      const cart = await cartApi.get();
      setItems(cartToLocal(cart));
    } else {
      setItems(prev => {
        const key = `${product.id}_${variantId ?? ''}`;
        const exists = prev.find(i => `${i.productId}_${i.variantId ?? ''}` === key);
        let next: LocalCartItem[];
        if (exists) {
          next = prev.map(i =>
            `${i.productId}_${i.variantId ?? ''}` === key ? { ...i, quantity: i.quantity + qty } : i,
          );
        } else {
          next = [...prev, { productId: product.id, variantId, quantity: qty, price: parseFloat(product.price), product, variant }];
        }
        saveLocal(next);
        return next;
      });
    }
    setIsOpen(true);
  }, [isAuthenticated]);

  const removeItem = useCallback(async (itemId: string) => {
    if (isAuthenticated) {
      await cartApi.removeItem(itemId);
      const cart = await cartApi.get();
      setItems(cartToLocal(cart));
    } else {
      setItems(prev => {
        const next = prev.filter(i => i.productId !== itemId);
        saveLocal(next);
        return next;
      });
    }
  }, [isAuthenticated]);

  const updateQty = useCallback(async (itemId: string, qty: number) => {
    if (isAuthenticated) {
      await cartApi.updateItem(itemId, qty);
      const cart = await cartApi.get();
      setItems(cartToLocal(cart));
    } else {
      setItems(prev => {
        const next = prev.map(i => i.productId === itemId ? { ...i, quantity: qty } : i);
        saveLocal(next);
        return next;
      });
    }
  }, [isAuthenticated]);

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      await cartApi.clear();
    }
    setItems([]);
    saveLocal([]);
    setCouponCode(null);
    setCouponDiscount(0);
  }, [isAuthenticated]);

  const applyCoupon = useCallback(async (code: string) => {
    const { ordersApi } = await import('@/services/api');
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const result = await ordersApi.validateDiscount(code, subtotal);
    setCouponCode(code.toUpperCase());
    // Store as percentage equivalent for UI (best effort)
    setCouponDiscount(result.type === 'PERCENTAGE' ? result.value : (result.discountAmount / subtotal) * 100);
    toast.success(`Kodi "${code.toUpperCase()}" u aplikua: -€${result.discountAmount.toFixed(2)}`);
  }, [items]);

  const removeCoupon = useCallback(() => {
    setCouponCode(null);
    setCouponDiscount(0);
  }, []);

  const isInCart = useCallback((productId: string, variantId?: string) => {
    return items.some(i => i.productId === productId && (variantId ? i.variantId === variantId : true));
  }, [items]);

  const syncAfterLogin = useCallback(async () => {
    const local = loadLocal();
    if (!local.length) return;
    try {
      await cartApi.sync(local.map(i => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })));
      saveLocal([]);
      const cart = await cartApi.get();
      setItems(cartToLocal(cart));
    } catch {
      // Keep local items on error
    }
  }, []);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, count, subtotal, couponCode, couponDiscount,
      isOpen, isLoading,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem, removeItem, updateQty, clearCart,
      applyCoupon, removeCoupon, isInCart, syncAfterLogin,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
