import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { newsletterApi } from '@/services/api';
import { newsletterSchema } from '@/schemas/checkout';
import { z } from 'zod';
import { ApiError } from '@/lib/apiClient';

type FormData = z.infer<typeof newsletterSchema>;

interface Props { compact?: boolean }

export function NewsletterForm({ compact = false }: Props) {
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(newsletterSchema) });

  const onSubmit = async ({ email }: FormData) => {
    try {
      await newsletterApi.subscribe(email);
      setSuccess(true);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Gabim gjatë abonimit. Provoni përsëri.';
      setError('email', { message: msg });
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
        <p className="text-white/70 text-sm">Faleminderit! Jeni abonuar me sukses.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex gap-2">
        <div className="flex-1">
          <label htmlFor="newsletter-email" className="sr-only">Adresa e emailit</label>
          <input
            id="newsletter-email"
            type="email"
            autoComplete="email"
            className="input-e5 w-full"
            placeholder={compact ? 'Email juaj' : 'adresa@juaj.com'}
            {...register('email')}
            aria-describedby={errors.email ? 'nl-error' : undefined}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-shrink-0 w-12 h-[46px] flex items-center justify-center bg-[#B71C1C] text-white hover:bg-[#E53935] transition-colors disabled:opacity-50"
          aria-label="Abonohu"
        >
          {isSubmitting
            ? <Loader2 size={14} className="animate-spin" />
            : <ArrowRight size={14} />}
        </button>
      </div>
      <AnimatePresence>
        {errors.email && (
          <motion.p
            id="nl-error"
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-[#E53935] text-xs"
          >
            {errors.email.message}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
