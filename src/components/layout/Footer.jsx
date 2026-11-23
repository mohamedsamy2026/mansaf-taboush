import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { waLink } from '../../utils/whatsapp';
import { SOCIAL_HANDLE, DISPLAY_PHONE } from '../../config/restaurant';
import Social from '../ui/Social';

export default function Footer() {
  const { t } = useApp();
  return (
    <footer className="relative bg-burgundy-deep text-cream">
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="absolute -top-[88px] inset-x-0 w-full h-[90px]" aria-hidden="true">
        <path d="M0 90V45C240 5 520 0 760 30s480 40 680-12V90z" fill="#430707" />
        <path d="M0 45C240 5 520 0 760 30s480 40 680-12" fill="none" stroke="#E9AE43" strokeWidth="4" />
      </svg>
      <div className="geo mx-auto max-w-7xl px-4 pt-6 pb-8 grid gap-6 md:grid-cols-3 items-center text-center md:text-start">
        <div className="flex flex-col items-center md:items-start gap-3">
          <Social />
          <span dir="ltr" className="text-gold-light font-semibold">{SOCIAL_HANDLE}</span>
          <a href={`tel:+2${DISPLAY_PHONE}`} dir="ltr" className="text-cream/90 hover:text-gold">{DISPLAY_PHONE}</a>
        </div>
        <div className="flex flex-col items-center gap-2">
          <img src="/images/brand/logo-transparent.png" alt={t('brand')} width="96" height="96" loading="lazy" className="w-24 h-24 object-contain" />
          <p className="font-display text-xl sm:text-2xl text-gold-light">{t('footer.slogan')}</p>
          <div className="gold-line w-48" />
        </div>
        <div className="flex flex-col items-center md:items-end gap-3">
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-gold"><MessageCircle size={20} />{t('common.orderNow')}</a>
          <nav className="flex flex-wrap justify-center gap-x-4 text-sm" aria-label="Footer">
            {[['home', '/'], ['menu', '/menu'], ['how', '/#how'], ['contact', '/#contact']].map(([k, to]) => <Link key={k} to={to} className="hover:text-gold">{t(`nav.${k}`)}</Link>)}
          </nav>
        </div>
      </div>
      <p className="text-center text-xs text-cream/70 pb-4">© {new Date().getFullYear()} {t('brand')} — {t('footer.rights')}</p>
    </footer>
  );
}
