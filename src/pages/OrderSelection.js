import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';

const OrderSelection = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="order-selection-page">
      <BackButton />

      {/* Order Selection Cards */}
      <div className="container">
        <div className="selection-container">
          <h1 className="selection-title">Choose Your Ordering Option</h1>
          <p className="selection-subtitle">Select how you'd like to receive your food</p>

          <div className="selection-grid">
            {/* Order from Train Card */}
            <div 
              className="selection-card"
              onClick={() => navigate('/order-train')}
            >
              <div className="selection-icon"><img src="/images/train.png" alt="train" /></div>
              <h3>Order from Train</h3>
              <p>
                Get food prepared and served by onboard train services directly to your seat
              </p>
              <button className="btn btn-primary">Select</button>
            </div>

            {/* Order from Station Card */}
            <div 
              className="selection-card"
              onClick={() => navigate('/order-station')}
            >
              <div className="selection-icon"><img src="/images/station.png" alt="station" /></div>
              <h3>Order from Station</h3>
              <p>
                Get food from verified restaurants and vendors at selected railway stations
              </p>
              <button className="btn btn-primary">Select</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSelection;