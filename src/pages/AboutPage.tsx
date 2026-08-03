import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

const HERO   = 'https://images.pexels.com/photos/18004195/pexels-photo-18004195.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';
const IMG_A  = 'https://images.pexels.com/photos/18671362/pexels-photo-18671362.jpeg?auto=compress&cs=tinysrgb&h=800&w=700';
const IMG_B  = 'https://images.pexels.com/photos/736355/pexels-photo-736355.jpeg?auto=compress&cs=tinysrgb&h=800&w=700';

const MEMBERS = [
  { name: 'Gent Sejdiu',    role: 'Vokal' },
  { name: 'Mentor Haziri',  role: 'Kitarë' },
  { name: 'Enis Hajdini',   role: 'Bass' },
  { name: 'Florent Ukshini',role: 'Tastierë' },
  { name: 'Berat Jashari',  role: 'Bateri' },
];

const MILESTONES = [
  { year: '1993', text: 'Formimi i grupit në Prishtinë, Kosovë.' },
  { year: '1997', text: 'Albumi i parë — "Zemra e Gurit". Suksesi i menjëhershëm.' },
  { year: '2004', text: 'Turneu i parë ndërkombëtar në Europë dhe diasporën shqiptare.' },
  { year: '2014', text: '"Dashuri dhe Besnikëri" — albumi me 500,000 kopje të shitura.' },
  { year: '2019', text: '"Trashëgimia" — kthim triumfues pas 5 vitesh pushim krijues.' },
  { year: '2024', text: '"Hitet më të Mira" — koleksioni përfundimtar, remastered nga Abbey Road.' },
];

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AboutPage() {
  useEffect(() => { document.title = 'Historia — Elita5'; }, []);

  return (
    <main className="pt-[68px]">
      {/* Hero */}
      <div className="relative h-[65vh] min-h-[480px] overflow-hidden flex items-end">
        <img src={HERO} alt="Elita5 — koncert" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--c-bg)] via-[var(--c-bg)]/50 to-transparent" aria-hidden />
        <div className="relative z-10 container-e5 pb-14">
          <span className="section-label mb-2">Historia</span>
          <h1 className="font-display text-[clamp(4rem,13vw,10rem)] leading-none text-[var(--c-text)] tracking-tight">
            ELITA<span className="text-[var(--c-red)]">5</span>
          </h1>
        </div>
      </div>

      {/* Intro */}
      <div className="container-e5 py-16">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 mb-20">
          <Reveal>
            <span className="section-label mb-3">Origjina</span>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none text-[var(--c-text)] tracking-tight">
              1993 — PRISHTINË
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-4 text-[var(--c-text-2)] text-sm leading-relaxed mt-2">
              <p>Elita5 lindi në Prishtinë të viteve 1990-ta, duke u bërë shpejt ndër grupet rok më ikonike të Kosovës dhe botës shqiptare.</p>
              <p>Muzika e tyre flet për brezat — kombinon energjinë rok me lirika të thella shqipe. Pas mbi 30 vite karrierë, 12 albume dhe qindra koncerte, Elita5 vazhdon të tronditë skenat.</p>
              <p>Ky dyqan është vazhdimësi e asaj lidhjeje — mënyra juaj për të bartur trashëgiminë.</p>
            </div>
          </Reveal>
        </div>

        {/* Images */}
        <Reveal className="mb-20">
          <div className="grid grid-cols-2 gap-3 md:gap-4 max-h-[560px]">
            <div className="overflow-hidden">
              <img src={IMG_A} alt="Elita5 — performance" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" style={{ minHeight: 220 }} />
            </div>
            <div className="overflow-hidden mt-16">
              <img src={IMG_B} alt="Elita5 — show" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" style={{ minHeight: 220 }} />
            </div>
          </div>
        </Reveal>

        {/* Stats */}
        <Reveal className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-b border-[var(--c-border)] py-12">
            {[{ v: '1993', l: 'Themeluar' }, { v: '12', l: 'Albume' }, { v: '500K+', l: 'Fansat' }, { v: '30+', l: 'Vite Karriere' }].map(s => (
              <div key={s.l} className="text-center">
                <p className="font-display text-5xl md:text-6xl text-[var(--c-text)]">{s.v}</p>
                <p className="label-upper text-[var(--c-text-3)] mt-2">{s.l}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Timeline */}
        <Reveal className="mb-20">
          <span className="section-label mb-6">Kronologjia</span>
          <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-none text-[var(--c-text)] tracking-tight mb-10">
            HISTORIA
          </h2>
          <div className="space-y-0">
            {MILESTONES.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-6 md:gap-10 py-5 border-b border-[var(--c-border)] group"
              >
                <div className="flex-shrink-0 w-16">
                  <span className="font-display text-2xl text-[var(--c-red)] leading-none">{m.year}</span>
                </div>
                <p className="text-[var(--c-text-2)] text-sm leading-relaxed pt-1">{m.text}</p>
              </motion.div>
            ))}
          </div>
        </Reveal>

        {/* Members */}
        <Reveal className="mb-20">
          <span className="section-label mb-6">Grupi</span>
          <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-none text-[var(--c-text)] tracking-tight mb-8">ANËTARËT</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-px">
            {MEMBERS.map(m => (
              <div key={m.name} className="bg-[var(--c-bg-2)] border border-[var(--c-border)] p-6 text-center hover:border-[var(--c-border-hi)] transition-colors">
                <div className="w-12 h-12 rounded-full bg-[var(--c-surface)] mx-auto mb-3 flex items-center justify-center">
                  <span className="font-display text-xl text-[var(--c-text-3)]">{m.name.charAt(0)}</span>
                </div>
                <p className="text-[var(--c-text)] font-semibold text-sm">{m.name}</p>
                <p className="label-upper text-[var(--c-text-3)] mt-1">{m.role}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal>
          <div className="text-center border-t border-[var(--c-border)] pt-16">
            <span className="section-label mb-3 inline-block">Bashkohuni</span>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none text-[var(--c-text)] tracking-tight">
              JINI PJESË E<br /><span className="text-[var(--c-red)]">HISTORISË</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Link to={ROUTES.SHOP} className="btn-primary text-[11px]">Shiko Koleksionin <ArrowRight size={13} /></Link>
              <Link to={ROUTES.CONCERTS} className="btn-outline text-[11px]">Shiko Koncertet</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
