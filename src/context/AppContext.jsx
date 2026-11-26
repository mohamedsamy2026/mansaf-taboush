import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { translations } from '../i18n/translations';
import { useShop } from './ShopContext';
import { getProduct } from '../data/products';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);
const read = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } };
export const itemKey = (productId, sizeId) => `${productId}|${sizeId || '-'}`;

export function AppProvider({ children }) {
  const { revision, isConfigured, loading } = useShop();
  const [lang, setLang] = useState(() => read('mt_lang', 'ar'));
  const [items, setItems] = useState(() => read('mt_cart', []));
  const [drawer, setDrawer] = useState(false);
  const [orderNow, setOrderNow] = useState(null); // {productId,sizeId,qty}
  const [bump, setBump] = useState(0);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = translations[lang].meta.title;
    write('mt_lang', lang);
  }, [lang]);
  useEffect(() => write('mt_cart', items), [items]);
  useEffect(() => {
    if (loading || (!isConfigured && !revision)) return;
    setItems(old => old.filter(i => {
      const p = getProduct(i.productId);
      return p && (!p.sizes || p.sizes.some(s => s.id === i.sizeId));
    }));
    setOrderNow(old => old && getProduct(old.productId) ? old : null);
  }, [revision, loading, isConfigured]);

  const t = useCallback((path) => path.split('.').reduce((o, k) => o?.[k], translations[lang]) ?? path, [lang]);
  const add = useCallback((productId, sizeId, qty = 1) => {
    const product = getProduct(productId);
    if (!product || (product.sizes && !product.sizes.some(s=>s.id===sizeId))) return;
    const key = itemKey(productId, sizeId);
    setItems((cur) => cur.some((i) => i.key === key)
      ? cur.map((i) => (i.key === key ? { ...i, qty: Math.min(99, i.qty + qty) } : i))
      : [...cur, { key, productId, sizeId, qty }]);
    setBump((b) => b + 1);
  }, []);
  const setQty = useCallback((key, qty) => setItems((c) => c.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(99, qty)) } : i))), []);
  const remove = useCallback((key) => setItems((c) => c.filter((i) => i.key !== key)), []);
  const clear = useCallback(() => setItems([]), []);
  const count = items.reduce((s, i) => s + i.qty, 0);

  const value = useMemo(() => ({ lang, setLang, t, items, add, setQty, remove, clear, count, bump, drawer, setDrawer, orderNow, setOrderNow }),
    [lang, t, items, add, setQty, remove, clear, count, bump, drawer, orderNow]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
