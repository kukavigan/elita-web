import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, ChevronDown, MapPin, Clock, Music2, Youtube } from 'lucide-react';
import { api } from '@/services/api';
import { ROUTES } from '@/lib/routes';
import { ProductCard } from '@/components/shared/ProductCard';
import { ProductCardSkeleton } from '@/components/shared/ProductCardSkeleton';
import { NewsletterForm } from '@/components/shared/NewsletterForm';
import { CountdownTimer } from './components/CountdownTimer';

const HERO_IMG    = 'https://images.pexels.com/photos/894557/pexels-photo-894557.jpeg?auto=compress&cs=tinysrgb&h=1080&w=1920';
const CONCERT_IMG = 'https://images.pexels.com/photos/1276542/pexels-photo-1276542.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';
const COL_IMG_A   = 'https://images.pexels.com/photos/15067553/pexels-photo-15067553.jpeg?auto=compress&cs=tinysrgb&h=900&w=700';
const COL_IMG_B   = 'https://images.pexels.com/photos/9853880/pexels-photo-9853880.jpeg?auto=compress&cs=tinysrgb&h=600&w=600';
const STORY_IMG   = 'https://images.pexels.com/photos/632305/pexels-photo-632305.jpeg?auto=compress&cs=tinysrgb&h=1200&w=900';
const IG_IMGS     = [
  'https://images.pexels.com/photos/736355/pexels-photo-736355.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
  'https://images.pexels.com/photos/18735733/pexels-photo-18735733.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
  'https://images.pexels.com/photos/3122799/pexels-photo-3122799.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
  'https://images.pexels.com/photos/894557/pexels-photo-894557.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
  'https://images.pexels.com/photos/1276542/pexels-photo-1276542.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
  'https://images.pexels.com/photos/20993079/pexels-photo-20993079.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
];

const MARQUEE_TEXT = ['ELITA5', '★', 'MUZIKË', '★', 'PRISHTINË', '★', 'TRASHËGIMI', '★', 'ROCK', '★', 'KOSOVË', '★'];

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.72, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroScale   = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const heroY       = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

  const { data: featured, isLoading: loadingFeatured } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: api.products.getFeatured,
  });
  const { data: concerts, isLoading: loadingConcerts } = useQuery({
    queryKey: ['concerts', 'upcoming'],
    queryFn: () => api.concerts.getUpcoming(6),
  });
  const { data: limited } = useQuery({
    queryKey: ['products', 'limited'],
    queryFn: api.products.getLimited,
  });

  const limitedTarget = new Date();
  limitedTarget.setDate(limitedTarget.getDate() + 3);
  limitedTarget.setHours(23, 59, 59, 0);

  return (
    <main>
      {/* ━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        ref={heroRef}
        className="relative h-[100svh] min-h-[600px] overflow-hidden flex items-end"
        aria-label="Elita5 — Dyqani Zyrtar"
      >
        {/* Parallax image */}
        <motion.div className="absolute inset-0 will-change-transform" style={{ scale: heroScale, y: heroY }}>
          <img src={HERO_IMG} alt="" aria-hidden className="w-full h-full object-cover" loading="eager" />
        </motion.div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/55 to-[#080808]/10 pointer-events-none" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/60 via-transparent to-transparent pointer-events-none" aria-hidden />

        {/* Content */}
        <motion.div
          className="relative z-10 container-e5 pb-20 md:pb-28 w-full"
          style={{ opacity: heroOpacity }}
        >
          {/* City label */}
          <motion.div
            className="flex items-center gap-3 mb-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25 }}
          >
            <div className="w-6 h-px bg-[var(--c-red)]" aria-hidden />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--c-text-2)]">
              Prishtinë — Kosovë — Est. 1993
            </span>
          </motion.div>

          {/* Main heading */}
          <div className="overflow-hidden">
            <motion.h1
              className="font-display text-[clamp(4rem,14vw,11rem)] leading-[0.88] text-[var(--c-text)] tracking-tight"
              initial={{ y: '105%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              OFFICIAL<br />
              ELITA<span className="text-[var(--c-red)]">5</span>
            </motion.h1>
          </div>

          <motion.p
            className="text-[var(--c-text-2)] text-sm md:text-base tracking-[0.16em] uppercase mt-5 max-w-xs"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
          >
            Mbështete muzikën. Vish trashëgiminë.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-3 mt-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <Link to={ROUTES.SHOP} className="btn-primary text-[11px]">
              Bli Koleksionin
              <ArrowRight size={13} />
            </Link>
            <Link to={ROUTES.ABOUT} className="btn-outline text-[11px]">
              Zbulo Historinë
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-7 right-8 z-10 hidden md:flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          aria-hidden
        >
          <span className="font-mono text-[8px] tracking-[0.35em] text-[var(--c-text-3)] uppercase" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
          <motion.div
            className="w-px h-10 bg-gradient-to-b from-transparent to-[var(--c-text-3)]"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </section>

      {/* ━━ MARQUEE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        className="border-y border-[var(--c-border)] bg-[var(--c-bg-2)] py-3.5 overflow-hidden cursor-default select-none"
        aria-hidden
      >
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="flex items-center gap-7 mr-7">
              {MARQUEE_TEXT.map((t, j) => (
                <span
                  key={j}
                  className={`font-display text-base leading-none tracking-tight ${
                    t === '★' ? 'text-[var(--c-red)] text-xs' : 'text-[var(--c-text-3)]'
                  }`}
                >
                  {t}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ━━ FEATURED PRODUCTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="section-pad" aria-labelledby="h-featured">
        <div className="container-e5">
          <Reveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="section-label mb-2">Zgjedhja Jonë</span>
                <h2 id="h-featured" className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none text-[var(--c-text)] tracking-tight">
                  PRODUKTET<br />
                  <span className="text-[var(--c-text-3)]">E ZGJEDHURA</span>
                </h2>
              </div>
              <Link to={ROUTES.SHOP} className="hidden md:flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors group">
                Shiko të Gjitha
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
            {loadingFeatured
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : featured?.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.4) }}
                  >
                    <ProductCard product={p} priority={i < 2} />
                  </motion.div>
                ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link to={ROUTES.SHOP} className="btn-outline text-[11px] inline-flex">Shiko të Gjitha <ArrowRight size={13} /></Link>
          </div>
        </div>
      </section>

      {/* ━━ EDITORIAL CAMPAIGN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section aria-label="Koleksioni i Ri" className="bg-[var(--c-bg-2)]">
        <div className="grid md:grid-cols-[55fr_45fr] min-h-[70vh]">
          {/* Images composition */}
          <div className="relative overflow-hidden min-h-[55vw] md:min-h-auto">
            <motion.img
              src={COL_IMG_A}
              alt="Koleksioni Elita5 2025"
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ scale: 1 }}
              whileInView={{ scale: 1.04 }}
              viewport={{ once: false }}
              transition={{ duration: 2, ease: 'easeOut' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--c-bg-2)] md:bg-gradient-to-r md:from-transparent md:to-[var(--c-bg-2)]" aria-hidden />

            {/* Floating badge */}
            <div className="absolute top-6 left-6">
              <span className="px-3 py-1.5 bg-[var(--c-red)] font-mono text-[9px] tracking-[0.25em] uppercase text-white">
                Koleksion i Ri
              </span>
            </div>

            {/* Thumbnail */}
            <div className="absolute bottom-8 right-8 w-28 h-36 overflow-hidden border border-[var(--c-border-hi)] hidden md:block">
              <img src={COL_IMG_B} alt="" aria-hidden className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Text side */}
          <Reveal delay={0.1} className="flex flex-col justify-center px-8 md:px-12 lg:px-16 py-16 md:py-20">
            <span className="section-label mb-4">Koleksioni Kryesor 2025</span>
            <h2 className="font-display text-[clamp(3rem,6vw,5.5rem)] leading-none text-[var(--c-text)] tracking-tight">
              TRASHËGIMIA<br />
              <span className="text-[var(--c-red)]">JETË</span>
            </h2>
            <p className="text-[var(--c-text-2)] text-sm leading-relaxed mt-6 max-w-xs">
              Ku muzika takohet me modën. Çdo copë është projektuar si dëshmi e trashëgimisë rok shqiptare — e rezistueshme ndaj kohës.
            </p>
            <div className="flex items-center gap-6 mt-8 pt-8 border-t border-[var(--c-border)]">
              <div>
                <p className="font-display text-3xl text-[var(--c-text)]">500</p>
                <p className="label-upper text-[var(--c-text-3)] mt-0.5">Copë të Kufizuara</p>
              </div>
              <div className="w-px h-12 bg-[var(--c-border)]" aria-hidden />
              <div>
                <p className="font-display text-3xl text-[var(--c-text)]">2025</p>
                <p className="label-upper text-[var(--c-text-3)] mt-0.5">Koleksioni</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to={ROUTES.SHOP} className="btn-primary text-[11px]">
                Shiko Koleksionin <ArrowRight size={13} />
              </Link>
              <Link to={ROUTES.ABOUT} className="btn-outline text-[11px]">Historia</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━ CATEGORIES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="section-pad" aria-labelledby="h-categories">
        <div className="container-e5">
          <Reveal>
            <div className="mb-12">
              <span className="section-label mb-2">Shfleto</span>
              <h2 id="h-categories" className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none text-[var(--c-text)] tracking-tight">
                KATEGORITË
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
            {[
              { name: 'Bluza',              href: `${ROUTES.SHOP}?category=tshirts`,    img: 'https://images.pexels.com/photos/13794572/pexels-photo-13794572.jpeg?auto=compress&cs=tinysrgb&h=700&w=600', tall: true },
              { name: 'Kapuçe',             href: `${ROUTES.SHOP}?category=hoodies`,    img: 'https://images.pexels.com/photos/14241847/pexels-photo-14241847.jpeg?auto=compress&cs=tinysrgb&h=500&w=500', tall: false },
              { name: 'Vinyl',              href: `${ROUTES.SHOP}?category=vinyl`,      img: 'https://images.pexels.com/photos/12858793/pexels-photo-12858793.jpeg?auto=compress&cs=tinysrgb&h=500&w=500', tall: false },
              { name: 'Aksesore',           href: `${ROUTES.SHOP}?category=accessories`,img: 'https://images.pexels.com/photos/10457904/pexels-photo-10457904.jpeg?auto=compress&cs=tinysrgb&h=500&w=500', tall: false },
              { name: 'Edicion i Kufizuar', href: `${ROUTES.SHOP}?badge=limited`,       img: 'https://images.pexels.com/photos/9853880/pexels-photo-9853880.jpeg?auto=compress&cs=tinysrgb&h=500&w=500',  tall: false },
            ].map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={cat.tall ? 'row-span-2 col-span-2 md:col-span-1 lg:col-span-1' : ''}
              >
                <Link
                  to={cat.href}
                  className={`group relative block overflow-hidden bg-[var(--c-bg-3)] ${cat.tall ? 'h-full min-h-[320px]' : 'aspect-square'}`}
                >
                  <img
                    src={cat.img}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" aria-hidden />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="font-display text-lg md:text-xl leading-none text-white tracking-tight">{cat.name.toUpperCase()}</h3>
                    <div className="flex items-center gap-1 mt-1.5">
                      <span className="font-mono text-[9px] tracking-[0.2em] text-white/50 uppercase group-hover:text-white/80 transition-colors">Shiko</span>
                      <ArrowRight size={9} className="text-white/50 group-hover:text-white/80 group-hover:translate-x-0.5 transition-all" aria-hidden />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━ ALBUM / MUSIC ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="section-pad bg-[var(--c-bg-2)] border-y border-[var(--c-border)]" aria-labelledby="h-album">
        <div className="container-e5">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Vinyl animation */}
            <Reveal className="relative flex items-center justify-center py-8">
              <div className="relative w-56 h-56 md:w-72 md:h-72 mx-auto">
                <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(177,25,34,0.12) 0%, transparent 70%)', filter: 'blur(32px)' }} aria-hidden />
                <motion.div
                  className="w-full h-full rounded-full bg-[#111] border border-white/[0.06] overflow-hidden relative"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                  aria-hidden
                >
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 4px, rgba(255,255,255,0.012) 4px, rgba(255,255,255,0.012) 5px)' }}
                  />
                  <div className="absolute inset-[40%] rounded-full bg-[#0a0a0a] border border-white/[0.06]" />
                </motion.div>
                <div className="absolute inset-[15%] rounded-full overflow-hidden ring-1 ring-white/10" aria-hidden>
                  <img src="https://images.pexels.com/photos/12858793/pexels-photo-12858793.jpeg?auto=compress&cs=tinysrgb&h=400&w=400" alt="" className="w-full h-full object-cover" />
                </div>
              </div>
            </Reveal>

            {/* Info */}
            <Reveal delay={0.15}>
              <span className="section-label mb-3">Albumi i Fundit</span>
              <h2 id="h-album" className="font-display text-[clamp(3rem,7vw,6rem)] leading-none text-[var(--c-text)] tracking-tight">
                HITET MË<br /><span className="text-[var(--c-red)]">TË MIRA</span>
              </h2>
              <div className="flex items-center gap-5 mt-5 border-t border-b border-[var(--c-border)] py-4">
                {[{ v: '2024', l: 'Viti' }, { v: '22', l: 'Këngë' }, { v: '2LP', l: 'Formati' }].map((s, i) => (
                  <div key={s.l} className={`flex items-center gap-5 ${i > 0 ? 'border-l border-[var(--c-border)] pl-5' : ''}`}>
                    <div>
                      <p className="font-display text-2xl text-[var(--c-text)]">{s.v}</p>
                      <p className="label-upper text-[var(--c-text-3)] mt-0.5">{s.l}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[var(--c-text-2)] text-sm leading-relaxed mt-5 max-w-sm">
                22 hite ikonike remastered nga Abbey Road Studios. E disponueshme si vinyl 180g dhe CD.
              </p>
              <div className="flex flex-wrap gap-3 mt-7">
                <a href="https://open.spotify.com/artist/elita5" target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1DB954] text-black font-mono text-[9px] tracking-[0.18em] uppercase font-semibold hover:bg-[#1ed760] transition-colors">
                  <Music2 size={13} /> Spotify
                </a>
                <a href="https://youtube.com/@elita5official" target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF0000] text-white font-mono text-[9px] tracking-[0.18em] uppercase font-semibold hover:bg-red-600 transition-colors">
                  <Youtube size={13} /> YouTube
                </a>
                <Link to={ROUTES.PRODUCT('vinyl-hitet-me-te-mira')} className="btn-outline text-[11px]">
                  Bli Vinyl
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ━━ BAND STORY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="section-pad" aria-labelledby="h-story">
        <div className="container-e5">
          <div className="grid md:grid-cols-[40fr_60fr] gap-12 md:gap-20 items-center">
            <Reveal className="relative">
              <div className="aspect-[3/4] overflow-hidden max-w-sm md:max-w-none">
                <img src={STORY_IMG} alt="Elita5 — performance live" loading="lazy" className="w-full h-full object-cover" />
              </div>
              <blockquote className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                <p className="font-display text-xl text-white leading-tight">"MUZIKA NUK VDES — AJO TRANSFORMOHET."</p>
                <cite className="font-mono text-[9px] tracking-[0.25em] text-white/40 uppercase mt-2 block not-italic">— Elita5</cite>
              </blockquote>
            </Reveal>

            <div>
              <Reveal>
                <span className="section-label mb-2">Historia Jonë</span>
                <h2 id="h-story" className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none text-[var(--c-text)] tracking-tight">
                  LEGJENDAT<br /><span className="text-[var(--c-text-3)]">NUK HARROHEN</span>
                </h2>
              </Reveal>
              <Reveal delay={0.1} className="mt-6 space-y-3 text-[var(--c-text-2)] text-sm leading-relaxed">
                <p>Elita5 lindi në Prishtinë të viteve 1990-ta. Muzika e tyre u bë zëri i brezit — i gëzimit dhe dhimbjes, i rezistencës dhe dashurisë.</p>
                <p>Sot, pas mbi 30 vitesh karrierë, vazhdon të tronditë skenat nga Prishtina deri në Zürich, nga Tirana deri në Berlin.</p>
              </Reveal>
              <Reveal delay={0.2} className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-[var(--c-border)]">
                {[{ v: '30+', l: 'Vite Karriere' }, { v: '12', l: 'Albume' }, { v: '500K+', l: 'Fansat' }].map(s => (
                  <div key={s.l}>
                    <p className="font-display text-4xl text-[var(--c-text)]">{s.v}</p>
                    <p className="label-upper text-[var(--c-text-3)] mt-1">{s.l}</p>
                  </div>
                ))}
              </Reveal>
              <Reveal delay={0.25} className="mt-8">
                <Link to={ROUTES.ABOUT} className="btn-outline text-[11px] inline-flex">
                  Historia e Plotë <ArrowRight size={13} />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ━━ CONCERTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative overflow-hidden" aria-labelledby="h-concerts">
        <div className="absolute inset-0" aria-hidden>
          <img src={CONCERT_IMG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[var(--c-bg)]/90" />
        </div>
        <div className="relative z-10 section-pad">
          <div className="container-e5">
            <Reveal>
              <div className="flex items-end justify-between mb-12">
                <div>
                  <span className="section-label mb-2">Shfaqjet Live</span>
                  <h2 id="h-concerts" className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none text-[var(--c-text)] tracking-tight">
                    KONCERTET<br /><span className="text-[var(--c-text-3)]">2025</span>
                  </h2>
                </div>
                <Link to={ROUTES.CONCERTS} className="hidden md:flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors group">
                  Të Gjitha <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </Reveal>

            <div className="space-y-px">
              {loadingConcerts
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-[72px] skeleton" />
                  ))
                : concerts?.map((c, i) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-5 border border-[var(--c-border)] hover:border-[var(--c-border-hi)] hover:bg-[rgba(240,237,232,0.025)] transition-all ${c.soldOut ? 'opacity-40' : ''}`}
                    >
                      <div className="flex items-center gap-5">
                        <div className="text-center w-12 flex-shrink-0">
                          <p className="font-display text-3xl text-[var(--c-text)] leading-none">
                            {new Date(c.date).getDate()}
                          </p>
                          <p className="font-mono text-[9px] tracking-widest text-[var(--c-text-3)] uppercase mt-0.5">
                            {new Date(c.date).toLocaleString('sq', { month: 'short' })}
                          </p>
                        </div>
                        <div className="w-px h-10 bg-[var(--c-border)]" aria-hidden />
                        <div>
                          <p className="text-[var(--c-text)] font-semibold text-sm">{c.city}, {c.country}</p>
                          <div className="flex flex-wrap gap-3 mt-0.5">
                            <span className="flex items-center gap-1 font-mono text-[10px] text-[var(--c-text-3)]">
                              <MapPin size={9} aria-hidden /> {c.venue}
                            </span>
                            <span className="flex items-center gap-1 font-mono text-[10px] text-[var(--c-text-3)]">
                              <Clock size={9} aria-hidden /> {c.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {c.featured && !c.soldOut && (
                          <span className="px-2.5 py-1 bg-[var(--c-red-dim)] border border-[var(--c-red)]/30 font-mono text-[8px] tracking-[0.25em] uppercase text-[var(--c-red-hi)]">
                            Kryesor
                          </span>
                        )}
                        {c.soldOut
                          ? <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--c-text-3)]">I Shitur</span>
                          : (
                            <a href={c.ticketUrl ?? '#'} target="_blank" rel="noopener noreferrer"
                               className="btn-outline text-[10px] py-2 px-4" aria-label={`Bli biletë — ${c.city}`}>
                              Bëj Biletë <ArrowRight size={10} />
                            </a>
                          )}
                      </div>
                    </motion.div>
                  ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━ LIMITED EDITION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="section-pad bg-[var(--c-bg-2)]" aria-labelledby="h-limited">
        <div className="container-e5">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <span className="label-red mb-2 block">Edicion Ekskluziv</span>
                <h2 id="h-limited" className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none text-[var(--c-text)] tracking-tight">
                  I KUFIZUAR<br /><span className="text-[var(--c-text-3)]">KOLEKSIONUES</span>
                </h2>
              </div>
              <div className="flex-shrink-0">
                <p className="label-upper text-[var(--c-text-3)] mb-2">Skadon pas</p>
                <CountdownTimer targetDate={limitedTarget} />
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
            {limited?.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to={`${ROUTES.SHOP}?badge=limited`} className="btn-accent text-[11px] inline-flex">
              Shiko Koleksionin e Kufizuar <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ━━ INSTAGRAM GRID ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section aria-labelledby="h-ig">
        <div className="container-e5 py-14">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="section-label mb-2">Rrjetet Sociale</span>
                <h2 id="h-ig" className="font-display text-[clamp(2rem,5vw,4rem)] leading-none text-[var(--c-text)] tracking-tight">
                  @ELITA5OFFICIAL
                </h2>
              </div>
              <a href="https://instagram.com/elita5official" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors group">
                Ndiq në Instagram <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </Reveal>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-px">
          {IG_IMGS.map((img, i) => (
            <motion.a
              key={i}
              href="https://instagram.com/elita5official"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-[var(--c-bg-3)]"
              aria-label={`Shiko postimin ${i + 1} në Instagram`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <img src={img} alt="" aria-hidden loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-all duration-300" aria-hidden />
            </motion.a>
          ))}
        </div>
      </section>

      {/* ━━ NEWSLETTER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="section-pad border-t border-[var(--c-border)]" aria-labelledby="h-newsletter">
        <div className="container-e5">
          <div className="max-w-2xl mx-auto text-center">
            <Reveal>
              <span className="section-label mb-3 inline-block">Komuniteti</span>
              <h2 id="h-newsletter" className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-none text-[var(--c-text)] tracking-tight">
                BËHU PJESË E<br /><span className="text-[var(--c-red)]">TRASHËGIMISË</span>
              </h2>
              <p className="text-[var(--c-text-2)] text-sm leading-relaxed mt-6 mb-8 max-w-sm mx-auto">
                Merr lajmet e fundit për koleksionet, koncertet dhe muzikën e Elita5.
              </p>
              <div className="max-w-sm mx-auto">
                <NewsletterForm />
              </div>
              <p className="font-mono text-[10px] tracking-[0.15em] text-[var(--c-text-3)] mt-4">
                Pa spam. Çabonohuni në çdo kohë.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
