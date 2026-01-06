import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-wrapper">
          {/* Custom Logo Image */}
          <div className="logo" onClick={handleLogoClick}>
            <img 
              src="/images/logo.png" 
              alt="RailBite Logo" 
              style={{ width: '135px', height: '45px', objectFit: 'contain', cursor: 'pointer' }}
            />
          </div>

          {/* Navigation Menu */}
          <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`} id="navMenu">
            <li>
              <Link to="/" className={isActive('/') ? 'active' : ''}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className={isActive('/about') ? 'active' : ''}>
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>
                Contact
              </Link>
            </li>
            {!isAuthenticated() && (
              <li id="authNavItem">
                <Link to="/login" className="btn-nav-orange">Login / Register</Link>
              </li>
            )}
          </ul>

          {/* Right Side Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {isAuthenticated() && (
              <>
                {/* Notification Bell */}
                <NotificationBell />

                {/* Custom Shopping Cart Icon */}
                <div 
                  className="cart-icon" 
                  onClick={() => navigate('/cart')}
                  style={{ position: 'relative', cursor: 'pointer' }}
                >
                  <img 
                    src="/images/shopping-cart.png" 
                    alt="Cart" 
                    style={{ 
                      width: '28px', 
                      height: '28px', 
                      objectFit: 'contain'
                    }}
                  />
                  {getCartCount() > 0 && (
                    <span className="cart-badge" id="cartCount">{getCartCount()}</span>
                  )}
                </div>

                {/* Custom Profile Icon */}
                <div 
                  className="user-icon" 
                  id="profileIcon"
                  onClick={() => navigate('/profile')}
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src="/images/profile.png" 
                    alt="Profile" 
                    style={{ 
                      width: '28px', 
                      height: '28px', 
                      objectFit: 'contain'
                    }}
                  />
                </div>
              </>
            )}

            {/* Hamburger Menu */}
            <div 
              className={`hamburger ${mobileMenuOpen ? 'active' : ''}`} 
              id="hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;