// Products are loaded from the real API backend (Express + Prisma).
// This file is kept for backward compatibility but is no longer the source of truth.
// See src/services/api.ts → productsApi

import type { ApiProduct } from '@/services/api';

export const PRODUCTS: ApiProduct[] = [];
