import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollManager from './components/layout/ScrollManager';
import CartDrawer from './components/cart/CartDrawer';
import OrderModal from './components/checkout/OrderModal';
import Home from './pages/Home';
import MenuPage from './pages/MenuPage';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import NotFound from './pages/NotFound';
import { useShop } from './context/ShopContext';
import AdminPage from './pages/AdminPage';

export default function App() {
  const { loading, error, refresh } = useShop();
  if (window.location.pathname.startsWith('/admin')) return <AdminPage />;
  if (loading) return <div className="min-h-screen parchment flex items-center justify-center text-burgundy font-bold" dir="rtl">جاري تحميل قائمة المطعم...</div>;
  if (error) return <div className="min-h-screen parchment flex flex-col items-center justify-center gap-4 text-burgundy font-bold" dir="rtl"><p>تعذر تحميل بيانات المطعم: {error}</p><button className="btn-burgundy" onClick={refresh}>إعادة المحاولة</button></div>;
  return (
    <>
      <ScrollManager /><Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} /><Route path="/menu" element={<MenuPage />} /><Route path="/about" element={<AboutPage />} />
          <Route path="/cart" element={<CartPage />} /><Route path="/checkout" element={<CheckoutPage />} /><Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer /><CartDrawer /><OrderModal />
    </>
  );
}
