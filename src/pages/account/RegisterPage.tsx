import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/routes';
import { ApiError } from '@/lib/apiClient';

const schema = z.object({
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
type FormData = z.infer<typeof schema>;

export function RegisterPage() {
  const { register: authRegister, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate(ROUTES.ACCOUNT);
    document.title = 'Regjistrohu — Elita5 Store';
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await authRegister({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
      });
      navigate(ROUTES.ACCOUNT);
    } catch (err) {
      setError('root', {
        message: err instanceof ApiError ? err.message : 'Gabim gjatë regjistrimit.',
      });
    }
  };

  return (
    <main className="pt-[72px] min-h-screen flex items-center justify-center px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="w-full max-w-[460px]"
      >
        <div className="text-center mb-10">
          <Link to={ROUTES.HOME} className="inline-block" aria-label="Kthehu në faqen kryesore">
            <span className="font-display text-4xl text-white tracking-wider">ELITA<span className="text-[#B71C1C]">5</span></span>
          </Link>
          <h1 className="font-display text-3xl text-white tracking-wider mt-5">REGJISTROHU</h1>
          <p className="text-white/35 text-sm mt-2">Krijoni llogarinë tuaj falas.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-white/50 text-[10px] font-semibold tracking-[0.2em] uppercase mb-2">Emri *</label>
              <input id="firstName" className="input-e5 w-full" placeholder="Artan" {...register('firstName')} />
              {errors.firstName && <p className="mt-1.5 text-[#E53935] text-xs">{errors.firstName.message}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-white/50 text-[10px] font-semibold tracking-[0.2em] uppercase mb-2">Mbiemri *</label>
              <input id="lastName" className="input-e5 w-full" placeholder="Hoxha" {...register('lastName')} />
              {errors.lastName && <p className="mt-1.5 text-[#E53935] text-xs">{errors.lastName.message}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-white/50 text-[10px] font-semibold tracking-[0.2em] uppercase mb-2">Email *</label>
            <input id="email" type="email" autoComplete="email" className="input-e5 w-full" placeholder="artan@example.com" {...register('email')} />
            {errors.email && <p className="mt-1.5 text-[#E53935] text-xs">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-white/50 text-[10px] font-semibold tracking-[0.2em] uppercase mb-2">Telefoni (opsional)</label>
            <input id="phone" type="tel" className="input-e5 w-full" placeholder="+383 44 000 000" {...register('phone')} />
          </div>
          <div>
            <label htmlFor="password" className="block text-white/50 text-[10px] font-semibold tracking-[0.2em] uppercase mb-2">Fjalëkalimi *</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="input-e5 w-full pr-10"
                placeholder="Të paktën 8 karaktere"
                {...register('password')}
              />
              <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-[#E53935] text-xs">{errors.password.message}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-white/50 text-[10px] font-semibold tracking-[0.2em] uppercase mb-2">Konfirmo Fjalëkalimin *</label>
            <input id="confirmPassword" type="password" autoComplete="new-password" className="input-e5 w-full" {...register('confirmPassword')} />
            {errors.confirmPassword && <p className="mt-1.5 text-[#E53935] text-xs">{errors.confirmPassword.message}</p>}
          </div>

          {errors.root && (
            <div role="alert" className="p-3.5 bg-[#B71C1C]/10 border border-[#B71C1C]/25 text-[#E53935] text-sm">
              {errors.root.message}
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center mt-2">
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <>Krijo Llogarinë <ArrowRight size={13} /></>}
          </button>
        </form>

        <p className="text-center text-white/30 text-sm mt-7">
          Keni llogari?{' '}
          <Link to={ROUTES.LOGIN} className="text-white hover:text-white/70 transition-colors font-semibold">Kyçuni</Link>
        </p>
      </motion.div>
    </main>
  );
}
