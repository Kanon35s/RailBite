import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import BackButton from '../components/layout/BackButton';

function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile-page">
      <BackButton />
      <div className="container">
        <div className="profile-container">
          <div className="profile-sidebar">
            <div className="profile-avatar">👤</div>
            <h2 className="profile-name">{user.name}</h2>
            <button className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
              Edit Profile
            </button>
            <button 
              className="btn btn-secondary btn-sm" 
              style={{ marginTop: '0.5rem' }}
              onClick={handleLogout}
            >
              Logout
            </button>

            <div className="profile-info">
              <div className="profile-info-item">
                <span>📧</span>
                <span>{user.email}</span>
              </div>
              <div className="profile-info-item">
                <span>📞</span>
                <span>{user.phone}</span>
              </div>
              <div className="profile-info-item">
                <span>📅</span>
                <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-section">
              <h3><span>📊</span> Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <p className="stat-label">Total Orders</p>
                  <p className="stat-value">12</p>
                </div>
                <div className="stat-item">
                  <p className="stat-label">Total Spent</p>
                  <p className="stat-value">৳3,450</p>
                </div>
                <div className="stat-item">
                  <p className="stat-label">Favorite Item</p>
                  <p className="stat-value" style={{ fontSize: '1.2rem' }}>🍛 Biryani</p>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3><span>📦</span> Recent Orders</h3>
              <div className="order-list">
                <div className="order-item">
                  <div className="order-header">
                    <span className="order-id">#ORD-123456</span>
                    <span className="order-status delivered">Delivered</span>
                  </div>
                  <p className="order-date">December 20, 2025</p>
                  <p className="order-items">Bengali Biryani, Chicken Shwarma</p>
                  <div className="order-footer">
                    <span className="order-total">৳370</span>
                    <button className="btn-view-details">View Details</button>
                  </div>
                </div>

                <div className="order-item">
                  <div className="order-header">
                    <span className="order-id">#ORD-123455</span>
                    <span className="order-status delivered">Delivered</span>
                  </div>
                  <p className="order-date">December 18, 2025</p>
                  <p className="order-items">Classic King Burger, Mango Smoothie</p>
                  <div className="order-footer">
                    <span className="order-total">৳280</span>
                    <button className="btn-view-details">View Details</button>
                  </div>
                </div>
              </div>
              <button className="btn-view-all">View All Orders</button>
            </div>

            <div className="profile-section">
              <h3><span>🚂</span> Saved Trains</h3>
              <div className="train-list">
                <div className="train-item">
                  <p className="train-name">Suborno Express (701)</p>
                  <p className="train-details">Dhaka → Chittagong | Coach: A1, Seat: 12</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
