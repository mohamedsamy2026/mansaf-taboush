import { useState } from 'react';
import { Link } from 'react-router-dom';
import { labelFor } from '../../data/products';
import { useShop } from '../../context/ShopContext';
import { useApp } from '../../context/AppContext';
import ProductCard from './ProductCard';
import Reveal from '../ui/Reveal';

export default function MenuSection({ preview = false }) {
  const { t, lang } = useApp();
  const { categories, products } = useShop();
  const [cat, setCat] = useState('all');
  const list = preview ? products.filter((p) => p.featured || p.category === 'chicken').slice(0, 3) : products.filter((p) => cat === 'all' || p.category === cat);
  return (
    <section id="menu" className="parchment geo pt-12 pb-14 px-4">
      <div className="text-center mb-6"><h2 className="title-banner">{t('menu.title')}</h2>
        <p className="mt-3 text-sm font-semibold text-burgundy">{t('menu.note')}</p></div>
      <div className="mx-auto max-w-6xl">
        {!preview && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 sm:justify-center" role="tablist" aria-label={t('menu.title')}>
            {categories.map((c) => (
              <button key={c.id} role="tab" aria-selected={cat === c.id} onClick={() => setCat(c.id)}
                className={`shrink-0 px-5 min-h-[44px] rounded-full border-2 font-bold transition ${cat === c.id ? 'bg-burgundy text-gold-light border-gold shadow-md' : 'bg-cream border-gold/70 text-burgundy hover:bg-gold/25'}`}>{labelFor(c.label,lang)}</button>
            ))}
          </div>
        )}
        {list.length === 0 ? <p className="text-center font-bold">{t('menu.empty')}</p> : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((p, i) => <Reveal key={p.id} delay={i * 0.05}><ProductCard product={p} /></Reveal>)}</div>
        )}
        {preview && <div className="text-center mt-8"><Link to="/menu" className="btn-burgundy">{t('common.viewAll')}</Link></div>}
      </div>
    </section>
  );
}
