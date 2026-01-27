import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const lastOrder = localStorage.getItem('railbiteLastOrder');
    if (lastOrder) {
      setOrder(JSON.parse(lastOrder));
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!order) return null;

  return (
    <div className="status-page">
      <div className="status-container">
        <div className="status-icon success">✓</div>
        <h1 className="status-title">Order Placed Successfully!</h1>
        <p className="status-message">
          Thank you for your order. You'll receive a confirmation SMS shortly.
        </p>

        <div className="order-info">
          <p style={{ color: 'var(--text-gray)', marginBottom: '0.5rem' }}>Order Number</p>
          <p className="order-number">{order.id}</p>
          <p style={{ color: 'var(--text-gray)', marginTop: '1rem', marginBottom: '0.5rem' }}>
            Estimated Delivery
          </p>
          <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>30-45 minutes to your seat</p>
        </div>

        <Link to="/" className="btn btn-primary btn-block">
          Order Again
        </Link>
        <Link 
          to="/order-history" 
          className="btn btn-secondary btn-block"
          style={{ marginTop: '1rem' }}
        >
          View Order History
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;