import { z } from 'zod';

export const addressSchema = z.object({
  firstName: z.string().min(2, 'Emri duhet të ketë të paktën 2 karaktere.'),
  lastName: z.string().min(2, 'Mbiemri duhet të ketë të paktën 2 karaktere.'),
  email: z.string().email('Adresa e emailit nuk është e vlefshme.'),
  phone: z.string().min(6, 'Numri i telefonit nuk është i vlefshëm.'),
  country: z.string().min(1, 'Ju lutemi zgjidhni shtetin.'),
  city: z.string().min(2, 'Qyteti duhet të ketë të paktën 2 karaktere.'),
  postalCode: z.string().min(4, 'Kodi postar duhet të ketë të paktën 4 karaktere.'),
  address: z.string().min(5, 'Adresa duhet të ketë të paktën 5 karaktere.'),
  apartment: z.string().optional(),
});

export type AddressFormData = z.infer<typeof addressSchema>;

export const loginSchema = z.object({
  email: z.string().email('Adresa e emailit nuk është e vlefshme.'),
  password: z.string().min(6, 'Fjalëkalimi duhet të ketë të paktën 6 karaktere.'),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, 'Emri duhet të ketë të paktën 2 karaktere.'),
  lastName: z.string().min(2, 'Mbiemri duhet të ketë të paktën 2 karaktere.'),
  email: z.string().email('Adresa e emailit nuk është e vlefshme.'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Fjalëkalimi duhet të ketë të paktën 8 karaktere.'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Fjalëkalimet nuk përputhen.',
  path: ['confirmPassword'],
});

export const newsletterSchema = z.object({
  email: z.string().email('Adresa e emailit nuk është e vlefshme.'),
});
