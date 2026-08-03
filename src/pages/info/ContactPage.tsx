import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, MapPin, Instagram, Facebook, Youtube, Loader2, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const schema = z.object({
  name: z.string().min(2, 'Emri duhet të ketë të paktën 2 karaktere.'),
  email: z.string().email('Adresa e emailit nuk është e vlefshme.'),
  subject: z.string().min(3, 'Subjekti duhet të jetë të paktën 3 karaktere.'),
  message: z.string().min(20, 'Mesazhi duhet të ketë të paktën 20 karaktere.'),
});
type FormData = z.infer<typeof schema>;

function SectionReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => { document.title = 'Kontakt — Elita5 Store'; }, []);

  const onSubmit = async (_data: FormData) => {
    await new Promise(r => setTimeout(r, 1000));
    setSent(true);
    reset();
  };

  return (
    <main className="pt-[72px] min-h-screen">
      <div className="bg-[#0D0D0D] border-b border-white/[0.06] py-16 md:py-20">
        <div className="container-e5">
          <SectionReveal>
            <p className="section-label">Na Kontaktoni</p>
            <h1 className="font-display text-[clamp(3rem,8vw,6rem)] tracking-wider text-white leading-none mt-2">
              KONTAKT
            </h1>
          </SectionReveal>
        </div>
      </div>

      <div className="container-e5 py-16">
        <div className="grid lg:grid-cols-[1fr_420px] gap-16">
          {/* Form */}
          <SectionReveal>
            {sent ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6">
                  <CheckCircle size={28} className="text-green-500" />
                </div>
                <h2 className="font-display text-3xl text-white tracking-wider mb-3">FALEMINDERIT!</h2>
                <p className="text-white/40 text-sm max-w-sm">
                  Mesazhi juaj u dërgua me sukses. Do t'ju përgjigjemi brenda 24 orëve.
                </p>
                <button onClick={() => setSent(false)} className="btn-outline text-xs mt-8">
                  Dërgo Mesazh Tjetër
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <h2 className="font-display text-2xl text-white tracking-wider mb-6">DËRGONI MESAZH</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="c-name" className="block text-white/50 text-xs font-semibold tracking-widest uppercase mb-1.5">
                      Emri i Plotë <span className="text-[#B71C1C]">*</span>
                    </label>
                    <input
                      id="c-name"
                      className="input-e5 w-full"
                      placeholder="Artan Hoxha"
                      {...register('name')}
                    />
                    {errors.name && <p className="mt-1 text-[#E53935] text-xs">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="c-email" className="block text-white/50 text-xs font-semibold tracking-widest uppercase mb-1.5">
                      Email <span className="text-[#B71C1C]">*</span>
                    </label>
                    <input
                      id="c-email"
                      type="email"
                      className="input-e5 w-full"
                      placeholder="artan@example.com"
                      {...register('email')}
                    />
                    {errors.email && <p className="mt-1 text-[#E53935] text-xs">{errors.email.message}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="c-subject" className="block text-white/50 text-xs font-semibold tracking-widest uppercase mb-1.5">
                    Subjekti <span className="text-[#B71C1C]">*</span>
                  </label>
                  <input
                    id="c-subject"
                    className="input-e5 w-full"
                    placeholder="Pyetje rreth porosisë..."
                    {...register('subject')}
                  />
                  {errors.subject && <p className="mt-1 text-[#E53935] text-xs">{errors.subject.message}</p>}
                </div>
                <div>
                  <label htmlFor="c-message" className="block text-white/50 text-xs font-semibold tracking-widest uppercase mb-1.5">
                    Mesazhi <span className="text-[#B71C1C]">*</span>
                  </label>
                  <textarea
                    id="c-message"
                    rows={6}
                    className="input-e5 w-full resize-none"
                    placeholder="Shkruani mesazhin tuaj këtu..."
                    {...register('message')}
                  />
                  {errors.message && <p className="mt-1 text-[#E53935] text-xs">{errors.message.message}</p>}
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-primary text-xs">
                  {isSubmitting ? <><Loader2 size={13} className="animate-spin" /> Duke dërguar...</> : 'Dërgo Mesazhin'}
                </button>
              </form>
            )}
          </SectionReveal>

          {/* Contact Info */}
          <div className="space-y-8">
            <SectionReveal delay={0.1}>
              <h2 className="font-display text-2xl text-white tracking-wider mb-6">INFORMACIONI</h2>
              <div className="space-y-5">
                {[
                  {
                    icon: Mail,
                    label: 'Email',
                    value: 'info@elita5store.com',
                    href: 'mailto:info@elita5store.com',
                  },
                  {
                    icon: MapPin,
                    label: 'Adresa',
                    value: 'Rr. Nënë Tereza 12, Prishtinë 10000, Kosovë',
                    href: null,
                  },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon size={15} className="text-white/50" aria-hidden />
                      </div>
                      <div>
                        <p className="text-white/30 text-[10px] tracking-widest uppercase mb-1">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-white text-sm hover:text-[#E53935] transition-colors">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-white text-sm leading-relaxed">{item.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionReveal>

            <SectionReveal delay={0.2}>
              <div className="border-t border-white/[0.06] pt-8">
                <p className="text-white/30 text-[10px] tracking-widest uppercase mb-4">Rrjetet Sociale</p>
                <div className="flex gap-3">
                  {[
                    { icon: Instagram, href: 'https://instagram.com/elita5official', label: 'Instagram' },
                    { icon: Facebook, href: 'https://facebook.com/elita5official', label: 'Facebook' },
                    { icon: Youtube, href: 'https://youtube.com/@elita5official', label: 'YouTube' },
                  ].map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
                    >
                      <Icon size={15} />
                    </a>
                  ))}
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.3}>
              <div className="bg-[#161616] border border-white/[0.06] p-6">
                <p className="text-white/30 text-[10px] tracking-widest uppercase mb-3">Orari i Punës</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">E Hënë – E Premte</span>
                    <span className="text-white">09:00 – 17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">E Shtunë</span>
                    <span className="text-white">10:00 – 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">E Diel</span>
                    <span className="text-white/30">Mbyllur</span>
                  </div>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>
    </main>
  );
}
