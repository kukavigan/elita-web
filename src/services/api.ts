/**
 * Centralized API service — talks to the Express/Prisma backend.
 * All product data comes from the real database; no mock data.
 */
import { get, post, put, del } from '@/lib/apiClient';

// ─── Type helpers ────────────────────────────────────────────────────────────

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  price: string; // Prisma returns Decimal as string
  originalPrice: string | null;
  sku: string;
  categoryId: string | null;
  collectionId: string | null;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  limitedEdition: boolean;
  active: boolean;
  materials: string | null;
  careInstructions: string | null;
  createdAt: string;
  updatedAt: string;
  images: { id: string; imageUrl: string; altText: string | null; sortOrder: number }[];
  variants: {
    id: string;
    size: string | null;
    color: string | null;
    colorHex: string | null;
    sku: string;
    stockQuantity: number;
    active: boolean;
  }[];
  category: { id: string; name: string; slug: string } | null;
  collection: { id: string; name: string; slug: string } | null;
  reviews?: ApiReview[];
}

export interface ApiReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { firstName: string; lastName: string };
}

export interface ApiOrder {
  id: string;
  orderNumber: string;
  userId: string | null;
  customerEmail: string;
  customerPhone: string | null;
  customerNotes: string | null;
  shippingFirstName: string;
  shippingLastName: string;
  shippingCountry: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingAddress1: string;
  shippingAddress2: string | null;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  subtotal: string;
  discount: string;
  shippingCost: string;
  tax: string;
  total: string;
  discountCode: string | null;
  trackingNumber: string | null;
  estimatedDelivery: string | null;
  createdAt: string;
  updatedAt: string;
  items: ApiOrderItem[];
}

export interface ApiOrderItem {
  id: string;
  productName: string;
  productSku: string;
  variantSku: string | null;
  size: string | null;
  color: string | null;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  productImage: string | null;
}

export interface ApiUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
  addresses?: ApiAddress[];
}

export interface ApiAddress {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  country: string;
  city: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string | null;
  deliveryNotes: string | null;
  isDefault: boolean;
}

export interface ApiCart {
  id: string;
  userId: string;
  items: ApiCartItem[];
}

export interface ApiCartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  price: string;
  product: ApiProduct;
  variant: ApiProductVariant | null;
}

export interface ApiProductVariant {
  id: string;
  size: string | null;
  color: string | null;
  colorHex: string | null;
  sku: string;
  stockQuantity: number;
}

export interface ApiWishlist {
  id: string;
  userId: string;
  items: {
    id: string;
    productId: string;
    product: ApiProduct;
  }[];
}

export interface PaginatedProducts {
  products: ApiProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// ─── Products ─────────────────────────────────────────────────────────────────

export const productsApi = {
  getAll: (params: Record<string, string | number | undefined> = {}) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') qs.set(k, String(v));
    }
    return get<PaginatedProducts>(`/products?${qs.toString()}`);
  },
  getBySlug: (slug: string) => get<ApiProduct>(`/products/${slug}`),
  getFeatured: (limit = 8) => get<ApiProduct[]>(`/products/featured?limit=${limit}`),
  getBestSellers: () => get<ApiProduct[]>('/products/best-sellers'),
  getNewArrivals: () => get<ApiProduct[]>('/products/new-arrivals'),
  getLimited: () => get<ApiProduct[]>('/products/limited'),
  getRelated: (productId: string, categoryId: string) =>
    get<ApiProduct[]>(`/products/related/${productId}/${categoryId || 'none'}`),
  getCategories: () => get<{ id: string; name: string; slug: string; image: string | null }[]>('/products/categories'),
  getCollections: () => get<{ id: string; name: string; slug: string }[]>('/products/collections'),
};

// Admin product mutations
export const adminProductsApi = {
  getAll: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return get<{ products: ApiProduct[]; pagination: { total: number } }>(`/products/admin/all?${qs}`);
  },
  create: (data: Record<string, unknown>) => post<ApiProduct>('/products', data),
  update: (id: string, data: Record<string, unknown>) => put<ApiProduct>(`/products/${id}`, data),
  addImage: (productId: string, data: { imageUrl: string; altText?: string; sortOrder?: number }) =>
    post<{ id: string }>(`/products/${productId}/images`, data),
  deleteImage: (imageId: string) => del<void>(`/products/images/${imageId}`),
  addVariant: (productId: string, data: Record<string, unknown>) =>
    post<ApiProductVariant>(`/products/${productId}/variants`, data),
  updateVariant: (variantId: string, data: Record<string, unknown>) =>
    put<ApiProductVariant>(`/products/variants/${variantId}`, data),
  deleteVariant: (variantId: string) => del<void>(`/products/variants/${variantId}`),
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    post<{ user: ApiUser; token: string }>('/auth/login', { email, password }),
  register: (data: { firstName: string; lastName: string; email: string; password: string; phone?: string }) =>
    post<{ user: ApiUser; token: string }>('/auth/register', data),
  getMe: () => get<ApiUser>('/auth/me'),
  updateProfile: (data: { firstName?: string; lastName?: string; phone?: string }) =>
    put<ApiUser>('/auth/me', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    put<{ message: string }>('/auth/me/password', data),
  getAddresses: () => get<ApiAddress[]>('/auth/me/addresses'),
  createAddress: (data: Partial<ApiAddress>) =>
    post<ApiAddress>('/auth/me/addresses', data),
  updateAddress: (id: string, data: Partial<ApiAddress>) =>
    put<ApiAddress>(`/auth/me/addresses/${id}`, data),
  deleteAddress: (id: string) => del<void>(`/auth/me/addresses/${id}`),
};

// ─── Cart ─────────────────────────────────────────────────────────────────────

export const cartApi = {
  get: () => get<ApiCart>('/cart'),
  addItem: (productId: string, variantId: string | undefined, quantity: number) =>
    post<ApiCartItem>('/cart/items', { productId, variantId, quantity }),
  updateItem: (itemId: string, quantity: number) =>
    put<ApiCartItem>(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId: string) => del<void>(`/cart/items/${itemId}`),
  clear: () => del<void>('/cart'),
  sync: (items: { productId: string; variantId?: string; quantity: number }[]) =>
    post<ApiCart>('/cart/sync', { items }),
};

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export const wishlistApi = {
  get: () => get<ApiWishlist>('/wishlist'),
  addItem: (productId: string) => post<ApiWishlist>('/wishlist/items', { productId }),
  removeItem: (productId: string) => del<ApiWishlist>(`/wishlist/items/${productId}`),
  sync: (productIds: string[]) => post<ApiWishlist>('/wishlist/sync', { productIds }),
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export const ordersApi = {
  create: (data: Record<string, unknown>) => post<ApiOrder>('/orders', data),
  getById: (id: string) => get<ApiOrder>(`/orders/${id}`),
  getByOrderNumber: (orderNumber: string) => get<ApiOrder>(`/orders/number/${orderNumber}`),
  getMyOrders: () => get<ApiOrder[]>('/orders/my'),
  validateDiscount: (code: string, subtotal: number) =>
    post<{ valid: boolean; discountAmount: number; type: string; value: number; description: string | null }>
      ('/orders/discount/validate', { code, subtotal }),
};

// Admin orders
export const adminOrdersApi = {
  getAll: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return get<{ orders: ApiOrder[]; pagination: { total: number; totalPages: number } }>(`/orders/admin/all?${qs}`);
  },
  updateStatus: (id: string, data: { orderStatus?: string; paymentStatus?: string; trackingNumber?: string }) =>
    put<ApiOrder>(`/orders/admin/${id}`, data),
  getStats: () => get<{
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    confirmedOrders: number;
    totalCustomers: number;
    recentOrders: ApiOrder[];
    lowStockVariants: { id: string; sku: string; stockQuantity: number; product: { name: string; sku: string } }[];
  }>('/orders/admin/stats'),
};

// ─── Newsletter ───────────────────────────────────────────────────────────────

export const newsletterApi = {
  subscribe: (email: string) => post<{ message: string }>('/auth/newsletter', { email }),
};

// ─── Concerts (still static — no backend needed) ──────────────────────────────

import { CONCERTS } from '@/data/concerts';

export const concertsApi = {
  getAll: () => Promise.resolve(CONCERTS),
  getUpcoming: (limit = 10) => Promise.resolve(CONCERTS.filter(c => !c.soldOut).slice(0, limit)),
};

// Backward-compat shim — some pages still use `api.*`
export const api = {
  products: {
    getAll: (filter?: Record<string, unknown>, sort?: string, page = 1, limit = 24) => {
      const params: Record<string, string> = { page: String(page), limit: String(limit) };
      if (sort) params.sort = sort;
      if (filter) {
        for (const [k, v] of Object.entries(filter)) {
          if (v !== undefined && v !== null && v !== '') params[k] = String(v);
        }
      }
      return productsApi.getAll(params);
    },
    getBySlug: productsApi.getBySlug,
    getById: (id: string) => productsApi.getBySlug(id),
    getFeatured: () => productsApi.getFeatured(8),
    getBestSellers: () => productsApi.getBestSellers(),
    getLimited: () => productsApi.getLimited(),
    getNewArrivals: () => productsApi.getNewArrivals(),
    getRelated: (productId: string, categoryId: string) => productsApi.getRelated(productId, categoryId),
    search: (query: string) => productsApi.getAll({ search: query }),
  },
  concerts: concertsApi,
  newsletter: {
    subscribe: (email: string) => newsletterApi.subscribe(email),
  },
  auth: {
    login: (email: string, password: string) => authApi.login(email, password),
    register: (data: { firstName: string; lastName: string; email: string; password: string; phone?: string }) =>
      authApi.register(data),
    logout: () => Promise.resolve(),
    getCurrentUser: () => {
      const token = localStorage.getItem('e5_token');
      if (!token) return Promise.resolve(null);
      return authApi.getMe().catch(() => null);
    },
  },
  orders: {
    create: (data: Record<string, unknown>) => ordersApi.create(data),
    getById: (id: string) => ordersApi.getById(id),
    getByUser: () => ordersApi.getMyOrders(),
  },
  discounts: {
    validate: (code: string, subtotal: number) => ordersApi.validateDiscount(code, subtotal),
  },
};
