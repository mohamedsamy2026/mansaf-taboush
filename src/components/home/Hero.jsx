import { LOGO_URL, HERO_PRODUCT_ID } from '../../config/restaurant';
import { getProduct, products } from '../../data/products';
import { useShop } from '../../context/ShopContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Palm = ({ className }) => (
  <svg viewBox="0 0 120 260" className={className} aria-hidden="true" fill="#5a2c12">
    <path d="M56 260c2-70 4-120 8-170h6c-2 52-4 100-2 170z" />
    {[-70, -45, -20, 5, 30, 55, 80].map((r) => <ellipse key={r} cx="60" cy="86" rx="52" ry="7" transform={`rotate(${r - 90} 60 86)`} />)}
  </svg>
);

const M = 'linear-gradient(to right,transparent,#000 22%)', V = 'linear-gradient(to bottom,transparent,#000 22%,#000 78%,transparent)';
const FADE = { WebkitMaskImage: `${M},${V}`, maskImage: `${M},${V}`, WebkitMaskComposite: 'source-in', maskComposite: 'intersect' };

export default function Hero() {
  const { t, lang, setOrderNow } = useApp();
  useShop();
  const ar = lang === 'ar';
  return (
    <section className="relative isolate overflow-hidden pt-16 pb-28 md:pb-36" style={{ background: 'linear-gradient(180deg,#f2cf98 0%,#d99a58 45%,#8a4a22 100%)' }}>
      {/* heritage atmosphere: castle + palms (SVG) */}
      <svg viewBox="0 0 400 140" className="absolute top-10 start-1/3 w-[55%] max-w-[560px] opacity-25 -z-10" aria-hidden="true" fill="#9a6232">
        <path d="M20 140V70h18v-8h10v8h12v-8h10v8h12v70zM120 140V30h20v-10h14v10h20v-10h14v10h20v110zM250 140V60h16v-8h10v8h14v-8h10v8h14v80z" />
        <rect x="155" y="90" width="22" height="50" fill="#5a2c12" opacity=".5" rx="11" />
      </svg>
      <Palm className="absolute bottom-24 start-[2%] h-44 md:h-72 opacity-40 -z-10" />
      <Palm className="absolute top-16 end-[1%] h-40 md:h-60 opacity-35 -z-10 -scale-x-100" />
      <div className="geo absolute inset-y-0 start-0 w-10 md:w-16 opacity-80 -z-10 border-e-2 border-gold/60" aria-hidden="true" />

      <div dir="ltr" className="mx-auto max-w-7xl px-4 pt-6 grid gap-4 md:gap-x-6 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] items-center"
        style={{ gridTemplateAreas: undefined }}>
        <motion.img src={LOGO_URL} alt={t('brand')} width="720" height="720" fetchpriority="high"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
          className="floaty mx-auto w-52 sm:w-72 md:w-[22rem] lg:w-[26rem] h-auto drop-shadow-[0_12px_24px_rgba(67,7,7,.55)] md:row-start-1" />
        <motion.img src="/images/products/mansaf-plate.jpg" alt={ar ? 'صينية منسف بالأرز واللحم وصوص الجميد والصنوبر' : 'Mansaf platter with rice, meat, jameed sauce and pine nuts'}
          width="648" height="305" fetchpriority="high" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.2 }}
          style={FADE}
          className="w-[118%] max-w-none sm:w-[112%] md:w-[138%] md:row-span-2 md:col-start-2 md:row-start-1 justify-self-end -me-4 md:-me-[26%] drop-shadow-[0_18px_30px_rgba(40,10,0,.6)]" />
        <div dir={ar ? 'rtl' : 'ltr'} className="md:col-start-1 md:row-start-2 rounded-3xl border-2 border-gold bg-burgundy-deep/85 backdrop-blur-sm p-5 sm:p-6 text-center shadow-2xl">
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl leading-snug text-gold-light">{t('hero.title')}</motion.h1>
          <div className="gold-line my-3" />
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-cream text-base sm:text-lg font-semibold">{t('hero.sub')}</motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="mt-5 flex flex-wrap justify-center gap-3">
            <button disabled={!products.length} className="btn-gold" onClick={() => setOrderNow({ productId: (getProduct(HERO_PRODUCT_ID)||products[0])?.id, sizeId: (getProduct(HERO_PRODUCT_ID)||products[0])?.sizes?.find(s=>s.id==='m')?.id || (getProduct(HERO_PRODUCT_ID)||products[0])?.sizes?.[0]?.id || null, qty: 1 })}><ShoppingCart size={20} />{t('common.orderNow')}</button>
            <Link to="/menu" className="btn-outline">{t('common.discover')}</Link>
          </motion.div>
        </div>
      </div>
      <svg viewBox="0 0 1440 110" preserveAspectRatio="none" className="absolute bottom-0 inset-x-0 w-full h-20 md:h-28" aria-hidden="true">
        <path d="M0 110V60C260 10 520 20 760 55s460 30 680-25V110z" fill="#FDEBC6" />
        <path d="M0 60C260 10 520 20 760 55s460 30 680-25" fill="none" stroke="#E9AE43" strokeWidth="5" />
      </svg>
    </section>
  );
}
