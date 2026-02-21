import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { orderAPI, reviewAPI } from '../services/api';

function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewedOrders, setReviewedOrders] = useState({});

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('railbiteToken');
      if (!token) {
        setError('Please login to view your orders');
        setLoading(false);
        return;
      }
      const res = await orderAPI.getMyOrders(token);
      if (res.data.success) {
        setOrders(res.data.data || []);
        // Check which delivered orders have been reviewed
        const delivered = (res.data.data || []).filter(o => o.status === 'delivered');
        const reviewChecks = {};
        for (const o of delivered) {
          try {
            const rRes = await reviewAPI.getByOrder(o._id, token);
            if (rRes.data.success && rRes.data.data) {
              reviewChecks[o._id] = true;
            }
          } catch (e) { /* not reviewed */ }
        }
        setReviewedOrders(reviewChecks);
      } else {
        setError(res.data.message || 'Failed to load orders');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Pending', class: 'processing', icon: '⏳' },
      confirmed: { text: 'Confirmed', class: 'processing', icon: '✅' },
      preparing: { text: 'Preparing', class: 'processing', icon: '👨‍🍳' },
      on_the_way: { text: 'On the Way', class: 'processing', icon: '🚚' },
      delivered: { text: 'Delivered', class: 'delivered', icon: '✅' },
      cancelled: { text: 'Cancelled', class: 'cancelled', icon: '❌' }
    };
    return badges[status] || badges.pending;
  };

  const filteredOrders =
    filterStatus === 'all'
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  const handleTrackOrder = (orderNumber) => {
    navigate(`/order-tracking/${orderNumber}`);
  };

  if (loading) {
    return (
      <div className="order-history-page">
        <BackButton />
        <div className="container">
          <div className="page-header-section">
            <h1>📦 Order History</h1>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-history-page">
        <BackButton />
        <div className="container">
          <div className="page-header-section">
            <h1>📦 Order History</h1>
            <p style={{ color: 'red' }}>{error}</p>
            <button className="btn btn-primary" onClick={fetchMyOrders}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <BackButton />
      <div className="container">
        <div className="page-header-section">
          <h1>📦 Order History</h1>
          <p>View all your past orders</p>
        </div>

        <div className="order-filters">
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All Orders ({orders.length})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('pending')}
          >
            Pending ({orders.filter(o => o.status === 'pending').length})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'delivered' ? 'active' : ''}`}
            onClick={() => setFilterStatus('delivered')}
          >
            Delivered ({orders.filter(o => o.status === 'delivered').length})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilterStatus('cancelled')}
          >
            Cancelled ({orders.filter(o => o.status === 'cancelled').length})
          </button>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">📦</div>
            <h2>No Orders Found</h2>
            <p>You haven't placed any orders yet.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/menu-categories')}
            >
              Start Ordering
            </button>
          </div>
        ) : (
          <div className="order-history-list">
            {filteredOrders.map((order) => {
              const badge = getStatusBadge(order.status);
              return (
                <div key={order._id} className="history-order-card">
                  <div className="order-card-header">
                    <div className="order-id-date">
                      <h3>Order #{order.orderNumber}</h3>
                      <p className="order-date-time">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <span className={`order-status-badge ${badge.class}`}>
                      {badge.icon} {badge.text}
                    </span>
                  </div>

                  <div className="order-card-body">
                    <div className="order-items-list">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="order-item-row">
                          <span className="order-item-name">
                            {item.name} x {item.quantity}
                          </span>
                          <span className="order-item-price">
                            ৳{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    {order.bookingDetails?.trainNumber && (
                      <div className="order-delivery-info">
                        <p>
                          Train: <strong>{order.bookingDetails.trainNumber}</strong>
                          {order.bookingDetails.coachNumber && (
                            <> | Coach: <strong>{order.bookingDetails.coachNumber}</strong></>
                          )}
                          {order.bookingDetails.seatNumber && (
                            <> | Seat: <strong>{order.bookingDetails.seatNumber}</strong></>
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="order-card-footer">
                    <div className="order-total-amount">
                      ৳{order.totalAmount?.toFixed(2)}
                    </div>
                    <div className="order-actions">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleTrackOrder(order.orderNumber)}
                      >
                        👁️ View Details
                      </button>
                      {order.status === 'delivered' && (
                        reviewedOrders[order._id] ? (
                          <button
                            className="btn-rated btn-sm"
                            onClick={() => navigate(`/review/${order._id}`)}
                          >
                            ⭐ Reviewed
                          </button>
                        ) : (
                          <button
                            className="btn-rate btn-sm"
                            onClick={() => navigate(`/review/${order._id}`)}
                          >
                            ⭐ Rate Order
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;
