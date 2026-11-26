import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import App from './App';
import { AppProvider } from './context/AppContext';
import { ShopProvider } from './context/ShopContext';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <ShopProvider><AppProvider><App /></AppProvider></ShopProvider>
      </MotionConfig>
    </BrowserRouter>
  </React.StrictMode>
);
