import { useEffect } from 'react';
import { motion } from 'framer-motion';

const SECTIONS = [
  {
    title: '1. Pranimi i Kushteve',
    content: 'Duke hyrë dhe përdorur faqen elita5store.com, pranoni plotësisht këto kushte dhe terma shërbimi. Nëse nuk pranoni, ju lutemi mos e përdorni faqen tonë.',
  },
  {
    title: '2. Shërbimi',
    content: 'Elita5 Store ofron produktet zyrtare të grupit rok Elita5, duke përfshirë veshje, aksesore, muzikë dhe koleksione të kufizuara. Rezervojmë të drejtën të ndryshojmë ose heqim produkte në çdo kohë.',
  },
  {
    title: '3. Llogaritë e Përdoruesve',
    content: 'Jeni përgjegjës për ruajtjen e konfidencialitetit të llogarisë dhe fjalëkalimit tuaj. Duhet të jeni të paktën 18 vjeç ose të keni leje prindërore për të blerë. Njoftojeni menjëherë nëse dyshoni qasje të paautorizuar.',
  },
  {
    title: '4. Porositë dhe Pagesa',
    content: 'Çmimet shprehin në EUR (€) dhe përfshijnë TVSH-në. Ne rezervojmë të drejtën të refuzojmë ose anulojmë çdo porosi. Pagesat procesohen nëpërmjet sistemeve të sigurta të palëve të treta.',
  },
  {
    title: '5. Dërgesa dhe Dorëzimi',
    content: 'Kohët e dërgimit janë të orientueshme dhe jo të garantuara. Rreziku i humbjes kalon te blerësi pas dorëzimit te shërbimi i dërgimit. Shiko faqen Dërgesa për detaje të plota.',
  },
  {
    title: '6. Kthimet dhe Rimbursimet',
    content: 'Politika jonë e kthimeve gjendet në faqen Kthimet. Rimbursimet procesohen sipas politikës sonë të shkruar. Produktet e nënshkruara janë finale dhe nuk kthehen pa defekt prodhimi.',
  },
  {
    title: '7. Prona Intelektuale',
    content: 'Gjithë përmbajtja e faqes, duke përfshirë logot, imazhet, tekstin dhe dizajnin, janë pronë e Elita5 dhe janë mbrojtur me të drejtën e autorit. Ndalohet kopjimi ose riprodhimi pa leje të shkruar.',
  },
  {
    title: '8. Kufizimi i Përgjegjësisë',
    content: 'Elita5 Store nuk mban përgjegjësi për dëme indirekte ose të ndërlidhura që mund të lindin nga përdorimi i faqes ose produkteve tona. Përgjegjësia jonë maksimale kufizohet në vlerën e blerjes tuaj.',
  },
  {
    title: '9. Ligji i Zbatueshëm',
    content: 'Këto kushte rregullohen nga ligjet e Republikës së Kosovës. Çdo mosmarrëveshje do të zgjidhet nëpërmjet gjykatave kompetente të Prishtinës, Kosovë.',
  },
  {
    title: '10. Ndryshimet',
    content: 'Rezervojmë të drejtën të ndryshojmë këto kushte në çdo kohë. Ndryshimet hyjnë në fuqi menjëherë pas publikimit. Rekomandojmë t\'i kontrolloni periodikisht.',
  },
];

export function TermsPage() {
  useEffect(() => { document.title = 'Kushtet dhe Termat — Elita5 Store'; }, []);

  return (
    <main className="pt-[72px] min-h-screen">
      <div className="bg-[#0D0D0D] border-b border-white/[0.06] py-16 md:py-20">
        <div className="container-e5">
          <p className="section-label">Ligjore</p>
          <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)] tracking-wider text-white leading-none mt-2">
            KUSHTET<br />
            <span className="text-white/25">DHE TERMAT</span>
          </h1>
          <p className="text-white/30 text-sm mt-4">Hyrë në fuqi: Janar 2025</p>
        </div>
      </div>

      <div className="container-e5 py-16 max-w-3xl">
        <div className="space-y-8">
          {SECTIONS.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.5 }}
              className="border-b border-white/[0.06] pb-8 last:border-0"
            >
              <h2 className="text-white font-semibold text-base mb-3">{section.title}</h2>
              <p className="text-white/45 text-sm leading-relaxed">{section.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
