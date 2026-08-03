/**
 * Re-exports API types for backward compatibility.
 * All real data types come from src/services/api.ts (ApiProduct, etc.)
 */
export type { ApiProduct as Product, ApiOrder as Order, ApiUser as User, ApiAddress as Address, ApiCartItem as CartItem, ApiOrderItem as OrderItem } from '@/services/api';

// ─── Local-only types ─────────────────────────────────────────────────────────

export type OrderStatus =
  | 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type PaymentMethod = 'CASH_ON_DELIVERY' | 'BANK_TRANSFER';

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Concert {
  id: string;
  date: string;
  city: string;
  country: string;
  venue: string;
  time: string;
  available: boolean;
  ticketUrl?: string;
  soldOut?: boolean;
  featured?: boolean;
}

export interface Album {
  id: string;
  title: string;
  year: number;
  coverImage: string;
  tracks: { title: string; duration: string }[];
}

export interface SortOption {
  value: string;
  label: string;
}

export interface SearchResult {
  products: import('@/services/api').ApiProduct[];
  total: number;
}
