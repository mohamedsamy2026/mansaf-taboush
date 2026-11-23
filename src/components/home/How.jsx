import { ListChecks, CalendarClock, CookingPot, Truck, ArrowLeft, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Reveal from '../ui/Reveal';
const icons = [ListChecks, CalendarClock, CookingPot, Truck];
export default function How() {
  const { t, lang } = useApp();
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;
  return (
    <section id="how" className="parchment geo pt-12 pb-10 px-4 relative">
      <div className="text-center -mb-5 relative z-10"><h2 className="title-banner">{t('how.title')}</h2></div>
      <Reveal className="cream-panel mx-auto max-w-6xl pt-10 pb-6 px-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {t('how.steps').map(([h, p], i) => {
          const Icon = icons[i];
          return (
            <div key={h} className="relative flex lg:flex-col items-center lg:items-center text-center gap-3 px-3 py-2">
              <div className="relative shrink-0 text-burgundy"><Icon size={52} strokeWidth={1.5} />
                <span className="absolute -top-2 -end-3 grid place-items-center w-7 h-7 rounded-full bg-burgundy text-gold-light text-sm font-extrabold border border-gold">{i + 1}</span></div>
              <div><h3 className="font-extrabold text-xl text-burgundy-deep">{h}</h3><p className="font-semibold">{p}</p></div>
              {i < 3 && <Arrow className="hidden lg:block absolute top-1/2 -end-4 text-gold-dark" size={26} aria-hidden="true" />}
            </div>
          );
        })}
      </Reveal>
    </section>
  );
}
