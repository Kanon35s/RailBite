import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';

function Navbar() {
  const { getCartCount } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-wrapper">
          <Link to="/" className="logo">
            <span>🍽️</span>
            <span>RailBite BD</span>
          </Link>

          <div className={`nav-menu ${menuOpen ? 'active' : ''}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/menu-categories" onClick={() => setMenuOpen(false)}>Menu</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
            
            {user ? (
              <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
            ) : (
              <Link to="/login" className="btn-nav-orange" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            )}

            <div className="cart-icon" onClick={() => { navigate('/cart'); setMenuOpen(false); }}>
              🛒
              {getCartCount() > 0 && (
                <span className="cart-badge" id="cartCount">
                  {getCartCount()}
                </span>
              )}
            </div>
          </div>

          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
