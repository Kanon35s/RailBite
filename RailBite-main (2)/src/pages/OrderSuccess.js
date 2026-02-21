import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const OrderSuccess = () => {
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // First try navigation state (from Checkout redirect)
    if (location.state?.orderId) {
      setOrderId(location.state.orderId);
      return;
    }

    // Fallback: try localStorage
    const lastOrder = localStorage.getItem('railbiteLastOrder');
    if (lastOrder) {
      const parsed = JSON.parse(lastOrder);
      setOrderId(parsed.orderNumber || parsed.orderId || parsed.id);
      return;
    }

    // Nothing found, go home
    navigate('/');
  }, [location, navigate]);

  if (!orderId) return null;

  return (
    <div className="status-page">
      <div className="status-container">
        <div className="status-icon success">✓</div>
        <h1 className="status-title">Order Placed Successfully!</h1>
        <p className="status-message">
          Thank you for your order. You'll receive a confirmation shortly.
        </p>

        <div className="order-info">
          <p style={{ color: 'var(--text-gray)', marginBottom: '0.5rem' }}>
            Order Number
          </p>
          <p className="order-number">{orderId}</p>
          <p style={{ color: 'var(--text-gray)', marginTop: '1rem', marginBottom: '0.5rem' }}>
            Estimated Delivery
          </p>
          <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>
            30-45 minutes to your seat
          </p>
        </div>

        <Link
          to={`/order-tracking/${orderId}`}
          className="btn btn-primary btn-block"
        >
          🚚 Track My Order
        </Link>
        <Link
          to="/order-history"
          className="btn btn-secondary btn-block"
          style={{ marginTop: '1rem' }}
        >
          📋 View Order History
        </Link>
        <Link
          to="/"
          className="btn btn-secondary btn-block"
          style={{ marginTop: '1rem' }}
        >
          🏠 Back to Home
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
