import { supabase } from './supabase';
const BUCKET='restaurant-media';
export function storagePath(url) {
  if (!url) return null;
  const prefix=`/storage/v1/object/public/${BUCKET}/`;
  try { const u = new URL(url); if (!u.pathname.includes(prefix)) return null;
    const root=new URL(import.meta.env.VITE_SUPABASE_URL).origin;
    if (u.origin!==root) return null;
    return decodeURIComponent(u.pathname.split(prefix)[1]);
  } catch { return null; }
}
export async function compressImage(file,{logo=false}={}) {
  if (!['image/jpeg','image/png','image/webp'].includes(file.type)) throw Error('الصورة يجب أن تكون JPG أو PNG أو WebP');
  if(file.size>15*1024*1024) throw Error('حجم الصورة الأصلية أكبر من 15MB');
  const bitmap=await createImageBitmap(file);
  try {
    const max=logo?1000:1400, scale=Math.min(1,max/Math.max(bitmap.width,bitmap.height));
    const canvas=document.createElement('canvas');
    canvas.width=Math.max(1,Math.round(bitmap.width*scale)); canvas.height=Math.max(1,Math.round(bitmap.height*scale));
    canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);
    let output;
    for(const quality of [0.84,0.74,0.62,0.5]) {
      output=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',quality));
      if(output && output.size<=1.8*1024*1024) break;
    }
    if(!output || output.size>2*1024*1024) throw Error('لم نتمكن من ضغط الصورة للحجم المطلوب');
    return output;
  } finally { bitmap.close(); }
}
export async function uploadImage(file,folder) {
  const blob=await compressImage(file,{logo:folder==='brand'});
  const path=`${folder}/${crypto.randomUUID()}.webp`;
  const {error}=await supabase.storage.from(BUCKET).upload(path,blob,{contentType:'image/webp',upsert:false,cacheControl:'3600'});
  if(error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
const PENDING_KEY='mansaf-taboush-pending-media-deletions';
function pendingDeletions() {
  try { const value=JSON.parse(localStorage.getItem(PENDING_KEY)||'[]');return Array.isArray(value)?value.filter(x=>typeof x==='string'):[]; }
  catch { return []; }
}
function rememberDeletion(url) {
  try { localStorage.setItem(PENDING_KEY,JSON.stringify([...new Set([...pendingDeletions(),url])])); } catch { /* Storage disabled; the caller still receives the error. */ }
}
function forgetDeletion(url) {
  try { localStorage.setItem(PENDING_KEY,JSON.stringify(pendingDeletions().filter(x=>x!==url))); } catch { /* No impact on server deletion. */ }
}
export async function deleteUnusedImage(url) {
  const path=storagePath(url);
  if(!path)return;
  try {
    const [{data:products,error:pe},{data:settings,error:se}]=await Promise.all([
      supabase.from('menu_products').select('id').eq('image_url',url).limit(1),
      supabase.from('restaurant_settings').select('id').eq('logo_url',url).limit(1)
    ]);
    if(pe||se)throw (pe||se);
    if(products?.length||settings?.length){forgetDeletion(url);return;}
    let lastError;
    for(let attempt=0;attempt<3;attempt++){
      const {error}=await supabase.storage.from(BUCKET).remove([path]);
      if(!error){forgetDeletion(url);return;}
      lastError=error;
    }
    throw lastError;
  } catch(error) {
    rememberDeletion(url);
    throw error;
  }
}
export async function retryPendingImageDeletions() {
  for(const url of pendingDeletions()){
    try { await deleteUnusedImage(url); }
    catch { /* Retained for another automatic retry during the next admin login. */ }
  }
}
