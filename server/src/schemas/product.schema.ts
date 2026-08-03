import { z } from 'zod';

export const productQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    collection: z.string().optional(),
    size: z.string().optional(),
    color: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    sort: z.enum(['price_asc', 'price_desc', 'newest', 'oldest', 'name_asc', 'name_desc', 'popular']).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    featured: z.string().optional(),
    bestSeller: z.string().optional(),
    newArrival: z.string().optional(),
    limitedEdition: z.string().optional(),
    badge: z.string().optional(),
  }),
});

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Emri duhet të ketë të paktën 2 karaktere.'),
    slug: z.string().min(2).optional(),
    shortDescription: z.string().optional(),
    description: z.string().optional(),
    price: z.number().positive('Çmimi duhet të jetë pozitiv.'),
    originalPrice: z.number().positive().optional(),
    sku: z.string().min(2, 'SKU është i detyrueshëm.'),
    categoryId: z.string().optional(),
    collectionId: z.string().optional(),
    featured: z.boolean().optional(),
    bestSeller: z.boolean().optional(),
    newArrival: z.boolean().optional(),
    limitedEdition: z.boolean().optional(),
    active: z.boolean().optional(),
    materials: z.string().optional(),
    careInstructions: z.string().optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    shortDescription: z.string().optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    originalPrice: z.number().positive().nullable().optional(),
    categoryId: z.string().nullable().optional(),
    collectionId: z.string().nullable().optional(),
    featured: z.boolean().optional(),
    bestSeller: z.boolean().optional(),
    newArrival: z.boolean().optional(),
    limitedEdition: z.boolean().optional(),
    active: z.boolean().optional(),
    materials: z.string().optional(),
    careInstructions: z.string().optional(),
  }),
});

export const createVariantSchema = z.object({
  body: z.object({
    size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE_SIZE']).optional(),
    color: z.string().optional(),
    colorHex: z.string().optional(),
    sku: z.string().min(2, 'SKU i variantit është i detyrueshëm.'),
    stockQuantity: z.number().int().min(0),
    active: z.boolean().optional(),
  }),
});

export const updateVariantSchema = z.object({
  body: z.object({
    stockQuantity: z.number().int().min(0).optional(),
    active: z.boolean().optional(),
    color: z.string().optional(),
    colorHex: z.string().optional(),
  }),
});
