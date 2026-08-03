import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Music2, Youtube, ShoppingBag, Disc3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';

const COVER = 'https://images.pexels.com/photos/12858793/pexels-photo-12858793.jpeg?auto=compress&cs=tinysrgb&h=600&w=600';

export function AlbumSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-pad" aria-labelledby="album-sec-heading">
      <div className="container-e5">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Vinyl */}
          <div className="relative flex items-center justify-center py-8">
            <div className="relative w-52 h-52 md:w-64 md:h-64 mx-auto">
              <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(177,25,34,0.12) 0%, transparent 70%)', filter: 'blur(28px)' }} aria-hidden />
              <motion.div
                className="w-full h-full rounded-full bg-[#111] border border-white/[0.06] overflow-hidden relative"
                animate={inView ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                aria-hidden
              >
                <div className="absolute inset-0 rounded-full" style={{ background: 'repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 4px, rgba(255,255,255,0.012) 4px, rgba(255,255,255,0.012) 5px)' }} />
                <div className="absolute inset-[42%] rounded-full bg-[var(--c-bg)] border border-white/[0.06] flex items-center justify-center">
                  <Disc3 size={10} className="text-[var(--c-text-3)]" />
                </div>
              </motion.div>
              <div className="absolute inset-[14%] rounded-full overflow-hidden ring-1 ring-white/10">
                <img src={COVER} alt="Elita5 — Hitet më të Mira" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="section-label mb-3">Albumi i Fundit</span>
            <h2 id="album-sec-heading" className="font-display text-[clamp(3rem,7vw,6rem)] leading-none text-[var(--c-text)] tracking-tight">
              HITET MË<br /><span className="text-[var(--c-red)]">TË MIRA</span>
            </h2>

            <div className="flex items-stretch gap-0 mt-6 border-t border-b border-[var(--c-border)] py-4">
              {[{ v: '2024', l: 'Viti' }, { v: '22', l: 'Këngë' }, { v: '2LP', l: 'Formati' }].map((s, i) => (
                <div key={s.l} className={`px-6 ${i > 0 ? 'border-l border-[var(--c-border)]' : 'pl-0'}`}>
                  <p className="font-display text-2xl text-[var(--c-text)]">{s.v}</p>
                  <p className="label-upper text-[var(--c-text-3)] mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>

            <p className="text-[var(--c-text-2)] text-sm leading-relaxed mt-5 max-w-sm">
              22 hite ikonike remastered nga Abbey Road Studios. Mastering analog për vinyl 180g.
            </p>

            <div className="flex flex-wrap gap-3 mt-7">
              <a href="https://open.spotify.com/artist/elita5" target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1DB954] text-black font-mono text-[9px] tracking-[0.2em] uppercase font-semibold hover:bg-[#1ed760] transition-colors">
                <Music2 size={13} /> Spotify
              </a>
              <a href="https://youtube.com/@elita5official" target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF0000] text-white font-mono text-[9px] tracking-[0.2em] uppercase font-semibold hover:bg-red-600 transition-colors">
                <Youtube size={13} /> YouTube
              </a>
              <Link to={ROUTES.PRODUCT('vinyl-hitet-me-te-mira')} className="btn-outline text-[11px]">
                <ShoppingBag size={13} /> Vinyl
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
