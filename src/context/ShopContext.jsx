import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase, isConfigured } from '../lib/supabase';
import { categories, products, replaceCatalog } from '../data/products';
import { applyRestaurantSettings } from '../config/restaurant';

const Shop = createContext(null);
export const useShop = () => useContext(Shop);
export async function fetchShop() {
  if (!supabase) return;
  const [a,b,c,d,e] = await Promise.all([
    supabase.from('menu_categories').select('*').order('sort_order'),
    supabase.from('menu_products').select('*').order('sort_order'),
    supabase.from('product_sizes').select('*').order('sort_order'),
    supabase.from('restaurant_settings').select('*').eq('id',1).single(),
    supabase.from('social_links').select('*')
  ]);
  for (const r of [a,b,c,d,e]) if (r.error) throw r.error;
  const cats = a.data.map(x => ({ id:x.id,label:{ ar:x.name_ar,en:x.name_en||x.name_ar } }));
  const mapped = b.data.map(x => {
    const sizes = c.data.filter(y=>y.product_id===x.id).map(y=>({ id:y.id,label:{ ar:y.label_ar,en:y.label_en||y.label_ar },price:Number(y.price) }));
    return { id:x.id, category:x.category_id, image:x.image_url, featured:x.featured,
      name:{ar:x.name_ar,en:x.name_en||x.name_ar},desc:{ar:x.description_ar,en:x.description_en||x.description_ar},
      ...(sizes.length ? { sizes } : { price: Number(x.price || 0) }) };
  });
  replaceCatalog(cats,mapped);
  applyRestaurantSettings(d.data,e.data);
}
export function ShopProvider({children}) {
  const [revision,setRevision] = useState(0);
  const [loading,setLoading] = useState(isConfigured);
  const [error,setError] = useState('');
  const refresh = useCallback(async()=>{
    if (!isConfigured) return;
    try { await fetchShop(); setRevision(v=>v+1); setError(''); }
    catch(e) { setError(e.message || 'Unable to load store'); }
    finally { setLoading(false); }
  },[]);
  useEffect(()=>{ refresh(); },[refresh]);
  return <Shop.Provider value={{categories,products,revision,loading,error,refresh,isConfigured}}>{children}</Shop.Provider>;
}
