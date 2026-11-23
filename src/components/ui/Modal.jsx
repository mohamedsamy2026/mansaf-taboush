import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Accessible dialog: Esc to close, focus trap, focus restore, scroll lock.
export default function Modal({ title, onClose, children, side = false }) {
  const { t, lang } = useApp();
  const ref = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    document.body.style.overflow = 'hidden';
    const focusables = () => ref.current.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])');
    focusables()[0]?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') return onClose();
      if (e.key !== 'Tab') return;
      const f = focusables(); if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev?.focus?.(); };
  }, [onClose]);
  const fromX = side ? (lang === 'ar' ? -420 : 420) : 0;
  return (
    <div className="fixed inset-0 z-[80] flex" style={{ justifyContent: side ? 'flex-end' : 'center', alignItems: side ? 'stretch' : 'center' }}>
      <motion.div className="absolute inset-0 bg-burgundy-brown/70 backdrop-blur-sm" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.div ref={ref} role="dialog" aria-modal="true" aria-label={title}
        initial={{ opacity: 0, x: fromX, y: side ? 0 : 30 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, x: fromX }}
        className={`relative parchment geo border-2 border-gold shadow-2xl overflow-y-auto ${side ? 'w-[min(26rem,100vw)] h-full' : 'w-[min(40rem,94vw)] max-h-[92vh] rounded-3xl'}`}>
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-burgundy px-5 py-3 border-b-2 border-gold">
          <h2 className="font-display text-xl text-gold-light">{title}</h2>
          <button onClick={onClose} aria-label={t('common.close')} className="text-gold-light p-2 rounded-full hover:bg-white/10"><X size={22} /></button>
        </div>
        <div className="p-5">{children}</div>
      </motion.div>
    </div>
  );
}
