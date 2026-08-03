import { useState, useEffect } from 'react';

interface Props { targetDate: Date }

function pad(n: number) { return String(n).padStart(2, '0'); }

export function CountdownTimer({ targetDate }: Props) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
      return {
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      };
    };
    setT(calc());
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = [
    { l: 'DIT', v: t.d },
    { l: 'ORÊ', v: t.h },
    { l: 'MIN', v: t.m },
    { l: 'SEK', v: t.s },
  ];

  return (
    <div className="flex items-center gap-3" aria-label="Numërues i kohës">
      {units.map(({ l, v }, i) => (
        <div key={l} className="flex items-start gap-3">
          {i > 0 && <span className="font-display text-xl text-[var(--c-text-3)] mt-0.5" aria-hidden>:</span>}
          <div className="text-center">
            <p className="font-display text-3xl md:text-4xl text-[var(--c-text)] leading-none tabular-nums">{pad(v)}</p>
            <p className="label-upper text-[var(--c-text-3)] mt-1">{l}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
