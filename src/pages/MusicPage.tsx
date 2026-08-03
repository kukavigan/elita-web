import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music2, Youtube, ShoppingBag, Disc3 } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

const ALBUMS = [
  {
    id: 'hitet',
    title: 'Hitet më të Mira',
    year: 2024,
    cover: 'https://images.pexels.com/photos/12858793/pexels-photo-12858793.jpeg?auto=compress&cs=tinysrgb&h=600&w=600',
    tracks: 22,
    desc: 'Koleksioni përfundimtar i hiteve ikonike të Elita5 — remastered nga Abbey Road Studios.',
    vinylSlug: 'vinyl-hitet-me-te-mira',
    cdSlug: 'cd-hitet-me-te-mira',
    spotify: 'https://open.spotify.com/artist/elita5',
    youtube: 'https://youtube.com/@elita5official',
  },
  {
    id: 'trashegimia',
    title: 'Trashëgimia',
    year: 2019,
    cover: 'https://images.pexels.com/photos/18735733/pexels-photo-18735733.jpeg?auto=compress&cs=tinysrgb&h=600&w=600',
    tracks: 14,
    desc: 'Albumi i shtatë i Elita5 — një ode e fuqishme kushtuar trashëgimisë kulturore shqiptare.',
    vinylSlug: 'vinyl-edicion-i-kufizuar',
    cdSlug: 'cd-hitet-me-te-mira',
    spotify: 'https://open.spotify.com/artist/elita5',
    youtube: 'https://youtube.com/@elita5official',
  },
  {
    id: 'dashuri',
    title: 'Dashuri dhe Besnikëri',
    year: 2014,
    cover: 'https://images.pexels.com/photos/3122799/pexels-photo-3122799.jpeg?auto=compress&cs=tinysrgb&h=600&w=600',
    tracks: 12,
    desc: 'Albumi më komercial dhe i dashur i Elita5 — me hitet që mbijojnë brezat.',
    vinylSlug: 'vinyl-hitet-me-te-mira',
    cdSlug: 'cd-hitet-me-te-mira',
    spotify: 'https://open.spotify.com/artist/elita5',
    youtube: 'https://youtube.com/@elita5official',
  },
];

export function MusicPage() {
  useEffect(() => { document.title = 'Muzika — Elita5 Store'; }, []);

  return (
    <main className="pt-[68px]">
      {/* Header */}
      <div className="bg-[var(--c-bg-2)] border-b border-[var(--c-border)] py-16">
        <div className="container-e5">
          <span className="section-label mb-3">Diskografia</span>
          <h1 className="font-display text-[clamp(4rem,12vw,9rem)] leading-none text-[var(--c-text)] tracking-tight">
            MUZIKA<br /><span className="text-[var(--c-text-3)]">ELITA5</span>
          </h1>
        </div>
      </div>

      <div className="container-e5 py-16 space-y-0">
        {ALBUMS.map((album, i) => (
          <motion.div
            key={album.id}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="grid md:grid-cols-[300px_1fr] gap-0 border-b border-[var(--c-border)] py-12 first:border-t"
          >
            {/* Vinyl art */}
            <div className="relative flex items-center justify-center py-6 md:py-0">
              <div className="relative w-48 h-48 md:w-56 md:h-56 group">
                <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(177,25,34,0.1) 0%, transparent 70%)', filter: 'blur(24px)' }} aria-hidden />
                <div className="w-full h-full rounded-full bg-[#111] border border-white/[0.06] overflow-hidden relative group-hover:rotate-[8deg] transition-transform duration-700" aria-hidden>
                  <img src={album.cover} alt="" className="w-full h-full object-cover opacity-20" />
                  <div className="absolute inset-[42%] rounded-full bg-[var(--c-bg)] border border-white/[0.06] flex items-center justify-center">
                    <Disc3 size={10} className="text-[var(--c-text-3)]" />
                  </div>
                </div>
                <div className="absolute inset-[14%] rounded-full overflow-hidden ring-1 ring-white/10">
                  <img src={album.cover} alt={`${album.title} — cover`} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center md:pl-12">
              <div className="flex items-center gap-4 mb-3">
                <span className="font-mono text-[10px] tracking-[0.25em] text-[var(--c-red-hi)] uppercase">{album.year}</span>
                <span className="font-mono text-[10px] tracking-[0.25em] text-[var(--c-text-3)] uppercase">{album.tracks} Këngë</span>
              </div>
              <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none text-[var(--c-text)] tracking-tight">{album.title.toUpperCase()}</h2>
              <p className="text-[var(--c-text-2)] text-sm leading-relaxed mt-4 max-w-md">{album.desc}</p>

              <div className="flex flex-wrap gap-3 mt-7">
                <a href={album.spotify} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1DB954] text-black font-mono text-[9px] tracking-[0.2em] uppercase font-semibold hover:bg-[#1ed760] transition-colors">
                  <Music2 size={13} /> Spotify
                </a>
                <a href={album.youtube} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF0000] text-white font-mono text-[9px] tracking-[0.2em] uppercase font-semibold hover:bg-red-600 transition-colors">
                  <Youtube size={13} /> YouTube
                </a>
                <Link to={ROUTES.PRODUCT(album.vinylSlug)} className="btn-outline text-[10px] py-2.5">
                  <ShoppingBag size={12} /> Vinyl
                </Link>
                <Link to={ROUTES.PRODUCT(album.cdSlug)} className="btn-ghost text-[10px]">
                  CD
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
