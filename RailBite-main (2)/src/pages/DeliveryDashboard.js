// src/pages/DeliveryDashboard.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import BackButton from '../components/BackButton';

const DeliveryDashboard = () => {
  const [staff, setStaff] = useState(null);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [historyOrders, setHistoryOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('railbiteStaff');
    const token = localStorage.getItem('railbiteStaffToken');
    if (!stored || !token) {
      window.location.href = '/login';
      return;
    }
    setStaff(JSON.parse(stored));

    const fetchData = async () => {
      try {
        const [availRes, histRes] = await Promise.all([
          api.get('/delivery/orders/available', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get('/delivery/orders/history', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setAvailableOrders(availRes.data.orders || []);
        setHistoryOrders(histRes.data.orders || []);
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load delivery data'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAccept = async (orderId) => {
    const token = localStorage.getItem('railbiteStaffToken');
    if (!token) return;
    setAcceptingId(orderId);
    setError('');
    try {
      const res = await api.post(
        `/delivery/orders/${orderId}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const acceptedOrder = res.data.order;
      setAvailableOrders((prev) =>
        prev.filter((o) => o._id !== acceptedOrder._id)
      );
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to accept this order'
      );
    } finally {
      setAcceptingId(null);
    }
  };

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-container">Loading...</div>
      </div>
    );
  }

  if (!staff) return null;

  return (
    <div className="delivery-dashboard-page">
      <div className="delivery-dashboard-header">
        <BackButton />
        <h1>Delivery Dashboard</h1>
        <div className="delivery-staff-meta">
          <span>{staff.name}</span>
          <span className="badge badge-type">
            {staff.type === 'train' ? 'Train Delivery' : 'Station Delivery'}
          </span>
          <span className="badge badge-status">
            Status: {staff.status || 'unknown'}
          </span>
          <span className="badge badge-count">
            Completed Today: {staff.completedToday ?? 0}
          </span>
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}

      <section className="delivery-section">
        <h2>Available Orders</h2>
        {availableOrders.length === 0 ? (
          <p>No available orders right now.</p>
        ) : (
          <div className="delivery-orders-list">
            {availableOrders.map((order) => (
              <div key={order._id} className="delivery-order-card">
                <div>
                  <h3>Order #{order.orderId}</h3>
                  <p>{order.contactInfo?.fullName}</p>
                  <p>{order.bookingDetails?.pickupStation}</p>
                  <p>৳{order.total?.toFixed(2)}</p>
                </div>
                <button
                  className="btn btn-primary"
                  disabled={acceptingId === order._id}
                  onClick={() => handleAccept(order._id)}
                >
                  {acceptingId === order._id ? 'Accepting...' : 'Accept Order'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="delivery-section">
        <h2>Delivery History</h2>
        {historyOrders.length === 0 ? (
          <p>No completed deliveries yet.</p>
        ) : (
          <table className="delivery-history-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Location</th>
                <th>Delivered At</th>
              </tr>
            </thead>
            <tbody>
              {historyOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.orderId}</td>
                  <td>{order.contactInfo?.fullName}</td>
                  <td>{order.bookingDetails?.pickupStation}</td>
                  <td>
                    {order.deliveredAt
                      ? new Date(order.deliveredAt).toLocaleString('en-BD')
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default DeliveryDashboard;
