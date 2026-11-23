import React,{createContext,useContext,useEffect,useMemo,useState} from 'react';
import {products} from '../data/products';
const C=createContext(null);
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
export function StoreProvider({children}){
 const [lang,setLang]=useState(()=>read('mt-lang','ar'));
 const [cart,setCart]=useState(()=>read('mt-cart',[]));
 const [selected,setSelected]=useState(null);
 useEffect(()=>{localStorage.setItem('mt-lang',JSON.stringify(lang));document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr'},[lang]);
 useEffect(()=>localStorage.setItem('mt-cart',JSON.stringify(cart)),[cart]);
 const add=(id,sizeId='base',qty=1)=>{const product=products.find(p=>p.id===id);if(!product||qty<1)return;const key=`${id}:${sizeId}`;setCart(old=>{const found=old.find(i=>i.key===key);return found?old.map(i=>i.key===key?{...i,qty:i.qty+qty}:i):[...old,{key,id,sizeId,qty}]})};
 const update=(key,qty)=>setCart(old=>qty<=0?old.filter(i=>i.key!==key):old.map(i=>i.key===key?{...i,qty}:i));
 const items=useMemo(()=>cart.map(item=>{const product=products.find(p=>p.id===item.id);if(!product)return null;const size=product.sizes.find(s=>s.id===item.sizeId);return {...item,product,size,unit:product.price+(size?.extra||0)}}).filter(Boolean),[cart]);
 const count=items.reduce((s,i)=>s+i.qty,0),subtotal=items.reduce((s,i)=>s+i.unit*i.qty,0);
 return <C.Provider value={{lang,setLang,cart,items,count,subtotal,add,update,clear:()=>setCart([]),selected,setSelected}}>{children}</C.Provider>;
}
export const useStore=()=>useContext(C);
