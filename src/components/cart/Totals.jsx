import { useApp } from '../../context/AppContext';
import { DELIVERY_FEE } from '../../config/restaurant';
import { subtotalOf } from '../../utils/whatsapp';
import { money } from '../../utils/format';
export default function Totals({ items }) {
  const { t, lang } = useApp();
  const sub = subtotalOf(items);
  return (
    <dl className="space-y-1 font-semibold">
      <div className="flex justify-between"><dt>{t('common.subtotal')}</dt><dd>{money(sub, lang)}</dd></div>
      <div className="flex justify-between"><dt>{t('cartPage.delivery')}</dt><dd>{DELIVERY_FEE == null ? t('cartPage.tbc') : money(DELIVERY_FEE, lang)}</dd></div>
      <div className="flex justify-between text-xl font-extrabold text-burgundy border-t-2 border-gold pt-2"><dt>{t('common.total')}</dt><dd>{money(sub + (DELIVERY_FEE || 0), lang)}</dd></div>
      {DELIVERY_FEE == null && <p className="text-xs text-ink/70">{t('cartPage.totalNote')}</p>}
    </dl>
  );
}
