import { Minus, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
export default function Qty({ value, onChange }) {
  const { t } = useApp();
  const b = 'grid place-items-center w-11 h-11 rounded-full border-2 border-gold bg-burgundy text-gold-light active:scale-90 transition disabled:opacity-40';
  return (
    <div className="inline-flex items-center gap-2" role="group" aria-label={t('common.qty')}>
      <button type="button" className={b} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="-"><Minus size={18} /></button>
      <span className="min-w-8 text-center font-bold text-lg" aria-live="polite">{value}</span>
      <button type="button" className={b} onClick={() => onChange(value + 1)} disabled={value >= 99} aria-label="+"><Plus size={18} /></button>
    </div>
  );
}
