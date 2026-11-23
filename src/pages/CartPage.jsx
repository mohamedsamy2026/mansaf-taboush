import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CartLines from '../components/cart/CartLines';
import Totals from '../components/cart/Totals';
export default function CartPage() {
  const { t, items, clear } = useApp();
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="pt-16 parchment geo min-h-screen"><div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl text-burgundy text-center mb-6">{t('cartPage.title')}</h1>
      <div className="cream-panel p-6">
        {items.length === 0 ? (
          <div className="text-center py-8"><ShoppingBag className="mx-auto text-burgundy" size={48} /><p className="font-bold text-xl mt-2">{t('cartPage.empty')}</p><p className="mb-5">{t('cartPage.emptyHint')}</p><Link to="/menu" className="btn-burgundy">{t('common.browse')}</Link></div>
        ) : (<>
          <CartLines /><div className="mt-5"><Totals items={items} /></div>
          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            <Link to="/checkout" className="btn-burgundy">{t('cartPage.checkout')}</Link>
            <Link to="/menu" className="btn-outline !text-burgundy !border-burgundy">{t('cartPage.continue')}</Link>
          </div>
          <div className="mt-4 text-center">
            {!confirm ? <button onClick={() => setConfirm(true)} className="text-red-800 font-bold underline">{t('cartPage.clear')}</button> : (
              <div role="alertdialog" aria-label={t('cartPage.clearConfirm')} className="rounded-xl bg-red-50 border border-red-300 p-3">
                <p className="font-bold mb-2">{t('cartPage.clearConfirm')}</p>
                <div className="flex justify-center gap-2"><button onClick={() => { clear(); setConfirm(false); }} className="btn-burgundy !min-h-[42px]">{t('cartPage.yes')}</button>
                  <button onClick={() => setConfirm(false)} className="btn-outline !text-burgundy !border-burgundy !min-h-[42px]">{t('cartPage.cancel')}</button></div></div>)}
          </div></>)}
      </div></div></div>
  );
}
