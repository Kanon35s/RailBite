import React, { useState, useEffect } from 'react';  // 👈 add useEffect
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';
import Toast from '../components/Toast';

const OrderTrain = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    passengerName: '',
    phone: '',
    trainNumber: '',
    coachNumber: '',
    seatNumber: ''
  });

  // 👇 THIS IS THE FIX — sync once user loads from AuthContext
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        passengerName: user.name || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);  // runs whenever user changes (null → loaded user)

  const [toast, setToast] = useState(null);
  const { saveOrderType, saveBookingDetails } = useOrder();
  const navigate = useNavigate();

  const coachOptions = ['KA', 'KHA', 'GA', 'GHA', 'UMO', 'CHA', 'SHA', 'JA', 'JHA'];
  const seatOptions = Array.from({ length: 50 }, (_, i) => i + 1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.passengerName ||
      !formData.phone ||
      !formData.trainNumber ||
      !formData.coachNumber ||
      !formData.seatNumber
    ) {
      setToast({ message: 'Please fill in all fields', type: 'error' });
      return;
    }
    saveOrderType('train');
    saveBookingDetails({ ...formData, orderType: 'train' });
    setToast({ message: 'Details saved! Redirecting to menu...', type: 'success' });
    setTimeout(() => {
      navigate('/menu-categories', { state: { orderType: 'train' } });
    }, 1000);
  };

  return (
    <div className="booking-page">
      <BackButton />
      <div className="container">
        <div className="booking-container">
          <div className="booking-header">
            <div className="booking-header-icon">
              <img src="/images/train.png" alt="train" />
            </div>
            <div className="booking-header-text">
              <h2>Order from Train</h2>
              <p>Enter your journey details</p>
            </div>
          </div>

          <form className="booking-form" onSubmit={handleSubmit}>

            {/* Hidden — auto-filled from login info */}
            <input type="hidden" name="passengerName" value={formData.passengerName} />
            <input type="hidden" name="phone" value={formData.phone} />

            <div className="form-group">
              <label>Train Number</label>
              <input
                type="text"
                name="trainNumber"
                value={formData.trainNumber}
                onChange={handleChange}
                placeholder="e.g., 701 Suborna Express"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Coach Number</label>
                <select name="coachNumber" value={formData.coachNumber} onChange={handleChange} required>
                  <option value="">Select Coach</option>
                  {coachOptions.map((coach) => (
                    <option key={coach} value={coach}>{coach}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Seat Number</label>
                <select name="seatNumber" value={formData.seatNumber} onChange={handleChange} required>
                  <option value="">Select Seat</option>
                  {seatOptions.map((seat) => (
                    <option key={seat} value={seat}>{seat}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Continue to Menu
            </button>
          </form>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default OrderTrain;
