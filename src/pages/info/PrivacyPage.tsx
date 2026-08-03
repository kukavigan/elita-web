import { useEffect } from 'react';
import { motion } from 'framer-motion';

const SECTIONS = [
  {
    title: '1. Informacioni që Mbledhim',
    content: `Ne mbledhim informacionin që ju jepni drejtpërdrejt, si emrin, adresën e emailit, numrin e telefonit dhe adresën postare kur krijoni llogari ose bëni porosi. Gjithashtu mbledhim të dhëna teknike si adresa IP dhe informacionin e shfletuesit.`,
  },
  {
    title: '2. Si Përdorim Informacionin',
    content: `Informacionin tuaj e përdorim për: procesimin e porosive dhe pagesave; dërgimin e njoftimeve rreth porosive; komunikimin rreth produkteve dhe shërbimeve; përmirësimin e faqes sonë; dhe respektimin e detyrimeve ligjore.`,
  },
  {
    title: '3. Ndarja e Informacionit',
    content: `Ne nuk shesim ose ndajmë informacionin personal me palë të treta për qëllime marketingu. Informacionin mund ta ndajmë me partnerë dërgimi, procesorë pagesash dhe ofrues shërbimesh teknikë sipas nevojës për të procesuar porosinë tuaj.`,
  },
  {
    title: '4. Cookies dhe Gjurmimi',
    content: `Faqja jonë përdor cookies për të siguruar funksionalitetin bazë (si shporta e blerjeve), për të analizuar trafikun e faqes dhe për të personalizuar përvojën tuaj. Mund të kontrolloni cookies nëpërmjet cilësimeve të shfletuesit tuaj.`,
  },
  {
    title: '5. Siguria e të Dhënave',
    content: `Ne zbatojmë masa të sigurisë teknike dhe organizative për të mbrojtur informacionin tuaj personal. Megjithatë, asnjë metodë transmetimi nëpërmjet internetit nuk është 100% e sigurt.`,
  },
  {
    title: '6. Të Drejtat Tuaja',
    content: `Sipas GDPR dhe ligjeve të zbatueshme, keni të drejtë: të aksesoni të dhënat tuaja; të kërkoni korrigjimin ose fshirjen; të kundërshtoni procesimin; dhe të merrni kopje të të dhënave tuaja. Kontaktoni info@elita5store.com për çdo kërkesë.`,
  },
  {
    title: '7. Ruajtja e të Dhënave',
    content: `Ruajmë të dhënat tuaja personale për aq kohë sa është e nevojshme për qëllimet e përshkruara në këtë politikë, ose siç kërkohet me ligj. Të dhënat e llogarisë ruhen deri sa llogarinë ta fshini.`,
  },
  {
    title: '8. Ndryshime në Politikë',
    content: `Ne mund të përditësojmë këtë politikë herë pas here. Do t'ju njoftojmë me email ose njoftim në faqe kur bëjmë ndryshime materiale. Vazhdimi i përdorimit të faqes pas ndryshimeve nënkupton praninë tuaj.`,
  },
  {
    title: '9. Kontakti',
    content: `Për pyetje rreth privatësisë suaj, kontaktoni: info@elita5store.com | Elita5 Store, Rr. Nënë Tereza 12, Prishtinë 10000, Kosovë.`,
  },
];

export function PrivacyPage() {
  useEffect(() => { document.title = 'Politika e Privatësisë — Elita5 Store'; }, []);

  return (
    <main className="pt-[72px] min-h-screen">
      <div className="bg-[#0D0D0D] border-b border-white/[0.06] py-16 md:py-20">
        <div className="container-e5">
          <p className="section-label">Ligjore</p>
          <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)] tracking-wider text-white leading-none mt-2">
            POLITIKA E<br />
            <span className="text-white/25">PRIVATËSISË</span>
          </h1>
          <p className="text-white/30 text-sm mt-4">Përditësuar: Janar 2025</p>
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
              transition={{ delay: i * 0.05, duration: 0.5 }}
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
