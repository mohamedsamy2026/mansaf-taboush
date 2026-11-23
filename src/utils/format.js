import { CURRENCY } from '../config/restaurant';
export const money = (n, lang) => `${new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US').format(n)} ${CURRENCY[lang]}`;
