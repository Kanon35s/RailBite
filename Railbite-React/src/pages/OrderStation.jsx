import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/layout/BackButton';

function OrderStation() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    station: '',
    pickupTime: '',
    date: ''
  });

  const stations = [
    'Dhaka (Kamalapur)',
    'Chittagong',
    'Sylhet',
    'Rajshahi',
    'Khulna',
    'Comilla',
    'Mymensingh',
    'Rangpur',
    'Dinajpur',
    'Jessore'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('railbiteOrder', JSON.stringify({
      orderType: 'station',
      ...formData
    }));
    navigate('/menu-categories');
  };

  return (
    <div className="booking-page">
      <BackButton />
      <div className="container">
        <div className="booking-container">
          <div className="booking-header">
            <div className="booking-header-icon">🏢</div>
            <div className="booking-header-text">
              <h2>Order from Station</h2>
              <p>Select your station and pickup time</p>
            </div>
          </div>

          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Station *</label>
              <select 
                required
                value={formData.station}
                onChange={(e) => setFormData({...formData, station: e.target.value})}
              >
                <option value="">Choose a station</option>
                {stations.map(station => (
                  <option key={station} value={station}>{station}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Pickup Date *</label>
              <input 
                type="date" 
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Pickup Time *</label>
              <input 
                type="time" 
                required
                value={formData.pickupTime}
                onChange={(e) => setFormData({...formData, pickupTime: e.target.value})}
              />
            </div>

            <div style={{ 
              background: 'rgba(255, 140, 66, 0.1)', 
              padding: '1rem', 
              borderRadius: '10px', 
              marginTop: '1rem',
              border: '1px solid var(--border-orange)'
            }}>
              <p style={{ color: 'var(--text-gray)', fontSize: '0.9rem' }}>
                📍 Your food will be ready for pickup at the selected time. Please arrive 5-10 minutes before your pickup time.
              </p>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Continue to Menu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OrderStation;
