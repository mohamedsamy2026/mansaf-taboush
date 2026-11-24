import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu as MenuIcon, X, Languages, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { waLink } from '../../utils/whatsapp';

const links = [['home', '/'], ['about', '/#about'], ['menu', '/menu'], ['why', '/#why'], ['how', '/#how'], ['contact', '/#contact']];

export default function Header() {
  const { t, lang, setLang, count, bump, setDrawer } = useApp();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const solid = scrolled || pathname !== '/' || open;
  useEffect(() => { const f = () => setScrolled(window.scrollY > 30); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);
  useEffect(() => setOpen(false), [pathname]);
  const cls = ({ isActive }) => `px-3 py-2 rounded-full font-bold transition hover:text-gold ${isActive ? 'text-gold' : 'text-cream'}`;
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 border-b ${solid ? 'bg-burgundy border-gold/60 shadow-lg' : 'bg-gradient-to-b from-burgundy-deep/90 to-transparent border-transparent'}`}>
      <div className="mx-auto max-w-7xl h-16 px-4 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 shrink-0" aria-label={t('brand')}>
          <img src="/images/brand/logo-transparent.png" alt={t('brand')} width="52" height="52" className="h-12 w-12 object-contain" />
          <span className="font-display text-xl text-gold-light hidden sm:block">{t('brand')}</span>
        </Link>
        <nav className="hidden lg:flex items-center" aria-label="Main">
          {links.map(([k, to]) => (to.includes('#') ? <Link key={k} to={to} className={cls({ isActive: false })}>{t(`nav.${k}`)}</Link> : <NavLink key={k} to={to} end className={cls}>{t(`nav.${k}`)}</NavLink>))}
        </nav>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="flex items-center gap-1 px-3 h-11 rounded-full border border-gold text-white font-bold hover:bg-gold/15" aria-label="Language">
            <Languages size={18} /><span className="text-sm">{t('common.language')}</span>
          </button>
          <button onClick={() => setDrawer(true)} className="relative grid place-items-center w-11 h-11 rounded-full border border-gold text-white hover:bg-gold/15" aria-label={`${t('common.cart')} (${count})`}>
            <ShoppingCart size={20} />
            {count > 0 && <motion.span key={bump} initial={{ scale: 1.8 }} animate={{ scale: 1 }} className="absolute -top-1.5 -end-1.5 min-w-5 h-5 px-1 grid place-items-center rounded-full bg-gold text-burgundy-deep text-xs font-extrabold">{count}</motion.span>}
          </button>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-gold !min-h-[44px] !py-2 hidden md:inline-flex"><MessageCircle size={18} />{t('common.orderNow')}</a>
          <button onClick={() => setOpen(!open)} className="lg:hidden grid place-items-center w-11 h-11 text-gold-light" aria-expanded={open} aria-label="Menu">{open ? <X /> : <MenuIcon />}</button>
        </div>
      </div>
      {open && (
        <nav className="lg:hidden bg-burgundy border-t border-gold/50 px-4 pb-4 flex flex-col" aria-label="Mobile">
          {links.map(([k, to]) => <Link key={k} to={to} className="py-3 text-cream font-semibold border-b border-gold/20">{t(`nav.${k}`)}</Link>)}
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-gold mt-3"><MessageCircle size={18} />{t('common.orderNow')}</a>
        </nav>
      )}
    </header>
  );
}
