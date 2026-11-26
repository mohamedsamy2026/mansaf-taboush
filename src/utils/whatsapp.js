import { WHATSAPP_NUMBER, DELIVERY_FEE } from '../config/restaurant';
import { getProduct, unitPrice, labelFor } from '../data/products';
import { money } from './format';

export const lineTotal = (item) => { const p = getProduct(item.productId); return p ? unitPrice(p,item.sizeId) * item.qty : 0; };
export const subtotalOf = (items) => items.reduce((s, i) => s + lineTotal(i), 0);

export const waLink = (text = '') =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export function buildOrderMessage(lang, items, customer) {
  const ar = lang === 'ar';
  const L = ar
    ? { hi: 'مرحبًا منسف طبوش،', intro: 'أرغب في تأكيد الطلب التالي:', det: 'تفاصيل الطلب:', size: 'الحجم', qty: 'الكمية', price: 'السعر',
        total: 'الإجمالي المبدئي', fee: DELIVERY_FEE == null ? '(لا يشمل رسوم التوصيل غير المؤكدة)' : '', cust: 'بيانات العميل:',
        name: 'الاسم', phone: 'رقم الهاتف', addr: 'عنوان التوصيل', map: 'رابط الموقع', when: 'موعد التوصيل المطلوب', notes: 'ملاحظات',
        none: 'غير محدد', end: 'يرجى تأكيد الطلب ورسوم التوصيل والإجمالي النهائي وموعد التسليم.', thanks: 'شكرًا لكم.' }
    : { hi: 'Hello Mansaf Taboush,', intro: 'I would like to place the following order:', det: 'Order details:', size: 'Size', qty: 'Quantity', price: 'Price',
        total: 'Preliminary total', fee: DELIVERY_FEE == null ? '(excludes unconfirmed delivery fee)' : '', cust: 'Customer details:',
        name: 'Name', phone: 'Phone', addr: 'Delivery address', map: 'Location link', when: 'Requested delivery time', notes: 'Notes',
        none: 'Not specified', end: 'Please confirm the order, delivery fee, final total and delivery time.', thanks: 'Thank you.' };

  const lines = items.map((it, i) => {
    const p = getProduct(it.productId);
    const size = p.sizes ? p.sizes.find((s) => s.id === it.sizeId) || p.sizes[0] : null;
    return [`${i + 1}. ${labelFor(p.name,lang)}`, size && `${L.size}: ${labelFor(size.label,lang)}`, `${L.qty}: ${it.qty}`, `${L.price}: ${money(lineTotal(it), lang)}`]
      .filter(Boolean).join('\n');
  });
  const sub = subtotalOf(items);
  const total = DELIVERY_FEE == null ? sub : sub + DELIVERY_FEE;
  const when = [customer.date, customer.time].filter(Boolean).join(' ') || L.none;
  return [
    L.hi, '', L.intro, '', L.det, '', lines.join('\n\n'), '', '--------------------',
    `${L.total}: ${money(total, lang)} ${L.fee}`.trim(), '', L.cust, '',
    `${L.name}: ${customer.name}`, `${L.phone}: ${customer.phone}`,
    `${L.addr}: ${[customer.city, customer.street, customer.building].filter(Boolean).join(' - ')}`,
    customer.mapLink && `${L.map}: ${customer.mapLink}`,
    `${L.when}: ${when}`, `${L.notes}: ${customer.notes || '-'}`, '', L.end, '', L.thanks,
  ].filter((x) => x !== undefined && x !== false && x !== null).join('\n');
}

// Must be called directly from a click handler. Never marks the order "sent".
export const openWhatsApp = (text) => window.open(waLink(text), '_blank', 'noopener,noreferrer');
