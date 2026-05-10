import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import des composants globaux
import Header from './components/Header';
import Footer from './components/Footer';

// Import des pages
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import NotFound from './pages/NotFound';
import AboutPage  from './pages/AboutPage';
import FavoritePage from'./pages/FavoritePage';
import AdminDashboard from './pages/AdminDashboard';
function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Le Header s'affichera sur toutes les pages */}
        <Header />

        <main className="main-content">
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/favorites" element={<FavoritePage />} />
            {/* Routes privées (exemple) */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Page 404 - Doit toujours être en dernier */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Le Footer s'affichera sur toutes les pages */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;