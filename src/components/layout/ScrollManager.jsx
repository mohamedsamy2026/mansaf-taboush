import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
export default function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return; }
    const id = hash.slice(1);
    let tries = 0;
    const go = () => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); else if (tries++ < 10) setTimeout(go, 60); };
    go();
  }, [pathname, hash]);
  return null;
}
