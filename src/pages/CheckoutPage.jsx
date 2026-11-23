import { Link, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import CartLines from '../components/cart/CartLines';
import Totals from '../components/cart/Totals';
import DeliveryForm from '../components/checkout/DeliveryForm';
export default function CheckoutPage() {
  const { t, items } = useApp();
  if (!items.length) return <Navigate to="/cart" replace />;
  return (
    <div className="pt-16 parchment geo min-h-screen"><div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-4xl text-burgundy text-center mb-6">{t('checkout.title')}</h1>
      <div className="grid lg:grid-cols-[3fr_2fr] gap-6 items-start">
        <div className="cream-panel p-6 order-2 lg:order-1"><DeliveryForm items={items} /></div>
        <aside className="cream-panel p-6 order-1 lg:order-2 lg:sticky lg:top-20">
          <h2 className="font-display text-2xl text-burgundy mb-2">{t('checkout.summary')}</h2>
          <CartLines /><div className="mt-4"><Totals items={items} /></div>
          <Link to="/cart" className="block mt-4 text-center font-bold underline text-burgundy">{t('checkout.back')}</Link>
        </aside></div></div></div>
  );
}
