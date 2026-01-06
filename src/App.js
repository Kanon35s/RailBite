import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';


// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OrderSelection from './pages/OrderSelection';
import OrderTrain from './pages/OrderTrain';
import OrderStation from './pages/OrderStation';
import MenuCategories from './pages/MenuCategories';


// Main Category Pages
import BreakfastMenu from './pages/BreakfastMenu';
import LunchMenu from './pages/LunchMenu';
import SnacksMenu from './pages/SnacksMenu';
import DinnerMenu from './pages/DinnerMenu';


// Submenu Pages
import ShwarmaMenu from './pages/ShwarmaMenu';
import PizzaMenu from './pages/PizzaMenu';
import BurgerMenu from './pages/BurgerMenu';
import SmoothieMenu from './pages/SmoothieMenu';
import BeverageMenu from './pages/BeverageMenu';


import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import OrderDetails from './pages/OrderDetails';
import OrderTracking from './pages/OrderTracking';
import About from './pages/About';
import Contact from './pages/Contact';


// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <div className="App">
              <Navbar />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />


                {/* Protected Routes */}
                <Route path="/order-selection" element={<ProtectedRoute><OrderSelection /></ProtectedRoute>} />
                <Route path="/order-train" element={<ProtectedRoute><OrderTrain /></ProtectedRoute>} />
                <Route path="/order-station" element={<ProtectedRoute><OrderStation /></ProtectedRoute>} />
                <Route path="/menu-categories" element={<ProtectedRoute><MenuCategories /></ProtectedRoute>} />


                {/* Main Category Menus */}
                <Route path="/breakfast-menu" element={<ProtectedRoute><BreakfastMenu /></ProtectedRoute>} />
                <Route path="/lunch-menu" element={<ProtectedRoute><LunchMenu /></ProtectedRoute>} />
                <Route path="/snacks-menu" element={<ProtectedRoute><SnacksMenu /></ProtectedRoute>} />
                <Route path="/dinner-menu" element={<ProtectedRoute><DinnerMenu /></ProtectedRoute>} />


                {/* Submenu Pages */}
                <Route path="/shwarma-menu" element={<ProtectedRoute><ShwarmaMenu /></ProtectedRoute>} />
                <Route path="/pizza-menu" element={<ProtectedRoute><PizzaMenu /></ProtectedRoute>} />
                <Route path="/burger-menu" element={<ProtectedRoute><BurgerMenu /></ProtectedRoute>} />
                <Route path="/smoothie-menu" element={<ProtectedRoute><SmoothieMenu /></ProtectedRoute>} />
                <Route path="/beverage-menu" element={<ProtectedRoute><BeverageMenu /></ProtectedRoute>} />


                {/* Cart & Checkout */}
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                
                {/* Profile & Orders */}
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/order-history" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
                <Route path="/order-details/:orderId" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
                <Route path="/order-tracking/:orderId" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
              </Routes>
              <Footer />
            </div>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}


export default App;
