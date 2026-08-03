import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Music2, Music } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { SOCIAL_LINKS } from '@/lib/constants';
import { NewsletterForm } from '@/components/shared/NewsletterForm';

export function Footer() {
  const year = new Date().getFullYear();

  const columns = [
    {
      title: 'Dyqani',
      links: [
        { label: 'Arritje të Reja', href: `${ROUTES.SHOP}?badge=new` },
        { label: 'Bluza', href: `${ROUTES.SHOP}?category=tshirts` },
        { label: 'Kapuçe', href: `${ROUTES.SHOP}?category=hoodies` },
        { label: 'Vinyl & CD', href: `${ROUTES.SHOP}?category=vinyl` },
        { label: 'Aksesore', href: `${ROUTES.SHOP}?category=accessories` },
        { label: 'Edicion i Kufizuar', href: `${ROUTES.SHOP}?badge=limited` },
      ],
    },
    {
      title: 'Ndihma',
      links: [
        { label: 'Kontakt', href: ROUTES.CONTACT },
        { label: 'Pyetjet e Shpeshta', href: ROUTES.FAQ },
        { label: 'Dërgesa', href: ROUTES.SHIPPING },
        { label: 'Kthimet', href: ROUTES.RETURNS },
        { label: 'Madhësitë', href: ROUTES.SIZE_GUIDE },
      ],
    },
    {
      title: 'Elita5',
      links: [
        { label: 'Historia', href: ROUTES.ABOUT },
        { label: 'Muzika', href: ROUTES.MUSIC },
        { label: 'Koncertet', href: ROUTES.CONCERTS },
        { label: 'Privatësia', href: ROUTES.PRIVACY },
        { label: 'Kushtet', href: ROUTES.TERMS },
      ],
    },
  ];

  const socials = [
    { href: SOCIAL_LINKS.facebook,  Icon: Facebook, label: 'Facebook' },
    { href: SOCIAL_LINKS.instagram, Icon: Instagram, label: 'Instagram' },
    { href: SOCIAL_LINKS.youtube,   Icon: Youtube,  label: 'YouTube' },
    { href: SOCIAL_LINKS.spotify,   Icon: Music2,   label: 'Spotify' },
    { href: SOCIAL_LINKS.tiktok,    Icon: Music,    label: 'TikTok' },
  ];

  return (
    <footer className="bg-[var(--c-bg-2)] border-t border-[var(--c-border)]" role="contentinfo">

      {/* ── Large wordmark + newsletter ── */}
      <div className="overflow-hidden border-b border-[var(--c-border)]">
        <div className="container-e5 pt-16 pb-12">
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <div>
              <p className="label-red mb-3">Komuniteti</p>
              <h2 className="font-display text-[clamp(3rem,8vw,7rem)] leading-none text-[var(--c-text)] tracking-tight">
                BËHU PJESË E<br />
                <span className="text-[var(--c-red)]">TRASHËGIMISË</span>
              </h2>
            </div>
            <div className="lg:pb-2">
              <p className="text-[var(--c-text-2)] text-sm mb-5 max-w-sm">
                Merr lajmet e fundit për koleksionet, koncertet dhe muzikën e Elita5 direkt në inbox.
              </p>
              <NewsletterForm compact />
              <p className="text-[var(--c-text-3)] text-[11px] mt-3 tracking-wide">
                Pa spam. Çabonohuni kur të dëshironi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main links ── */}
      <div className="container-e5 py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link to={ROUTES.HOME} aria-label="Elita5 — Ballina" className="inline-block mb-4">
              <span className="font-display text-3xl leading-none text-[var(--c-text)] tracking-tight">
                ELITA<span className="text-[var(--c-red)]">5</span>
              </span>
            </Link>
            <p className="text-[var(--c-text-3)] text-sm leading-relaxed max-w-[200px]">
              Dyqani zyrtar i Elita5.<br />
              Muzika. Moda. Trashëgimia.
            </p>
            <nav className="flex items-center gap-2 mt-5" aria-label="Rrjetet sociale">
              {socials.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 border border-[var(--c-border)] flex items-center justify-center text-[var(--c-text-3)] hover:text-[var(--c-text)] hover:border-[var(--c-border-hi)] transition-all duration-200"
                >
                  <Icon size={13} />
                </a>
              ))}
            </nav>
          </div>

          {/* Link columns */}
          {columns.map(col => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="label-upper text-[var(--c-text-3)] mb-4">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l.href}>
                    <Link
                      to={l.href}
                      className="text-[var(--c-text-3)] hover:text-[var(--c-text)] text-sm transition-colors duration-150 hover:translate-x-0.5 inline-block"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-[var(--c-border)] py-4">
        <div className="container-e5 flex flex-col sm:flex-row items-center justify-between gap-3 flex-wrap">
          <p className="font-mono text-[10px] tracking-[0.12em] text-[var(--c-text-3)]">
            © {year} ELITA5. TË GJITHA TË DREJTAT E REZERVUARA — PRISHTINË, KOSOVË
          </p>
          <div className="flex items-center gap-2" aria-label="Metodat e pagesës">
            {['VISA', 'MC', 'BANK', 'COD'].map(m => (
              <span key={m} className="px-2 py-0.5 border border-[var(--c-border)] font-mono text-[8px] tracking-widest text-[var(--c-text-3)]">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
