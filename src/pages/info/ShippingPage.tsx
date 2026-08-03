import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, Package, Globe, CheckCircle } from 'lucide-react';

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

export function ShippingPage() {
  useEffect(() => { document.title = 'Dërgesa — Elita5 Store'; }, []);

  return (
    <main className="pt-[72px] min-h-screen">
      <div className="bg-[#0D0D0D] border-b border-white/[0.06] py-16 md:py-20">
        <div className="container-e5">
          <p className="section-label">Informacion</p>
          <h1 className="font-display text-[clamp(3rem,8vw,6rem)] tracking-wider text-white leading-none mt-2">
            DËRGESA
          </h1>
        </div>
      </div>

      <div className="container-e5 py-16 max-w-4xl">
        <div className="space-y-12">
          {/* Methods */}
          <Section>
            <h2 className="font-display text-3xl text-white tracking-wider mb-6">METODAT E DËRGIMIT</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: Truck, title: 'Standarde', time: '3–5 ditë pune', price: '€3.50', note: 'Falas mbi €60' },
                { icon: Package, title: 'Express', time: '1–2 ditë pune', price: '€7.50', note: 'Prioritet i lartë' },
                { icon: Globe, title: 'Overnight', time: '1 ditë pune', price: '€15.00', note: 'Dita tjetër' },
              ].map(method => {
                const Icon = method.icon;
                return (
                  <div key={method.title} className="bg-[#161616] border border-white/[0.06] p-6">
                    <div className="w-10 h-10 border border-white/10 flex items-center justify-center mb-4">
                      <Icon size={16} className="text-white/50" aria-hidden />
                    </div>
                    <h3 className="text-white font-semibold text-sm mb-1">{method.title}</h3>
                    <p className="text-[#E53935] font-display text-xl">{method.price}</p>
                    <p className="text-white/40 text-xs mt-1">{method.time}</p>
                    <p className="text-white/25 text-xs mt-0.5">{method.note}</p>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Countries */}
          <Section delay={0.1}>
            <h2 className="font-display text-3xl text-white tracking-wider mb-6">VENDET E DËRGIMIT</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { region: 'Ballkani Perëndimor', countries: 'Kosovë, Shqipëri, Maqedoni e Veriut, Mal i Zi, Serbi, Bosnjë & Hercegovinë', time: '2–5 ditë' },
                { region: 'Europa Perëndimore', countries: 'Gjermani, Austri, Zvicër, Itali, Francë, Belgjikë, Holandë', time: '5–8 ditë' },
                { region: 'Europa Veriore', countries: 'Suedi, Norvegji, Danimarkë, Finlandë', time: '7–10 ditë' },
                { region: 'Europa Juglindore', countries: 'Kroaci, Slloveni, Bullgari, Rumani, Greqi', time: '5–8 ditë' },
              ].map(item => (
                <div key={item.region} className="bg-[#161616] border border-white/[0.06] p-5">
                  <h3 className="text-white font-semibold text-sm mb-2">{item.region}</h3>
                  <p className="text-white/40 text-xs leading-relaxed mb-2">{item.countries}</p>
                  <p className="text-[#E53935] text-xs font-semibold">{item.time}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Important info */}
          <Section delay={0.2}>
            <h2 className="font-display text-3xl text-white tracking-wider mb-6">INFORMACION I RËNDËSISHËM</h2>
            <div className="space-y-3">
              {[
                'Porositë bëhen nga e hëna deri të premten. Porositë e bëra të fundjavës procesohen të hënën.',
                'Numrin e gjurmimit e merrni me email pasi porosia të nisë.',
                'Tarifat e doganës (jashtë BE-së) janë përgjegjësi e blerësit.',
                'Elita5 Store nuk mban përgjegjësi për vonesat e shkaktuara nga shërbime postare.',
                'Adresat e gabuara mund të shkaktojnë vonesa ose kosto shtesë.',
              ].map((note, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle size={14} className="text-[#B71C1C] flex-shrink-0 mt-0.5" aria-hidden />
                  <p className="text-white/50 text-sm leading-relaxed">{note}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </main>
  );
}
