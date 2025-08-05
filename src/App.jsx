import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import { OrdersProvider } from './context/OrdersContext';
import Register from './pages/Register';
// import AdminDashboard from './pages/AdminDashboard';
import WishlistPage from './pages/Wishlist';
import { WishlistProvider } from './context/WishlistContext';
import { ProductsProvider } from './context/ProductsContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import OrdersPage from './pages/OrdersPage';
import OrderDetails from './pages/OrderDetails';
import { CartProvider } from './context/CartContext';
import Products from './pages/Products';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ProfilePage from './pages/ProfilePage';
import TermsOfService from './pages/TermsOfService';
import AdminDashboard from './pages/AdminDashboard';


import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ProductsProvider>
            <OrdersProvider>
              <div className="app">
                <Navbar />
                <main className="main-content">
                  <Routes>
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="/" element={<Home />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />

                    <Route 
                      path="/admin/dashboard" 
                      element={
                        <ProtectedRoute adminOnly>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/order-confirmation" 
                      element={
                        <ProtectedRoute>
                          <OrderConfirmation />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/orders" 
                      element={
                        <ProtectedRoute>
                          <OrdersPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/orders/:id" 
                      element={
                        <ProtectedRoute>
                          <OrderDetails />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/checkout" 
                      element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                </main>
                <Footer />
              </div>
            </OrdersProvider>
          </ProductsProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
