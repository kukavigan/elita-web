import { z } from 'zod';

export const addCartItemSchema = z.object({
  body: z.object({
    productId: z.string().min(1, 'ID e produktit është e detyrueshme.'),
    variantId: z.string().optional(),
    quantity: z.number().int().min(1).max(10),
  }),
});

export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.number().int().min(1).max(10),
  }),
  params: z.object({
    itemId: z.string(),
  }),
});

export const syncCartSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        productId: z.string(),
        variantId: z.string().optional(),
        quantity: z.number().int().min(1),
      }),
    ),
  }),
});
