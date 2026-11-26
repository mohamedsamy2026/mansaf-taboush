import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Plus, Trash2, Save, ImagePlus, ShieldCheck, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { uploadImage, deleteUnusedImage, retryPendingImageDeletions } from '../lib/media';
import { useShop } from '../context/ShopContext';

const platformChoices=['youtube','instagram','tiktok','x','facebook','snapchat','telegram'];
const shell='cream-panel p-5 sm:p-7';
const field='field mt-1 w-full';
const blankProduct={id:'',category_id:'',name_ar:'',name_en:'',description_ar:'',description_en:'',image_url:'/images/products/mansaf-plate.jpg',featured:false,price:0,sort_order:0};
const blankSize={id:'',label_ar:'',label_en:'',price:0,sort_order:0};
const slug=()=>`item-${crypto.randomUUID().slice(0,12)}`;
const Input=({label,value,onChange,type='text',required=false,placeholder='',min,step,disabled=false})=><label className="block text-sm font-bold text-burgundy-deep">{label}{required?' *':''}<input className={field} value={value??''} onChange={e=>onChange(e.target.value)} type={type} placeholder={placeholder} required={required} min={min} step={step} disabled={disabled} /></label>;
const Panel=({title,children})=><section className={shell}><h2 className="font-display text-2xl text-burgundy mb-5">{title}</h2>{children}</section>;
const Button=({children,disabled=false,type='button',onClick})=><button type={type} onClick={onClick} disabled={disabled} className="btn-burgundy disabled:opacity-40">{children}</button>;

export default function AdminPage() {
 const {refresh,isConfigured}=useShop();
 const [session,setSession]=useState(null),[authorized,setAuthorized]=useState(false),[checking,setChecking]=useState(true);
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const [tab,setTab]=useState('products');
 const [cats,setCats]=useState([]),[prods,setProds]=useState([]),[settings,setSettings]=useState(null),[socials,setSocials]=useState([]);
 const [category,setCategory]=useState(null),[product,setProduct]=useState(null),[sizes,setSizes]=useState([]);
 const [pendingProductFile,setPendingProductFile]=useState(null),[pendingLogoFile,setPendingLogoFile]=useState(null);
 const [productPreview,setProductPreview]=useState(''),[logoPreview,setLogoPreview]=useState('');
 useEffect(()=>{
  if(!pendingProductFile){setProductPreview('');return;}
  const preview=URL.createObjectURL(pendingProductFile);setProductPreview(preview);
  return ()=>URL.revokeObjectURL(preview);
 },[pendingProductFile]);
 useEffect(()=>{
  if(!pendingLogoFile){setLogoPreview('');return;}
  const preview=URL.createObjectURL(pendingLogoFile);setLogoPreview(preview);
  return ()=>URL.revokeObjectURL(preview);
 },[pendingLogoFile]);
 const alertError=e=>{setMessage(`خطأ: ${e?.message||String(e)}`);};
 const run=async fn=>{setBusy(true);setMessage('');try {await fn();setMessage(current=>current || 'تم الحفظ بنجاح');}catch(e){alertError(e);}finally{setBusy(false);}};
 async function loadAdmin(){
   const [a,b,c,d]=await Promise.all([
    supabase.from('menu_categories').select('*').order('sort_order').order('id'),supabase.from('menu_products').select('*').order('sort_order'),
    supabase.from('restaurant_settings').select('*').eq('id',1).single(),supabase.from('social_links').select('*')]);
   for(const r of [a,b,c,d]) if(r.error) throw r.error;
   setCats(a.data);setProds(b.data);setSettings(c.data);setSocials(d.data);
 }
 useEffect(()=>{
  if(!supabase){setChecking(false);return;}
  let active=true;
  async function check(s){
   if(!active)return;
   setChecking(true);setSession(s);setAuthorized(false);
   if(s){const {data,error}=await supabase.from('admin_users').select('user_id').eq('user_id',s.user.id).maybeSingle();
    if(!active)return;
    if(error)alertError(error);
    if(data){setAuthorized(true);try{await loadAdmin();await retryPendingImageDeletions();}catch(e){alertError(e);}}
   }
   if(active)setChecking(false);
  }
  supabase.auth.getSession().then(({data})=>check(data.session));
  const {data:{subscription}}=supabase.auth.onAuthStateChange((event,s)=>{if(event==='SIGNED_IN'||event==='SIGNED_OUT')setTimeout(()=>check(s),0);});
  return ()=>{active=false;subscription.unsubscribe();};
 },[]);
 const login=async e=>{e.preventDefault();setBusy(true);setMessage('');try{const {error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;setPassword('');}catch(e){alertError(e);}finally{setBusy(false);}};
 const saveCategory=()=>run(async()=>{
  if(!category.name_ar?.trim())throw Error('اكتب اسم القسم بالعربي');
  const lastOrder=cats.reduce((max,c)=>Math.max(max,c.sort_order),-10);
  const row={id:category.id||slug(),name_ar:category.name_ar.trim(),name_en:category.name_en||'',sort_order:category.id?Number(category.sort_order)||0:lastOrder+10};
  const {error}=await supabase.from('menu_categories').upsert(row);if(error)throw error;
  setCategory(null);await loadAdmin();await refresh();
 });
 const moveCategory=(index,direction)=>run(async()=>{
  const target=index+direction;
  if(target<0||target>=cats.length)return;
  const next=[...cats];
  [next[index],next[target]]=[next[target],next[index]];
  const {error}=await supabase.rpc('reorder_menu_categories',{p_ordered_ids:next.map(c=>c.id)});
  if(error)throw Error(error.message+' — شغّل ملف supabase/04_reorder_categories.sql في SQL Editor إن لم تشغّله بعد');
  await loadAdmin();await refresh();
  setMessage('تم حفظ ترتيب الأقسام بنجاح');
 });
 const deleteCategory=c=>{
  const n=prods.filter(p=>p.category_id===c.id).length;
  if(!window.confirm(`سيتم حذف القسم «${c.name_ar}» و${n} وجبة مرتبطة به نهائيًا، وحذف صورها غير المشتركة. هل أنت متأكد؟`))return;
  run(async()=>{
   const {data:linked,error:linkedError}=await supabase.from('menu_products').select('image_url').eq('category_id',c.id);
   if(linkedError)throw linkedError;
   const {data:deleted,error}=await supabase.from('menu_categories').delete().eq('id',c.id).select('id');
   if(error)throw error;
   if(!deleted?.length)throw Error('لم يتم حذف القسم. حدّث الصفحة وحاول مرة أخرى.');
   const failed=[];
   for(const url of new Set((linked||[]).map(p=>p.image_url))){
    try{await deleteUnusedImage(url);}catch(e){failed.push(e.message);}
   }
   setCategory(null);await loadAdmin();await refresh();
   if(failed.length)setMessage('حُذف القسم والوجبات نهائيًا لكن فشل حذف بعض صور Storage: '+failed.join('، '));
   else setMessage('تم حذف القسم ووجباته وصورها غير المشتركة نهائيًا');
  });
 };
 const editProduct=async row=>{setPendingProductFile(null);setProduct({...row});if(!row.id||!prods.some(p=>p.id===row.id)){setSizes([]);return;}
  const {data,error}=await supabase.from('product_sizes').select('*').eq('product_id',row.id).order('sort_order');if(error)alertError(error);else setSizes(data);};
 const saveProduct=()=>run(async()=>{
  if(!product.name_ar?.trim()||!product.category_id)throw Error('اسم الوجبة والقسم مطلوبان');
  if(sizes.some(s=>!s.label_ar?.trim()||!Number.isFinite(Number(s.price))||Number(s.price)<0))throw Error('راجع بيانات الأحجام');
  const former=prods.find(p=>p.id===product.id);
  const id=product.id||slug();
  let uploadedUrl=null;
  if(pendingProductFile)uploadedUrl=await uploadImage(pendingProductFile,'products');
  const row={id,category_id:product.category_id,name_ar:product.name_ar.trim(),name_en:product.name_en||'',
   description_ar:product.description_ar||'',description_en:product.description_en||'',image_url:uploadedUrl||product.image_url,
   featured:!!product.featured,price:sizes.length?null:Number(product.price||0),sort_order:Number(product.sort_order)||0};
  const {error}=await supabase.from('menu_products').upsert(row);
  if(error){
   if(uploadedUrl){try{await deleteUnusedImage(uploadedUrl);}catch(cleanupError){throw Error(`${error.message}. تعذّر أيضًا حذف الصورة الجديدة: ${cleanupError.message}`);}}
   throw error;
  }
  setPendingProductFile(null);
  setProduct(previous=>previous?{...previous,id,image_url:row.image_url}:previous);
  const existing=await supabase.from('product_sizes').select('id').eq('product_id',id);if(existing.error)throw existing.error;
  const normalized=sizes.map((s,i)=>({id:s.id||slug(),product_id:id,label_ar:s.label_ar.trim(),label_en:s.label_en||'',price:Number(s.price),sort_order:i*10}));
  if(normalized.length){const r=await supabase.from('product_sizes').upsert(normalized,{onConflict:'product_id,id'});if(r.error)throw r.error;}
  const removed=existing.data.filter(x=>!normalized.some(y=>y.id===x.id)).map(x=>x.id);
  if(removed.length){const r=await supabase.from('product_sizes').delete().eq('product_id',id).in('id',removed);if(r.error)throw r.error;}
  let mediaWarning='';
  if(former?.image_url && former.image_url!==row.image_url){
   try{await deleteUnusedImage(former.image_url);}catch(e){mediaWarning='تم حفظ الوجبة، لكن تعذّر حذف صورتها القديمة من Storage: '+e.message;}
  }
  setProduct(null);await loadAdmin();await refresh();
  setMessage(mediaWarning||'تم حفظ الوجبة وإزالة الصورة القديمة غير المشتركة تلقائيًا');
 });
 const deleteProduct=p=>{
  if(!window.confirm(`حذف وجبة «${p.name_ar}» نهائيًا من قاعدة البيانات وحذف صورتها إن لم تكن مشتركة؟`))return;
  run(async()=>{
   const {data:deleted,error}=await supabase.from('menu_products').delete().eq('id',p.id).select('id');
   if(error)throw error;
   if(!deleted?.length)throw Error('لم يتم حذف الوجبة. حدّث الصفحة وحاول مرة أخرى.');
   let mediaWarning='';
   try{await deleteUnusedImage(p.image_url);}catch(e){mediaWarning='حُذفت الوجبة نهائيًا، لكن تعذّر حذف صورتها من Storage: '+e.message;}
   setProduct(null);setPendingProductFile(null);await loadAdmin();await refresh();
   setMessage(mediaWarning||'تم حذف الوجبة نهائيًا وإزالة صورتها غير المشتركة من Storage');
  });
 };
 const saveSettings=()=>run(async()=>{
  const s=settings;
  const {data:current,error:currentError}=await supabase.from('restaurant_settings').select('logo_url').eq('id',1).single();
  if(currentError)throw currentError;
  const formerLogo=current.logo_url;
  const phone=/^\+[0-9]{1,4}$/,digits=/^[0-9]{6,15}$/;
  if(!phone.test(s.phone_country_code)||!phone.test(s.whatsapp_country_code)||!digits.test(s.phone_local)||!digits.test(s.whatsapp_local))throw Error('رمز الدولة يبدأ بـ + والأرقام من 6 إلى 15 رقمًا');
  let newLogo=null;
  if(pendingLogoFile)newLogo=await uploadImage(pendingLogoFile,'brand');
  const {data:saved,error}=await supabase.from('restaurant_settings').update({
   phone_country_code:s.phone_country_code,phone_local:s.phone_local,whatsapp_country_code:s.whatsapp_country_code,whatsapp_local:s.whatsapp_local,
   social_handle:s.social_handle,show_social_handle:s.show_social_handle,logo_url:newLogo||s.logo_url,
   hero_product_id:s.hero_product_id||null,currency_ar:s.currency_ar,currency_en:s.currency_en,
   delivery_fee:s.delivery_fee===''?null:s.delivery_fee,updated_at:new Date().toISOString()
  }).eq('id',1).select('id');
  if(error||!saved?.length){
   if(newLogo){try{await deleteUnusedImage(newLogo);}catch(cleanupError){throw Error(`تعذّر حفظ الإعدادات وحذف الشعار الجديد: ${cleanupError.message}`);}}
   throw (error||Error('لم يتم حفظ الإعدادات'));
  }
  setPendingLogoFile(null);
  let mediaWarning='';
  if(formerLogo && formerLogo!==(newLogo||s.logo_url)){
   try{await deleteUnusedImage(formerLogo);}catch(e){mediaWarning='تم حفظ الإعدادات، لكن تعذّر حذف الشعار القديم من Storage: '+e.message;}
  }
  await loadAdmin();await refresh();
  setMessage(mediaWarning||'تم حفظ الإعدادات وحذف الشعار القديم غير المستخدم تلقائيًا');
 });
 const saveSocial=()=>run(async()=>{
  for(const s of socials){if(!platformChoices.includes(s.platform))throw Error('منصة غير مدعومة');
   const u=new URL(s.url);if(u.protocol!=='https:')throw Error('يجب كتابة رابط https صحيح');}
  const {data:old,error:oe}=await supabase.from('social_links').select('*');if(oe)throw oe;
  for(const s of old.filter(x=>!socials.some(y=>y.platform===x.platform))){const r=await supabase.from('social_links').delete().eq('platform',s.platform);if(r.error)throw r.error;}
  if(socials.length){const r=await supabase.from('social_links').upsert(socials);if(r.error)throw r.error;}
  await loadAdmin();await refresh();
 });
 const update=(fn,k,v)=>fn(s=>({...s,[k]:v}));
 if(!isConfigured)return <div dir="rtl" className="min-h-screen parchment p-10 text-burgundy">فعّل ملف .env أولًا وفق README-SETUP.md</div>;
 if(checking)return <div dir="rtl" className="min-h-screen parchment p-10 text-burgundy font-bold">جاري التحقق من صلاحيات الدخول...</div>;
 if(!session)return <main dir="rtl" className="min-h-screen parchment geo flex items-center justify-center px-4"><form onSubmit={login} className="cream-panel max-w-md w-full p-8 grid gap-4"><ShieldCheck className="text-burgundy" size={42}/><h1 className="font-display text-3xl text-burgundy">دخول إدارة منسف طبوش</h1><Input label="البريد الإلكتروني" value={email} onChange={setEmail} type="email" required/><Input label="كلمة المرور" value={password} onChange={setPassword} type="password" required/><Button type="submit" disabled={busy}>تسجيل الدخول</Button>{message&&<p role="alert" className="text-red-800 font-bold">{message}</p>}<Link to="/" className="underline text-burgundy">العودة للموقع</Link></form></main>;
 if(!authorized)return <div dir="rtl" className="min-h-screen parchment p-10"><Panel title="غير مصرح بدخول لوحة الإدارة"><p className="mb-4">هذا الحساب غير موجود في جدول admin_users. نفّذ ملف منح صلاحية الأدمن داخل Supabase.</p><Button onClick={()=>supabase.auth.signOut()}>تسجيل خروج</Button></Panel></div>;
 return <main dir="rtl" className="min-h-screen parchment geo text-ink pb-16"><header className="bg-burgundy text-gold-light border-b-2 border-gold px-5 py-4"><div className="max-w-6xl mx-auto flex items-center justify-between gap-3 flex-wrap"><h1 className="font-display text-2xl">لوحة تحكم منسف طبوش</h1><div className="flex gap-2 items-center flex-wrap"><Link to="/" className="btn-outline">زيارة الموقع</Link><button className="btn-gold" onClick={()=>supabase.auth.signOut()}><LogOut size={18}/> خروج</button></div></div></header>
 <div className="max-w-6xl mx-auto px-4 pt-6"><nav className="flex flex-wrap gap-2 mb-5">{[['products','الوجبات'],['categories','الأقسام'],['contact','التواصل والشعار'],['social','السوشيال ميديا']].map(([id,label])=><button key={id} onClick={()=>{setTab(id);setMessage('');}} className={tab===id?'btn-burgundy':'btn-outline !text-burgundy !border-burgundy'}>{label}</button>)}</nav>
 {message&&<p role="status" className="cream-panel border border-gold text-burgundy font-bold p-3 mb-4">{message}</p>}
 {tab==='categories'&&<Panel title="إدارة أقسام قائمة الطعام"><Button disabled={busy} onClick={()=>setCategory({id:'',name_ar:'',name_en:'',sort_order:0})}><Plus size={18}/> إضافة قسم</Button>
 <div className="grid gap-3 mt-5">{cats.map((c,i)=><div key={c.id} className="rounded-xl border border-gold p-3 flex justify-between items-center gap-3"><div><strong className="block">{c.name_ar}</strong><small>{c.name_en}</small></div><div className="flex gap-2 items-center"><button type="button" className="p-2 text-burgundy disabled:opacity-30" disabled={busy||i===0} onClick={()=>moveCategory(i,-1)} title="تحريك القسم لأعلى" aria-label={`تحريك قسم ${c.name_ar} لأعلى`}><ArrowUp size={20}/></button><button type="button" className="p-2 text-burgundy disabled:opacity-30" disabled={busy||i===cats.length-1} onClick={()=>moveCategory(i,1)} title="تحريك القسم لأسفل" aria-label={`تحريك قسم ${c.name_ar} لأسفل`}><ArrowDown size={20}/></button><button className="btn-outline !text-burgundy !border-burgundy" disabled={busy} onClick={()=>setCategory(c)}>تعديل</button><button className="p-2 text-red-800" disabled={busy} onClick={()=>deleteCategory(c)} aria-label="حذف القسم"><Trash2/></button></div></div>)}</div>
 {category&&<form className="grid gap-3 border-t border-gold mt-5 pt-5" onSubmit={e=>{e.preventDefault();saveCategory();}}><h3 className="font-bold text-burgundy">{category.id?'تعديل القسم':'قسم جديد'}</h3><Input label="اسم القسم عربي" required value={category.name_ar} onChange={v=>update(setCategory,'name_ar',v)}/><Input label="اسم القسم إنجليزي (اختياري)" value={category.name_en} onChange={v=>update(setCategory,'name_en',v)}/><div className="flex gap-2"><Button disabled={busy} type="submit"><Save size={18}/> حفظ القسم</Button><button type="button" onClick={()=>setCategory(null)}>إلغاء</button></div></form>}</Panel>}
 {tab==='products'&&<Panel title="إدارة الوجبات والأحجام"><Button onClick={()=>editProduct({...blankProduct,category_id:cats[0]?.id||''})}><Plus size={18}/> إضافة وجبة</Button>
 <div className="grid sm:grid-cols-2 gap-3 mt-5">{prods.map(p=><article key={p.id} className="rounded-xl border border-gold p-3 flex gap-3"><img alt="" src={p.image_url} className="w-20 h-20 rounded-lg object-cover"/><div className="flex-1"><strong className="block text-burgundy">{p.name_ar}</strong><small>{cats.find(c=>c.id===p.category_id)?.name_ar}</small><div className="flex gap-2 mt-2"><button onClick={()=>editProduct(p)} className="font-bold underline text-burgundy">تعديل</button><button disabled={busy} onClick={()=>deleteProduct(p)} className="font-bold underline text-red-800">حذف نهائي</button></div></div></article>)}</div>
 {product&&<form className="grid gap-3 border-t border-gold mt-5 pt-5" onSubmit={e=>{e.preventDefault();saveProduct();}}><h3 className="font-bold text-burgundy text-xl">{product.id?'تعديل وجبة':'وجبة جديدة'}</h3><div className="grid sm:grid-cols-2 gap-3"><Input required label="اسم الوجبة بالعربي" value={product.name_ar} onChange={v=>update(setProduct,'name_ar',v)}/><Input label="الاسم الإنجليزي (اختياري)" value={product.name_en} onChange={v=>update(setProduct,'name_en',v)}/></div>
 <div className="grid sm:grid-cols-2 gap-3"><Input label="الوصف العربي" value={product.description_ar} onChange={v=>update(setProduct,'description_ar',v)}/><Input label="الوصف الإنجليزي (اختياري)" value={product.description_en} onChange={v=>update(setProduct,'description_en',v)}/></div>
 <label className="font-bold text-sm text-burgundy">القسم<select className={field} value={product.category_id} onChange={e=>update(setProduct,'category_id',e.target.value)} required>{cats.map(c=><option key={c.id} value={c.id}>{c.name_ar}</option>)}</select></label>
 <label className="flex gap-2 items-center font-bold"><input type="checkbox" checked={!!product.featured} onChange={e=>update(setProduct,'featured',e.target.checked)}/> إظهار ضمن الوجبات المميزة</label>
 <div className="flex items-center gap-3 flex-wrap"><img className="w-28 h-24 rounded-lg object-cover border border-gold" src={productPreview||product.image_url} alt="صورة الوجبة"/><label className="font-bold text-burgundy cursor-pointer flex items-center gap-2"><ImagePlus size={19}/> اختيار صورة (تُرفع عند الحفظ)<input className="block mt-2 text-sm" type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={e=>setPendingProductFile(e.target.files?.[0]||null)}/></label></div>
 <h4 className="font-bold text-burgundy">الأحجام (اختيارية؛ لو ما فيش أحجام استخدم السعر الواحد)</h4>{!sizes.length&&<Input label="السعر الأساسي بالريال" type="number" step="0.01" min="0" value={product.price??0} onChange={v=>update(setProduct,'price',v)}/>}
 {sizes.map((s,i)=><div key={i} className="grid sm:grid-cols-[1fr_1fr_110px_auto] gap-2 items-end p-3 rounded-lg border border-gold/60"><Input label="الحجم عربي" required value={s.label_ar} onChange={v=>setSizes(a=>a.map((x,j)=>j===i?{...x,label_ar:v}:x))}/><Input label="الحجم إنجليزي" value={s.label_en} onChange={v=>setSizes(a=>a.map((x,j)=>j===i?{...x,label_en:v}:x))}/><Input label="السعر" type="number" step="0.01" min="0" value={s.price} onChange={v=>setSizes(a=>a.map((x,j)=>j===i?{...x,price:v}:x))}/><button type="button" className="p-2 text-red-800" onClick={()=>setSizes(a=>a.filter((_,j)=>j!==i))}><Trash2/></button></div>)}
 <button type="button" className="font-bold text-burgundy underline justify-self-start" onClick={()=>setSizes(a=>[...a,{...blankSize}])}>+ إضافة حجم جديد</button>
 <div className="flex gap-2"><Button type="submit" disabled={busy}><Save size={18}/> حفظ الوجبة</Button><button type="button" onClick={()=>{setPendingProductFile(null);setProduct(null);}}>إلغاء</button></div></form>}</Panel>}
 {tab==='contact'&&settings&&<Panel title="أرقام الهاتف وواتساب والشعار"><form className="grid gap-4" onSubmit={e=>{e.preventDefault();saveSettings();}}><div className="grid sm:grid-cols-2 gap-4"><Input label="كود دولة الهاتف (+966)" required value={settings.phone_country_code} onChange={v=>update(setSettings,'phone_country_code',v)}/><Input label="رقم الهاتف بدون كود الدولة" required value={settings.phone_local} onChange={v=>update(setSettings,'phone_local',v)}/><Input label="كود دولة واتساب (+966)" required value={settings.whatsapp_country_code} onChange={v=>update(setSettings,'whatsapp_country_code',v)}/><Input label="رقم واتساب بدون كود الدولة" required value={settings.whatsapp_local} onChange={v=>update(setSettings,'whatsapp_local',v)}/></div><p className="text-sm">رقم الاتصال ورقم واتساب مستقلان تمامًا.</p>
 <div className="grid sm:grid-cols-2 gap-4"><Input label="رمز العملة بالعربي" value={settings.currency_ar} onChange={v=>update(setSettings,'currency_ar',v)}/><Input label="رمز العملة بالإنجليزي" value={settings.currency_en} onChange={v=>update(setSettings,'currency_en',v)}/></div>
 <Input label="رسوم التوصيل (فارغ = يحددها المطعم)" type="number" min="0" step="0.01" value={settings.delivery_fee??''} onChange={v=>update(setSettings,'delivery_fee',v)}/>
 <label className="block font-bold text-burgundy">الوجبة المرتبطة بزر الطلب في الهيرو<select className={field} value={settings.hero_product_id||''} onChange={e=>update(setSettings,'hero_product_id',e.target.value)}><option value="">بدون وجبة محددة</option>{prods.map(p=><option key={p.id} value={p.id}>{p.name_ar}</option>)}</select></label>
 <Input label="اسم الحساب الظاهر على الموقع" value={settings.social_handle} onChange={v=>update(setSettings,'social_handle',v)}/><label className="flex gap-2 items-center font-bold"><input type="checkbox" checked={!!settings.show_social_handle} onChange={e=>update(setSettings,'show_social_handle',e.target.checked)}/> إظهار اسم الحساب على الموقع</label>
 <div className="flex items-center gap-4 flex-wrap"><img src={logoPreview||settings.logo_url} alt="الشعار الحالي" className="w-28 h-28 object-contain bg-burgundy rounded-lg"/><label className="font-bold text-burgundy"><ImagePlus size={18}/> تغيير شعار المطعم (يُرفع عند الحفظ)<input className="block text-sm mt-2" type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={e=>setPendingLogoFile(e.target.files?.[0]||null)}/></label></div>
 <Button disabled={busy} type="submit"><Save size={18}/> حفظ الإعدادات</Button></form></Panel>}
 {tab==='social'&&<Panel title="حسابات التواصل الاجتماعي"><p className="mb-4 font-semibold">لا تظهر أيقونة منصة بدون رابط. اختر من القائمة الجاهزة فقط.</p>
 {socials.map((s,i)=><div key={s.platform} className="grid sm:grid-cols-[170px_1fr_auto] gap-2 items-center mb-3"><strong className="text-burgundy">{s.platform}</strong><input className={field} type="url" required value={s.url} onChange={e=>setSocials(v=>v.map((x,j)=>j===i?{...x,url:e.target.value}:x))}/><button className="text-red-800" onClick={()=>setSocials(a=>a.filter((_,j)=>j!==i))}><Trash2/></button></div>)}
 <div className="flex gap-2 flex-wrap items-center mt-4"><select id="platform-new" className={field+' !w-auto'} defaultValue=""> <option value="">اختار منصة للإضافة</option>{platformChoices.filter(k=>!socials.some(s=>s.platform===k)).map(k=><option key={k} value={k}>{k}</option>)}</select><button className="btn-outline !text-burgundy !border-burgundy" onClick={()=>{const el=document.getElementById('platform-new');if(el.value){setSocials(s=>[...s,{platform:el.value,url:'https://'}]);el.value='';}}}>إضافة</button><Button disabled={busy} onClick={saveSocial}><Save size={18}/> حفظ الروابط</Button></div></Panel>}

 </div></main>;
}
