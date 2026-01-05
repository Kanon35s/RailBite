import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/layout/BackButton';

function OrderTrain() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pnr: '',
    trainName: '',
    trainNumber: '',
    coach: '',
    seat: '',
    date: '',
    from: '',
    to: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('railbiteOrder', JSON.stringify({
      orderType: 'train',
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
            <div className="booking-header-icon">🚂</div>
            <div className="booking-header-text">
              <h2>Order from Train</h2>
              <p>Enter your train journey details</p>
            </div>
          </div>

          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>PNR Number *</label>
              <input 
                type="text" 
                required
                value={formData.pnr}
                onChange={(e) => setFormData({...formData, pnr: e.target.value})}
                placeholder="Enter your 10-digit PNR"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Train Name *</label>
                <input 
                  type="text" 
                  required
                  value={formData.trainName}
                  onChange={(e) => setFormData({...formData, trainName: e.target.value})}
                  placeholder="e.g., Suborno Express"
                />
              </div>
              <div className="form-group">
                <label>Train Number *</label>
                <input 
                  type="text" 
                  required
                  value={formData.trainNumber}
                  onChange={(e) => setFormData({...formData, trainNumber: e.target.value})}
                  placeholder="e.g., 701"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Coach *</label>
                <input 
                  type="text" 
                  required
                  value={formData.coach}
                  onChange={(e) => setFormData({...formData, coach: e.target.value})}
                  placeholder="e.g., A1"
                />
              </div>
              <div className="form-group">
                <label>Seat Number *</label>
                <input 
                  type="text" 
                  required
                  value={formData.seat}
                  onChange={(e) => setFormData({...formData, seat: e.target.value})}
                  placeholder="e.g., 12"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Journey Date *</label>
              <input 
                type="date" 
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>From Station *</label>
                <input 
                  type="text" 
                  required
                  value={formData.from}
                  onChange={(e) => setFormData({...formData, from: e.target.value})}
                  placeholder="e.g., Dhaka"
                />
              </div>
              <div className="form-group">
                <label>To Station *</label>
                <input 
                  type="text" 
                  required
                  value={formData.to}
                  onChange={(e) => setFormData({...formData, to: e.target.value})}
                  placeholder="e.g., Chittagong"
                />
              </div>
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

export default OrderTrain;
