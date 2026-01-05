import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Toast from './components/common/Toast';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OrderSelection from './pages/OrderSelection';
import OrderTrain from './pages/OrderTrain';
import OrderStation from './pages/OrderStation';
import OrderSuccess from './pages/OrderSuccess';
import MenuCategories from './pages/MenuCategories';

// Menu Pages
import BiryaniMenu from './pages/menu/BiryaniMenu';
import BurgerMenu from './pages/menu/BurgerMenu';
import PizzaMenu from './pages/menu/PizzaMenu';
import ShwarmaMenu from './pages/menu/ShwarmaMenu';
import BreakfastMenu from './pages/menu/BreakfastMenu';
import LunchMenu from './pages/menu/LunchMenu';
import DinnerMenu from './pages/menu/DinnerMenu';
import DrinksMenu from './pages/menu/DrinksMenu';
import SmoothieMenu from './pages/menu/SmoothieMenu';
import SnacksMenu from './pages/menu/SnacksMenu';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Toast />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/order-selection" element={<OrderSelection />} />
              <Route path="/order-train" element={<OrderTrain />} />
              <Route path="/order-station" element={<OrderStation />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/menu-categories" element={<MenuCategories />} />
              
              {/* Menu Routes */}
              <Route path="/menu/biryani" element={<BiryaniMenu />} />
              <Route path="/menu/burger" element={<BurgerMenu />} />
              <Route path="/menu/pizza" element={<PizzaMenu />} />
              <Route path="/menu/shwarma" element={<ShwarmaMenu />} />
              <Route path="/menu/breakfast" element={<BreakfastMenu />} />
              <Route path="/menu/lunch" element={<LunchMenu />} />
              <Route path="/menu/dinner" element={<DinnerMenu />} />
              <Route path="/menu/drinks" element={<DrinksMenu />} />
              <Route path="/menu/smoothie" element={<SmoothieMenu />} />
              <Route path="/menu/snacks" element={<SnacksMenu />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
