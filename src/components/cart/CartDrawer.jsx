import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import Modal from '../ui/Modal';
import CartLines from './CartLines';
import Totals from './Totals';
export default function CartDrawer() {
  const { drawer, setDrawer, items, t } = useApp();
  const close = () => setDrawer(false);
  return (
    <AnimatePresence>
      {drawer && (
        <Modal side title={t('cartPage.title')} onClose={close}>
          {items.length === 0 ? (
            <div className="text-center py-10"><p className="font-bold text-lg">{t('cartPage.empty')}</p><p className="mb-5">{t('cartPage.emptyHint')}</p>
              <Link to="/menu" onClick={close} className="btn-burgundy">{t('common.browse')}</Link></div>
          ) : (<>
            <CartLines /><div className="mt-4"><Totals items={items} /></div>
            <div className="grid gap-2 mt-5">
              <Link to="/checkout" onClick={close} className="btn-burgundy">{t('cartPage.checkout')}</Link>
              <Link to="/cart" onClick={close} className="btn-outline !text-burgundy !border-burgundy">{t('common.cart')}</Link>
            </div></>)}
        </Modal>
      )}
    </AnimatePresence>
  );
}
