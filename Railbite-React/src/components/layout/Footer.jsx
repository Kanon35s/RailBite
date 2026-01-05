import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-logo">
              <span style={{ fontSize: '2rem' }}>🍽️</span>
              <h3>RailBite BD</h3>
            </div>
            <p>Bringing delicious food to your train journey across Bangladesh.</p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu-categories">Menu</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><Link to="/order-selection">Order Now</Link></li>
              <li><Link to="/profile">My Orders</Link></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#help">Help Center</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Info</h4>
            <p>📞 +880 1712-345678</p>
            <p>✉️ support@railbitebd.com</p>
            <p>📍 Dhaka, Bangladesh</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 RailBite BD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
