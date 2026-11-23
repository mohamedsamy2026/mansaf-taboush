import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { money } from '../../utils/format';
import { unitPrice } from '../../data/products';
import Qty from '../ui/Qty';

export default function ProductCard({ product }) {
  const { t, lang, add, setOrderNow } = useApp();
  const [size, setSize] = useState(product.sizes?.[1]?.id || product.sizes?.[0]?.id || null);
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);
  const addIt = () => { add(product.id, size, qty); setDone(true); setTimeout(() => setDone(false), 1400); };
  return (
    <article className="cream-panel overflow-hidden flex flex-col transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <img src={product.image} alt={product.name[lang]} loading="lazy" width="648" height="305" className="w-full h-44 object-cover border-b-2 border-gold" />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div><h3 className="font-display text-2xl text-burgundy leading-tight">{product.name[lang]}</h3>
          <p className="text-sm font-semibold text-ink/80 mt-1">{product.desc[lang]}</p></div>
        {product.sizes && (
          <div role="radiogroup" aria-label={t('common.size')} className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button key={s.id} role="radio" aria-checked={size === s.id} onClick={() => setSize(s.id)}
                className={`px-4 min-h-[40px] rounded-full border-2 font-bold text-sm transition ${size === s.id ? 'bg-burgundy text-gold-light border-gold' : 'border-gold/70 text-burgundy hover:bg-gold/20'}`}>{s.label[lang]}</button>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <span className="font-extrabold text-xl text-burgundy" title={t('common.demo')}>{money(unitPrice(product, size) * qty, lang)}</span>
          <Qty value={qty} onChange={setQty} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={addIt} className="btn-outline !text-burgundy !border-burgundy !px-3 text-sm">{done ? <><Check size={18} />{t('common.added')}</> : <><ShoppingCart size={18} />{t('common.addToCart')}</>}</button>
          <button onClick={() => setOrderNow({ productId: product.id, sizeId: size, qty })} className="btn-burgundy !px-3 text-sm">{t('common.orderNow')}</button>
        </div>
      </div>
    </article>
  );
}
