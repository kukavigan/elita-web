import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';

const FAQS = [
  {
    category: 'Porositë',
    items: [
      {
        q: 'Si mund të bëj porosi?',
        a: 'Zgjidhni produktin, shtojeni në shportë dhe ndiqni hapat e checkout. Mund të paguani me kartë krediti/debiti, PayPal, transfer bankar ose para në dorëzim.',
      },
      {
        q: 'A mund ta ndryshoj ose anuloj porosinë time?',
        a: 'Porositë mund të anulohen brenda 2 orëve pas konfirmimit. Kontaktoni mbështetjen tonë sa më shpejt të jetë e mundur te info@elita5store.com.',
      },
      {
        q: 'Si mund ta gjurmoj porosinë time?',
        a: 'Pasi porosia të dërgohet, do të merrni email me numrin e gjurmimit. Mund ta ndiqni edhe nëpërmjet llogarisë tuaj në faqen tonë.',
      },
    ],
  },
  {
    category: 'Dërgesa',
    items: [
      {
        q: 'Sa kohë zgjat dërgesa?',
        a: 'Dërgesa standarde zgjat 3–5 ditë pune brenda Kosovës dhe Shqipërisë. Për vendet tjera të Evropës 5–10 ditë pune. Dërgesa Express është 1–2 ditë pune.',
      },
      {
        q: 'A ekziston dërgesa falas?',
        a: 'Po! Çdo porosi mbi €60 ka dërgim falas brenda Kosovës dhe Shqipërisë me metodën standarde.',
      },
      {
        q: 'A dërgoni jashtë Europës?',
        a: 'Aktualisht dërgojmë në të gjitha vendet e BE-së, Kosovën, Shqipërinë, Maqedoninë e Veriut, Serbinë, Bosnjën dhe Schweizën. Për vende tjera kontaktoni mbështetjen.',
      },
    ],
  },
  {
    category: 'Kthimet & Rimbursimet',
    items: [
      {
        q: 'Cila është politika e kthimeve?',
        a: 'Pranojmë kthime brenda 30 ditëve nga data e blerjes. Produkti duhet të jetë i papërdorur, me etiketa origjinale dhe në paketimin origjinal.',
      },
      {
        q: 'Si mund të kthej një produkt?',
        a: "Kontaktoni mbështetjen tonë me numrin e porosisë dhe arsyen e kthimit. Ne do t'ju dërgojmë udhëzimet e kthimit.",
      },
      {
        q: 'Kur marr rimbursimin?',
        a: 'Pasi produkti të kthehet dhe kontrollohet (2–3 ditë pune), rimbursimi do të bëhet brenda 5–10 ditëve pune.',
      },
    ],
  },
  {
    category: 'Produktet',
    items: [
      {
        q: 'Si ta zgjedh madhësinë e duhur?',
        a: 'Çdo produkt ka udhëzuesin e madhësive në faqen e tij. Nëse jeni midis dy madhësive, rekomandojmë të zgjidhni madhësinë më të madhe.',
      },
      {
        q: 'A janë produktet autentike?',
        a: 'Po, të gjitha produktet janë zyrtare dhe prodhohen me licencë të plotë nga Elita5. Produktet e nënshkruara vijnë me certifikatë autenticiteti.',
      },
      {
        q: 'Si kujdesem për produktet e mia?',
        a: 'Secili produkt ka udhëzime specifike kujdesi. Në përgjithësi, rekomandon lavatriçe me ujë të ftohtë (30°C) dhe tharje në ajër të hapur.',
      },
    ],
  },
];

export function FaqPage() {
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => { document.title = 'Pyetjet e Shpeshta — Elita5 Store'; }, []);

  return (
    <main className="pt-[72px] min-h-screen">
      <div className="bg-[#0D0D0D] border-b border-white/[0.06] py-16 md:py-20">
        <div className="container-e5">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="section-label">Ndihmë</p>
            <h1 className="font-display text-[clamp(3rem,8vw,6rem)] tracking-wider text-white leading-none mt-2">
              PYETJET E<br />
              <span className="text-white/25">SHPESHTA</span>
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="container-e5 py-16">
        <div className="max-w-3xl mx-auto space-y-12">
          {FAQS.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: gi * 0.1 }}
            >
              <h2 className="font-display text-2xl text-white tracking-wider mb-4 pb-3 border-b border-white/[0.06]">
                {group.category.toUpperCase()}
              </h2>
              <div className="space-y-0">
                {group.items.map((item, ii) => {
                  const id = `${gi}-${ii}`;
                  const isOpen = open === id;
                  return (
                    <div key={id} className="border-b border-white/[0.06] last:border-0">
                      <button
                        onClick={() => setOpen(isOpen ? null : id)}
                        className="w-full flex items-center justify-between py-4 text-left gap-4 focus:outline-none focus-visible:text-[#E53935]"
                        aria-expanded={isOpen}
                      >
                        <span className="text-white/80 text-sm font-medium leading-snug">{item.q}</span>
                        <Plus
                          size={15}
                          className={`text-white/30 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-45 text-[#E53935]' : ''}`}
                          aria-hidden
                        />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <p className="text-white/45 text-sm leading-relaxed pb-4">{item.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}

          <div className="bg-[#161616] border border-white/[0.06] p-8 text-center mt-8">
            <p className="text-white/60 text-sm mb-4">Nuk gjetet përgjigjen tuaj?</p>
            <Link to={ROUTES.CONTACT} className="btn-primary text-xs inline-flex">
              Na Kontaktoni
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
