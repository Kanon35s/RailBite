import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/layout/BackButton';

function OrderSelection() {
  const navigate = useNavigate();

  return (
    <div className="order-selection-page">
      <BackButton />
      <div className="container">
        <div className="selection-container">
          <h1 className="selection-title">How would you like to order?</h1>
          <p className="selection-subtitle">Choose your preferred ordering method</p>

          <div className="selection-grid">
            <div className="selection-card" onClick={() => navigate('/order-train')}>
              <div className="selection-icon">🚂</div>
              <h3>Order from Train</h3>
              <p>Traveling on a train? Get food delivered directly to your seat. Enter your PNR number and seat details to start ordering.</p>
              <button className="btn btn-primary">Order from Train</button>
            </div>

            <div className="selection-card" onClick={() => navigate('/order-station')}>
              <div className="selection-icon">🏢</div>
              <h3>Order from Station</h3>
              <p>At a railway station? Order from nearby vendors and pick up your food when it's ready. Quick and convenient!</p>
              <button className="btn btn-primary">Order from Station</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSelection;
