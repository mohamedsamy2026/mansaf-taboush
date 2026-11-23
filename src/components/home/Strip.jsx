import { Leaf, ConciergeBell, Gem, Bike, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Reveal from '../ui/Reveal';
const icons = [Leaf, ConciergeBell, Gem, Bike];
export default function Strip() {
  const { t } = useApp();
  return (
    <section aria-label="features" className="parchment geo -mt-1 py-6">
      <Reveal className="mx-auto max-w-5xl px-4 grid grid-cols-2 md:grid-cols-4">
        {t('strip').map((txt, i) => {
          const Icon = icons[i];
          return (
            <div key={txt} className={`flex flex-col items-center gap-2 py-4 text-burgundy font-extrabold text-lg text-center md:border-gold/70 ${i < 3 ? 'md:border-e-2' : ''} ${i % 2 === 0 ? 'border-e-2 border-gold/70 md:border-e-2' : ''}`}>
              <Icon size={46} strokeWidth={1.6} />
              <span>{txt} {i === 1 && <Heart size={16} className="inline fill-red-600 text-red-600" aria-hidden="true" />}</span>
            </div>
          );
        })}
      </Reveal>
    </section>
  );
}
