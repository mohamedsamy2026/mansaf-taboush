import { Youtube, Instagram, Facebook, Send, Ghost } from 'lucide-react';
import { SOCIAL_LINKS } from '../../config/restaurant';
import { useShop } from '../../context/ShopContext';

const Tik = (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M16.6 3c.3 2.4 1.7 3.8 4 4v3.1c-1.5.1-2.8-.4-4-1.200v6.100c0 3.300-2.300 5.600-5.400 5.600A5.500 5.500 0 0 1 5.800 15c0-3.100 2.500-5.600 5.700-5.400v3.200c-1.500-.3-2.600.8-2.600 2.200 0 1.300 1 2.300 2.300 1.500 0 2.400-1 2.400-2.600V3z"/></svg>;
const XIcon = (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M17.800 3h3L14.200 10.500 22 21h-6.100l-4.800-6.300L5.600 21h-3l7.100-8L2.200 3h6.200l4.300 5.700L17.800 3zm-1.100 16.200h1.700L7.400 4.700H5.600l11.100 14.500z"/></svg>;
const list = [['youtube', Youtube, 'YouTube'], ['instagram', Instagram, 'Instagram'], ['tiktok', Tik, 'TikTok'], ['x', XIcon, 'X'], ['facebook', Facebook, 'Facebook'], ['telegram', Send, 'Telegram'], ['snapchat', Ghost, 'Snapchat']];
export default function Social({ size = 'w-10 h-10' }) {
  useShop();
  return <ul className="flex gap-2.5" dir="ltr">
    {list.filter(([key]) => SOCIAL_LINKS[key]).map(([key, Icon, name]) => <li key={key}>
      <a href={SOCIAL_LINKS[key]} target="_blank" rel="noopener noreferrer" aria-label={name} className={`grid place-items-center ${size} rounded-full bg-gold text-burgundy-deep hover:brightness-110 transition`}><Icon className="w-5 h-5"/></a>
    </li>)}
  </ul>;
}
