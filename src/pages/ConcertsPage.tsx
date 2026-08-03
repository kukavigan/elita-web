import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MapPin, Clock, ExternalLink, Calendar } from 'lucide-react';
import { api } from '@/services/api';

const HERO = 'https://images.pexels.com/photos/1276542/pexels-photo-1276542.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';

export function ConcertsPage() {
  useEffect(() => { document.title = 'Koncertet 2025 — Elita5'; }, []);

  const { data: concerts, isLoading } = useQuery({
    queryKey: ['concerts'],
    queryFn: api.concerts.getAll,
  });

  const upcoming = concerts?.filter(c => !c.soldOut) ?? [];
  const soldOut  = concerts?.filter(c => c.soldOut)  ?? [];

  return (
    <main className="pt-[68px]">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[360px] overflow-hidden flex items-end">
        <img src={HERO} alt="Elita5 live concert" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--c-bg)] via-[var(--c-bg)]/50 to-transparent" aria-hidden />
        <div className="relative z-10 container-e5 pb-12">
          <span className="section-label mb-2">Shfaqjet Live</span>
          <h1 className="font-display text-[clamp(4rem,12vw,9rem)] leading-none text-[var(--c-text)] tracking-tight">
            KONCERTET<br /><span className="text-[var(--c-text-3)]">2025</span>
          </h1>
        </div>
      </div>

      <div className="container-e5 py-14">
        {/* Upcoming */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-2 h-2 bg-[var(--c-red)]" aria-hidden />
            <span className="label-upper text-[var(--c-text-2)]">Koncertet e Ardhshme</span>
            {!isLoading && <span className="font-mono text-[10px] text-[var(--c-text-3)]">({upcoming.length})</span>}
          </div>

          {isLoading ? (
            <div className="space-y-px">
              {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-[76px] skeleton" />)}
            </div>
          ) : upcoming.length === 0 ? (
            <div className="py-20 text-center border border-[var(--c-border)]">
              <Calendar size={32} className="text-[var(--c-text-3)] mx-auto mb-4" />
              <p className="font-display text-3xl text-[var(--c-text)] tracking-tight mb-2">ASNJË KONCERT</p>
              <p className="text-[var(--c-text-3)] text-sm">Koncertet e reja do të shpallen së shpejti.</p>
            </div>
          ) : (
            <div className="space-y-px">
              {upcoming.map((c, i) => {
                const d = new Date(c.date);
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-5 px-6 py-5 border border-[var(--c-border)] hover:border-[var(--c-border-hi)] hover:bg-[rgba(240,237,232,0.02)] transition-all"
                  >
                    <div className="flex items-center gap-6">
                      {/* Date block */}
                      <div className="flex-shrink-0 w-14 text-center">
                        <p className="font-display text-4xl text-[var(--c-text)] leading-none tabular-nums">{d.getDate()}</p>
                        <p className="font-mono text-[9px] tracking-[0.25em] text-[var(--c-text-3)] uppercase mt-0.5">
                          {d.toLocaleString('sq', { month: 'short' })} {d.getFullYear()}
                        </p>
                      </div>
                      <div className="w-px h-12 bg-[var(--c-border)] hidden sm:block" aria-hidden />
                      {/* Info */}
                      <div>
                        {c.featured && (
                          <span className="inline-block px-2 py-0.5 bg-[var(--c-red-dim)] border border-[var(--c-red)]/30 font-mono text-[8px] tracking-[0.2em] uppercase text-[var(--c-red-hi)] mb-1.5">
                            Kryesor
                          </span>
                        )}
                        <p className="text-[var(--c-text)] font-semibold">{c.city}, <span className="text-[var(--c-text-2)]">{c.country}</span></p>
                        <div className="flex flex-wrap gap-4 mt-0.5">
                          <span className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--c-text-3)]">
                            <MapPin size={10} aria-hidden /> {c.venue}
                          </span>
                          <span className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--c-text-3)]">
                            <Clock size={10} aria-hidden /> {c.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={c.ticketUrl ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline text-[10px] py-2.5 px-5 flex-shrink-0 inline-flex items-center gap-2"
                      aria-label={`Bli biletë — ${c.city}`}
                    >
                      <ExternalLink size={11} />
                      Bëj Biletë
                    </a>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sold out */}
        {soldOut.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-2 h-2 bg-[var(--c-text-3)]" aria-hidden />
              <span className="label-upper text-[var(--c-text-3)]">I Shitur</span>
            </div>
            <div className="space-y-px opacity-40">
              {soldOut.map(c => {
                const d = new Date(c.date);
                return (
                  <div key={c.id} className="flex items-center justify-between gap-5 px-6 py-5 border border-[var(--c-border)]">
                    <div className="flex items-center gap-6">
                      <div className="w-14 text-center">
                        <p className="font-display text-4xl text-[var(--c-text)] leading-none tabular-nums">{d.getDate()}</p>
                        <p className="font-mono text-[9px] tracking-widest text-[var(--c-text-3)] uppercase mt-0.5">
                          {d.toLocaleString('sq', { month: 'short' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[var(--c-text)] font-semibold">{c.city}, {c.country}</p>
                        <span className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--c-text-3)]">
                          <MapPin size={10} /> {c.venue}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--c-text-3)]">I Shitur</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
