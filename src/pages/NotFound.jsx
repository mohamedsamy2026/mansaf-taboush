import { LOGO_URL } from '../config/restaurant';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
export default function NotFound() {
  useShop();
  const { t } = useApp();
  return (
    <div className="pt-16 min-h-screen parchment geo grid place-items-center px-4"><div className="cream-panel p-10 text-center max-w-md">
      <img src={LOGO_URL} alt="" width="120" height="120" className="mx-auto w-28" />
      <h1 className="font-display text-4xl text-burgundy">404</h1><p className="font-bold text-xl">{t('nf.title')}</p><p className="mb-5">{t('nf.text')}</p>
      <Link to="/" className="btn-burgundy">{t('nf.home')}</Link></div></div>
  );
}
