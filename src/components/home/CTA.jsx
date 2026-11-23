import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Reveal from '../ui/Reveal';
export default function CTA() {
  const { t, setOrderNow } = useApp();
  return (
    <section className="geo py-16 px-4 text-center" style={{ background: 'linear-gradient(#650606,#430707)' }}>
      <Reveal className="mx-auto max-w-3xl rounded-[2rem] border-2 border-gold p-8 shadow-[inset_0_0_0_5px_#650606,inset_0_0_0_6px_#E9AE43]">
        <h2 className="font-display text-3xl sm:text-5xl text-gold-light">{t('cta.title')}</h2>
        <p className="text-cream text-lg mt-3 font-semibold">{t('cta.text')}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button className="btn-gold" onClick={() => setOrderNow({ productId: 'meat-single', sizeId: 'm', qty: 1 })}>{t('common.orderNow')}</button>
          <Link to="/menu" className="btn-outline">{t('common.browse')}</Link>
        </div>
      </Reveal>
    </section>
  );
}
