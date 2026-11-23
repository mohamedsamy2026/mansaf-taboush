import { Star, BadgeCheck, Zap, Smile, ChefHat } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Reveal from '../ui/Reveal';
const icons = [Star, BadgeCheck, Zap, Smile];
export default function Why() {
  const { t } = useApp();
  return (
    <section id="why" className="parchment geo pt-10 pb-14 px-4">
      <div className="text-center -mb-5 relative z-10"><h2 className="title-banner">{t('why.title')}</h2></div>
      <Reveal className="cream-panel mx-auto max-w-6xl pt-10 pb-6 px-4 grid gap-6 grid-cols-2 lg:grid-cols-4">
        {t('why.items').map(([h, p], i) => {
          const Icon = icons[i];
          return (
            <div key={h} className="flex flex-col items-center text-center gap-2">
              <span className="grid place-items-center w-20 h-20 rounded-full text-gold-light border-4 border-gold shadow-lg" style={{ background: 'radial-gradient(circle at 35% 30%, #8a0d0d, #430707)' }}><Icon size={36} /></span>
              <h3 className="font-extrabold text-lg text-burgundy-deep">{h}</h3><p className="font-semibold">{p}</p>
            </div>
          );
        })}
      </Reveal>
      <ChefHat className="hidden xl:block mx-auto mt-4 text-burgundy/40" size={34} aria-hidden="true" />
    </section>
  );
}
