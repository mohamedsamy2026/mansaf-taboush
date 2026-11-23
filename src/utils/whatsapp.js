import {restaurant} from '../config/restaurant';
const money=(n,lang)=>`${n.toLocaleString(lang==='ar'?'ar-EG':'en-US')} ${lang==='ar'?'ج.م':'EGP'}`;
export function whatsappUrl(items,details,lang){
 const ar=lang==='ar';const text=[];
 text.push(ar?'مرحبًا منسف طبوش،\nأرغب في تقديم الطلب التالي (بانتظار تأكيد المطعم):':'Hello Mansaf Taboush,\nI would like to request the following order (pending restaurant confirmation):');
 text.push(ar?'\nتفاصيل الطلب:':'\nOrder details:');
 items.forEach((item,i)=>{text.push(`${i+1}. ${item.product.name[lang]}`);if(item.size)text.push(`${ar?'الحجم':'Size'}: ${item.size[lang]}`);text.push(`${ar?'الكمية':'Quantity'}: ${item.qty}`);text.push(`${ar?'السعر التجريبي':'Demo price'}: ${money(item.unit*item.qty,lang)}`)});
 const subtotal=items.reduce((s,i)=>s+i.unit*i.qty,0);text.push(`\n--------------------\n${ar?'الإجمالي المبدئي (بدون رسوم التوصيل)':'Estimated subtotal (delivery not included)'}: ${money(subtotal,lang)}`);
 text.push(ar?'الأسعار تجريبية وتحتاج تأكيد المطعم.':'Prices are demo values and need restaurant confirmation.');
 text.push(`\n${ar?'بيانات العميل':'Customer details'}:`);
 const fields=ar?{name:'الاسم',phone:'رقم الهاتف',area:'المدينة / المنطقة',address:'عنوان التوصيل',building:'مبنى / شقة',map:'رابط الموقع',date:'تاريخ التوصيل المطلوب',time:'وقت التوصيل المطلوب',notes:'ملاحظات'}:{name:'Name',phone:'Phone',area:'City / Area',address:'Delivery address',building:'Building / Apartment',map:'Map link',date:'Requested date',time:'Requested time',notes:'Notes'};
 for(const [key,label] of Object.entries(fields)){if(details[key]?.trim())text.push(`${label}: ${details[key].trim()}`)}
 text.push(ar?'\nيرجى تأكيد الطلب والسعر النهائي ورسوم التوصيل وإمكانية التوصيل والموعد. شكرًا لكم.':'\nPlease confirm the order, final price, delivery fee, availability, and delivery time. Thank you.');
 return `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(text.join('\n'))}`;
}
