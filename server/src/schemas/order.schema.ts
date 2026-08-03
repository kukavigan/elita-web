import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    // Customer info
    customerEmail: z.string().email('Email i pavlefshëm.'),
    customerPhone: z.string().optional(),
    customerNotes: z.string().optional(),

    // Shipping address
    shippingFirstName: z.string().min(2),
    shippingLastName: z.string().min(2),
    shippingCountry: z.string().min(2),
    shippingCity: z.string().min(2),
    shippingPostalCode: z.string().min(3),
    shippingAddress1: z.string().min(5),
    shippingAddress2: z.string().optional(),
    shippingPhone: z.string().optional(),

    // Payment
    paymentMethod: z.enum(['CASH_ON_DELIVERY', 'BANK_TRANSFER']),

    // Discount
    discountCode: z.string().optional(),

    // For guest checkout — cart items
    guestItems: z
      .array(
        z.object({
          productId: z.string(),
          variantId: z.string().optional(),
          quantity: z.number().int().min(1),
        }),
      )
      .optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    orderStatus: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
    paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']).optional(),
    trackingNumber: z.string().optional(),
  }),
});
