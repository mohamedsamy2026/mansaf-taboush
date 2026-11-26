import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { getProduct, unitPrice, labelFor } from '../../data/products';
import { money } from '../../utils/format';
import Modal from '../ui/Modal';
import Qty from '../ui/Qty';
import DeliveryForm from './DeliveryForm';

function Inner({ init, onClose }) {
  const { t, lang } = useApp();
  const p = getProduct(init.productId);
  const [size, setSize] = useState(init.sizeId || p?.sizes?.[0]?.id || null);
  const [qty, setQty] = useState(init.qty || 1);
  if (!p) return null;
  const safeSize = p.sizes?.some(s=>s.id===size) ? size : p.sizes?.[0]?.id || null;
  const items = [{ key: 'direct', productId: p.id, sizeId: safeSize, qty }];
  return (
    <Modal title={`${t('common.orderNow')} — ${labelFor(p.name,lang)}`} onClose={onClose}>
      <div className="flex gap-3 mb-4 items-center">
        <img src={p.image} alt={labelFor(p.name,lang)} width="96" height="96" className="w-24 h-24 rounded-xl object-cover border-2 border-gold" />
        <div className="flex-1"><h3 className="font-display text-2xl text-burgundy">{labelFor(p.name,lang)}</h3><strong>{money(unitPrice(p, safeSize) * qty, lang)}</strong></div>
      </div>
      {p.sizes && <div role="radiogroup" aria-label={t('common.size')} className="flex flex-wrap gap-2 mb-3">
        {p.sizes.map((s) => <button type="button" key={s.id} role="radio" aria-checked={size === s.id} onClick={() => setSize(s.id)}
          className={`px-4 min-h-[40px] rounded-full border-2 font-bold text-sm ${size === s.id ? 'bg-burgundy text-gold-light border-gold' : 'border-gold/70 text-burgundy'}`}>{labelFor(s.label,lang)}</button>)}</div>}
      <div className="mb-4"><Qty value={qty} onChange={setQty} /></div>
      <DeliveryForm items={items} />
    </Modal>
  );
}
export default function OrderModal() {
  const { orderNow, setOrderNow } = useApp();
  return <AnimatePresence>{orderNow && <Inner key={orderNow.productId} init={orderNow} onClose={() => setOrderNow(null)} />}</AnimatePresence>;
}
