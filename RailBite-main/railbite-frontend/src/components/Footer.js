import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-logo">
              <span>🍽️</span>
              <h3>RailBite</h3>
            </div>
            <p>Bangladesh Railway Food Service</p>
            <p>Bringing delicious meals to your train journey</p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/order-selection">Order Now</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Us</h4>
            <p>📧 info@railbitebd.com</p>
            <p>📞 +880 1XXX-XXXXXX</p>
            <p>📍 Dhaka, Bangladesh</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 RailBite BD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;