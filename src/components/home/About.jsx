import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Reveal from '../ui/Reveal';
export default function About() {
  const { t } = useApp();
  return (
    <section id="about" className="parchment geo py-14 px-4">
      <Reveal className="cream-panel mx-auto max-w-4xl p-8 text-center">
        <ChefHat size={44} className="mx-auto text-burgundy" strokeWidth={1.5} />
        <h2 className="font-display text-3xl sm:text-4xl text-burgundy mt-2">{t('about.title')}</h2>
        <div className="gold-line my-4 mx-auto w-2/3" />
        <p className="text-lg leading-loose font-semibold">{t('about.p1')}</p>
        <p className="text-lg leading-loose mt-3">{t('about.p2')}</p>
        <Link to="/menu" className="btn-burgundy mt-6">{t('about.cta')}</Link>
      </Reveal>
    </section>
  );
}
