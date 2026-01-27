import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import BackButton from '../components/BackButton';

const Profile = () => {
  const { user, logout } = useAuth();
  const { orderHistory } = useOrder();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const recentOrders = orderHistory.slice(0, 3);
  const totalOrders = orderHistory.length;
  const totalSpent = orderHistory.reduce((sum, order) => sum + (order.total || 0), 0);

  return (
    <div className="profile-page">
      <BackButton />
      <div className="container">
        <div className="profile-container">
          <div className="profile-sidebar">
            <div className="profile-avatar">👤</div>
            <div className="profile-name">{user?.name || 'Guest User'}</div>
            <button className="btn btn-logout" onClick={handleLogout}>
              Logout
            </button>

            <div className="profile-info">
              <div className="profile-info-item">
                <span>📧</span>
                <span>{user?.email || 'N/A'}</span>
              </div>
              <div className="profile-info-item">
                <span>📞</span>
                <span>{user?.phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-section">
              <h3><span>📊</span> Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-label">Total Orders</div>
                  <div className="stat-value">{totalOrders}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Total Spent</div>
                  <div className="stat-value">৳{totalSpent}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Member Since</div>
                  <div className="stat-value">2024</div>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3><span>📦</span> Recent Orders</h3>
              <div className="order-list">
                {recentOrders.length === 0 ? (
                  <p style={{ color: 'var(--text-gray)', textAlign: 'center' }}>
                    No orders yet. Start ordering now!
                  </p>
                ) : (
                  recentOrders.map(order => (
                    <div key={order.id} className="order-item">
                      <div className="order-header">
                        <span className="order-id">Order {order.id}</span>
                        <span className="order-status delivered">
                          {order.status}
                        </span>
                      </div>
                      <div className="order-date">
                        {new Date(order.date).toLocaleDateString('en-GB')}
                      </div>
                      <div className="order-items">
                        {order.items.map(item => item.name).join(', ')}
                      </div>
                      <div className="order-footer">
                        <span className="order-total">৳{order.total}</span>
                        <button 
                          className="btn-view-details"
                          onClick={() => navigate(`/order-details/${order.id}`)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {totalOrders > 3 && (
                <button 
                  className="btn-view-all"
                  onClick={() => navigate('/order-history')}
                >
                  View All Orders
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;