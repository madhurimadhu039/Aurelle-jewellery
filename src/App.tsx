import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';

import { HomePage } from './pages/HomePage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { ComparePage } from './pages/ComparePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { AccountPage } from './pages/AccountPage';
import { PayDuePage } from './pages/PayDuePage';
import { SchemePage } from './pages/SchemePage';
import { LedgerPage } from './pages/LedgerPage';
import { PassportPage } from './pages/PassportPage';
import { AddExistingPage } from './pages/AddExistingPage';
import { TryOnPage } from './pages/TryOnPage';
import { AdminPage } from './pages/AdminPage';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isAuthPage = 
    location.pathname === '/account' || 
    location.pathname === '/signup' || 
    location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col bg-[#090806] text-[#F7F1E7]">
      {/* Navbar is hidden on signup / login / account page */}
      {!isAuthPage && <Navbar />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/signup" element={<AccountPage />} />
          <Route path="/login" element={<AccountPage />} />
          <Route path="/pay-due" element={<PayDuePage />} />
          <Route path="/schemes" element={<SchemePage />} />
          <Route path="/ledger" element={<LedgerPage />} />
          <Route path="/passport" element={<PassportPage />} />
          <Route path="/add-existing" element={<AddExistingPage />} />
          <Route path="/try-on" element={<TryOnPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer is displayed ONLY on the landing page (homepage), not in any other pages */}
      {isLandingPage && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <AppLayout />
      </Router>
    </AppProvider>
  );
};

export default App;
