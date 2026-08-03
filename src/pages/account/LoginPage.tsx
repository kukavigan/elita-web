import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/routes';
import { ApiError } from '@/lib/apiClient';

const schema = z.object({
  email: z.string().email('Adresa e emailit nuk është e vlefshme.'),
  password: z.string().min(1, 'Fjalëkalimi është i detyrueshëm.'),
});
type FormData = z.infer<typeof schema>;

const HERO = 'https://images.pexels.com/photos/894557/pexels-photo-894557.jpeg?auto=compress&cs=tinysrgb&h=1200&w=900';

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const [showPw, setShowPw] = useState(false);

  const from = (location.state as { from?: string })?.from ?? ROUTES.ACCOUNT;

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
    document.title = 'Kyçu — Elita5 Store';
  }, [isAuthenticated, navigate, from]);

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ email, password }: FormData) => {
    try {
      await login(email, password);
    } catch (err) {
      setError('root', { message: err instanceof ApiError ? err.message : 'Email ose fjalëkalim i gabuar.' });
    }
  };

  return (
    <main className="min-h-screen flex">
      {/* Left: image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img src={HERO} alt="Elita5 — performance" className="w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--c-bg)]/30" aria-hidden />
        <div className="absolute bottom-12 left-10 right-10">
          <blockquote className="font-display text-4xl text-white leading-tight">"MUZIKA NUK VDES — AJO TRANSFORMOHET."</blockquote>
          <cite className="font-mono text-[10px] tracking-[0.3em] text-white/50 uppercase mt-3 block not-italic">— Elita5, 1993</cite>
        </div>
      </div>

      {/* Right: form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16 bg-[var(--c-bg)]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[400px]"
        >
          <Link to={ROUTES.HOME} className="inline-block mb-10" aria-label="Kthehu në ballina">
            <span className="font-display text-3xl leading-none text-[var(--c-text)] tracking-tight">ELITA<span className="text-[var(--c-red)]">5</span></span>
          </Link>

          <h1 className="font-display text-5xl leading-none text-[var(--c-text)] tracking-tight mb-2">KYÇU</h1>
          <p className="text-[var(--c-text-3)] text-sm mb-8">Hyr në llogarinë tënde Elita5.</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div>
              <label htmlFor="email" className="label-upper text-[var(--c-text-3)] mb-1.5 block">Email *</label>
              <input id="email" type="email" autoComplete="email" className="input-e5" placeholder="artan@example.com" {...register('email')} />
              {errors.email && <p className="mt-1.5 font-mono text-[10px] text-[var(--c-red-hi)]">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="label-upper text-[var(--c-text-3)] mb-1.5 block">Fjalëkalimi *</label>
              <div className="relative">
                <input id="password" type={showPw ? 'text' : 'password'} autoComplete="current-password" className="input-e5 pr-10" placeholder="••••••••" {...register('password')} />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors" aria-label={showPw ? 'Fshih fjalëkalimin' : 'Shfaq fjalëkalimin'}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 font-mono text-[10px] text-[var(--c-red-hi)]">{errors.password.message}</p>}
            </div>

            <div className="flex justify-end">
              <Link to={ROUTES.FORGOT_PASSWORD} className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors">
                Keni harruar fjalëkalimin?
              </Link>
            </div>

            {errors.root && (
              <div role="alert" className="p-3.5 border border-[var(--c-red)]/30 bg-[var(--c-red-dim)] font-mono text-[10px] tracking-wide text-[var(--c-red-hi)]">
                {errors.root.message}
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center mt-2">
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <><span>Kyçu</span> <ArrowRight size={13} /></>}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-[var(--c-bg-3)] border border-[var(--c-border)]">
            <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-[var(--c-text-3)] mb-2">Kredenciale Demo</p>
            <p className="font-mono text-[10px] text-[var(--c-text-2)]">fan@elita5.com / elita5fan</p>
            <p className="font-mono text-[10px] text-[var(--c-text-2)]">admin@elita5.com / Admin@Elita5#2025</p>
          </div>

          <p className="font-mono text-[11px] tracking-wide text-[var(--c-text-3)] text-center mt-8">
            Nuk keni llogari?{' '}
            <Link to={ROUTES.REGISTER} className="text-[var(--c-text)] hover:text-[var(--c-red-hi)] transition-colors font-semibold">Regjistrohu</Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
