import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, 'Emri duhet të ketë të paktën 2 karaktere.'),
    lastName: z.string().min(2, 'Mbiemri duhet të ketë të paktën 2 karaktere.'),
    email: z.string().trim().email('Adresa e emailit nuk është e vlefshme.'),
    password: z.string().min(8, 'Fjalëkalimi duhet të ketë të paktën 8 karaktere.'),
    phone: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Adresa e emailit nuk është e vlefshme.'),
    password: z.string().min(1, 'Fjalëkalimi është i detyrueshëm.'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, 'Emri duhet të ketë të paktën 2 karaktere.').optional(),
    lastName: z.string().min(2, 'Mbiemri duhet të ketë të paktën 2 karaktere.').optional(),
    phone: z.string().optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Fjalëkalimi aktual është i detyrueshëm.'),
    newPassword: z.string().min(8, 'Fjalëkalimi i ri duhet të ketë të paktën 8 karaktere.'),
  }),
});

export const addressSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, 'Emri duhet të ketë të paktën 2 karaktere.'),
    lastName: z.string().min(2, 'Mbiemri duhet të ketë të paktën 2 karaktere.'),
    phone: z.string().optional(),
    country: z.string().min(2, 'Shteti është i detyrueshëm.'),
    city: z.string().min(2, 'Qyteti është i detyrueshëm.'),
    postalCode: z.string().min(4, 'Kodi postar duhet të ketë të paktën 4 karaktere.'),
    addressLine1: z.string().min(5, 'Adresa duhet të ketë të paktën 5 karaktere.'),
    addressLine2: z.string().optional(),
    deliveryNotes: z.string().optional(),
    isDefault: z.boolean().optional(),
  }),
});

export const newsletterSchema = z.object({
  body: z.object({
    email: z.string().email('Adresa e emailit nuk është e vlefshme.'),
  }),
});
