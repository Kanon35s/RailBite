import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function OrderSuccess() {
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const order = JSON.parse(localStorage.getItem('railbiteOrder'));
    setOrderDetails(order);
  }, []);

  return (
    <div className="status-page">
      <div className="status-container">
        <div className="status-icon success">✓</div>
        <h1 className="status-title">Order Placed Successfully!</h1>
        <p className="status-message">
          Thank you for your order! Your delicious food is being prepared.
        </p>

        {orderDetails && (
          <div className="order-info">
            <p><strong>Order ID:</strong> <span className="order-number">{orderDetails.orderId}</span></p>
            <p><strong>Total Amount:</strong> ৳{orderDetails.total}</p>
            <p><strong>Payment Method:</strong> {orderDetails.paymentMethod?.toUpperCase()}</p>
          </div>
        )}

        <p className="status-message">
          You will receive a confirmation SMS shortly with your order details and estimated delivery time.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
          <Link to="/profile" className="btn btn-secondary">View Orders</Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
