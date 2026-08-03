import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle, XCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';

export function ReturnsPage() {
  useEffect(() => { document.title = 'Kthimet — Elita5 Store'; }, []);

  return (
    <main className="pt-[72px] min-h-screen">
      <div className="bg-[#0D0D0D] border-b border-white/[0.06] py-16 md:py-20">
        <div className="container-e5">
          <p className="section-label">Politika</p>
          <h1 className="font-display text-[clamp(3rem,8vw,6rem)] tracking-wider text-white leading-none mt-2">
            KTHIMET
          </h1>
        </div>
      </div>

      <div className="container-e5 py-16 max-w-4xl">
        <div className="space-y-12">
          {/* Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 border border-white/10 flex items-center justify-center">
                <RotateCcw size={18} className="text-white/50" />
              </div>
              <div>
                <h2 className="font-display text-3xl text-white tracking-wider">30 DITË KTHIM</h2>
                <p className="text-white/40 text-sm">Politika jonë e kthimeve pa kosto shtesë</p>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-2xl">
              Ne pranojmë kthime brenda 30 ditëve nga data e blerjes. Nëse nuk jeni plotësisht të kënaqur
              me blerjen tuaj, ne do t'ju ndihmojmë me kthimin ose zëvendësimin e produktit.
            </p>
          </motion.div>

          {/* What can/cannot be returned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="grid sm:grid-cols-2 gap-6"
          >
            <div>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle size={15} className="text-green-400" />
                Mund të Kthehen
              </h3>
              <ul className="space-y-2">
                {[
                  'Produkte të papërdorura me etiketat origjinale',
                  'Produkte të dëmtuara ose me defekt prodhimi',
                  'Produkte të gabuara (gabim i dyqanit)',
                  'Madhësia e gabuar (sipas udhëzuesit tonë)',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-white/50 text-sm">
                    <span className="w-1 h-1 rounded-full bg-white/20 flex-shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <XCircle size={15} className="text-[#E53935]" />
                Nuk Mund të Kthehen
              </h3>
              <ul className="space-y-2">
                {[
                  'Produkte të përdorura ose të lara',
                  'Produkte pa etiketat origjinale',
                  'Produkte dixhitale ose shkarkime',
                  'Produkte të nënshkruara (pa defekt)',
                  'Produkte pas 30 ditëve nga blerja',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-white/50 text-sm">
                    <span className="w-1 h-1 rounded-full bg-white/20 flex-shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Process */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display text-3xl text-white tracking-wider mb-6">PROCESI I KTHIMIT</h2>
            <div className="space-y-4">
              {[
                { step: '01', title: 'Kontaktoni mbështetjen', desc: 'Dërgoni email tek info@elita5store.com me numrin e porosisë dhe arsyen e kthimit.' },
                { step: '02', title: 'Merrni konfirmimin', desc: 'Brenda 24 orëve do të merrni email me udhëzimet e kthimit dhe etiketën e dërgimit.' },
                { step: '03', title: 'Dërgoni produktin', desc: 'Paketoni produktin me kujdes dhe dërgojeni brenda 5 ditëve nga konfirmimi.' },
                { step: '04', title: 'Rimbursimi', desc: 'Pasi produkti të kontrollohet (2–3 ditë), rimbursimi bëhet brenda 5–10 ditëve pune.' },
              ].map(item => (
                <div key={item.step} className="flex gap-5">
                  <div className="font-display text-3xl text-white/10 flex-shrink-0 w-10 text-right">{item.step}</div>
                  <div className="border-t border-white/[0.06] pt-3 flex-1">
                    <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <div className="bg-[#161616] border border-white/[0.06] p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div>
              <p className="text-white font-semibold">Keni pyetje rreth kthimit?</p>
              <p className="text-white/40 text-sm mt-1">Jemi këtu për t'ju ndihmuar.</p>
            </div>
            <div className="flex gap-3">
              <Link to={ROUTES.CONTACT} className="btn-primary text-xs flex items-center gap-2">
                <Mail size={13} />
                Na Kontaktoni
              </Link>
              <Link to={ROUTES.FAQ} className="btn-outline text-xs">FAQ</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
