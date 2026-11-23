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

export default function App() {
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
