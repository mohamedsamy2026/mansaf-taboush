import { useState } from 'react';
import { MessageCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { buildOrderMessage, openWhatsApp } from '../../utils/whatsapp';

const empty = { name: '', phone: '', city: '', street: '', building: '', notes: '', mapLink: '', date: '', time: '' };

export default function DeliveryForm({ items }) {
  const { t, lang } = useApp();
  const [f, setF] = useState(empty);
  const [err, setErr] = useState({});
  const [opened, setOpened] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const validate = () => {
    const e = {}; const digits = f.phone.replace(/[\s\-()+]/g, '');
    if (f.name.trim().length < 2) e.name = t('errors.name');
    if (!/^\d{8,15}$/.test(digits)) e.phone = t('errors.phone');
    if (!f.city.trim()) e.city = t('errors.city');
    if (f.street.trim().length < 4) e.street = t('errors.street');
    if (f.mapLink.trim() && !/^https?:\/\/\S+$/i.test(f.mapLink.trim())) e.mapLink = t('errors.map');
    if (!items.length || items.some((i) => !Number.isInteger(i.qty) || i.qty < 1)) e.items = t('errors.items');
    return e;
  };
  const submit = (ev) => {
    ev.preventDefault();
    const e = validate(); setErr(e);
    if (Object.keys(e).length) { document.querySelector('[aria-invalid="true"]')?.focus(); return; }
    openWhatsApp(buildOrderMessage(lang, items, { ...f, name: f.name.trim(), phone: f.phone.trim() })); // cart is NOT cleared
    setOpened(true);
  };
  const Field = ({ k, label, type = 'text', area, ltr, req }) => (
    <label className="block">
      <span className="font-bold text-burgundy-deep text-sm">{label}{req && ' *'}</span>
      {area ? <textarea rows="2" className="field mt-1" value={f[k]} onChange={set(k)} aria-invalid={!!err[k]} />
        : <input type={type} dir={ltr ? 'ltr' : undefined} inputMode={k === 'phone' ? 'tel' : undefined} autoComplete={k === 'phone' ? 'tel' : k === 'name' ? 'name' : 'off'}
          className={`field mt-1 ${ltr && lang === 'ar' ? 'text-end' : ''}`} value={f[k]} onChange={set(k)} aria-invalid={!!err[k]} />}
      {err[k] && <span role="alert" className="text-sm font-bold text-red-700">{err[k]}</span>}
    </label>
  );
  return (
    <form onSubmit={submit} noValidate className="grid gap-3">
      <p className="flex items-start gap-2 text-sm font-bold text-burgundy"><Info size={18} className="shrink-0 mt-0.5" />{t('checkout.only')}</p>
      <Field k="name" label={t('checkout.name')} req />
      <Field k="phone" label={t('checkout.phone')} type="tel" ltr req />
      <div className="grid sm:grid-cols-2 gap-3"><Field k="city" label={t('checkout.city')} req /><Field k="building" label={t('checkout.building')} /></div>
      <Field k="street" label={t('checkout.street')} area req />
      <Field k="mapLink" label={t('checkout.map')} type="url" ltr />
      <div className="grid sm:grid-cols-2 gap-3"><Field k="date" label={t('checkout.date')} type="date" ltr /><Field k="time" label={t('checkout.time')} type="time" ltr /></div>
      <p className="text-xs font-semibold text-ink/75">{t('checkout.timeNote')}</p>
      <Field k="notes" label={t('checkout.notes')} area />
      {err.items && <p role="alert" className="font-bold text-red-700">{err.items}</p>}
      <button type="submit" className="btn-burgundy !bg-none !bg-[#128C4A] !border-gold"><MessageCircle size={20} />{t('checkout.send')}</button>
      <p className="text-xs font-semibold text-ink/75">{t('checkout.sendNote')}</p>
      {opened && <p role="status" className="rounded-xl bg-gold/30 border border-gold p-3 font-bold text-burgundy-deep">{t('checkout.opened')}</p>}
    </form>
  );
}
