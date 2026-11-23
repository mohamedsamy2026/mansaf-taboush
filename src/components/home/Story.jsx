import { useApp } from '../../context/AppContext';
import Reveal from '../ui/Reveal';
export default function Story() {
  const { t, lang } = useApp();
  return (
    <section className="bg-burgundy-deep geo py-12 px-4 overflow-hidden">
      <Reveal className="mx-auto max-w-5xl grid md:grid-cols-2 gap-6 items-center">
        <div className="rounded-3xl border-2 border-gold p-1.5 shadow-2xl bg-gold/10">
          <img src="/images/products/mansaf-plate.jpg" alt={lang === 'ar' ? 'صينية منسف دافئة' : 'A warm Mansaf platter'} loading="lazy" width="648" height="305" className="w-full h-64 sm:h-72 object-cover rounded-[1.25rem]" />
        </div>
        <div className="text-center md:text-start text-cream">
          <h2 className="font-display text-3xl sm:text-4xl text-gold-light">{t('story.title')}</h2>
          <div className="gold-line my-4" /><p className="text-lg leading-loose">{t('story.text')}</p>
        </div>
      </Reveal>
    </section>
  );
}
