import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { orderAPI } from '../services/api';

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('railbite_token');
        console.log('Token:', token);

        if (!token) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }

        const res = await orderAPI.getAll(token);
        console.log('Orders response:', res.data);

        if (res.data.success) {
          setOrders(res.data.data || []);
        } else {
          setError(res.data.message || 'Failed to load orders');
        }
      } catch (err) {
        console.error('Orders fetch error:', err);
        setError(err.response?.data?.message || err.message || 'Error loading orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusUpdate = async (order, newStatus) => {
    const statusLabels = {
      confirmed: 'confirm',
      preparing: 'mark as preparing',
      on_the_way: 'dispatch',
      delivered: 'mark as delivered'
    };

    if (!window.confirm(`Are you sure you want to ${statusLabels[newStatus]} order #${order.orderNumber}?`)) return;

    try {
      const token = localStorage.getItem('railbite_token');
      const res = await orderAPI.updateStatus(
        order._id,
        { status: newStatus },
        token
      );
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === order._id ? res.data.data : o))
        );
        alert(`Order status updated to: ${newStatus}`);
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.message ||
          'Failed to update order status'
      );
    }
  };


  const handleCancelOrder = async (order) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      const token = localStorage.getItem('railbite_token');
      const res = await orderAPI.updateStatus(
        order._id,
        { status: 'cancelled' },
        token
      );
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === order._id ? res.data.data : o))
        );
        alert('Order cancelled.');
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to cancel');
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (filter === 'all') return true;
      if (filter === 'pending') return order.status === 'pending';
      if (filter === 'confirmed') return order.status === 'confirmed';
      if (filter === 'preparing') return order.status === 'preparing';
      if (filter === 'on_the_way') return order.status === 'on_the_way';
      if (filter === 'delivered') return order.status === 'delivered';
      if (filter === 'cancelled') return order.status === 'cancelled';
      return true;
    });
  }, [orders, filter]);


  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Pending', class: 'status-pending' },
      confirmed: { text: 'Confirmed', class: 'status-preparing' },
      preparing: { text: 'Preparing', class: 'status-preparing' },
      on_the_way: { text: 'On the Way', class: 'status-sent' },
      sent: { text: 'Sent', class: 'status-sent' },
      delivered: { text: 'Delivered', class: 'status-delivered' },
      cancelled: { text: 'Cancelled', class: 'status-cancelled' }
    };
    return badges[status] || badges.pending;
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="admin-content">
          <div className="admin-header">
            <h1>📦 Order Management</h1>
            <p>Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="admin-content">
          <div className="admin-header">
            <h1>📦 Order Management</h1>
            <p style={{ color: 'red' }}>Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>📦 Order Management</h1>
          <p>Manage and track all customer orders</p>
        </div>

        {/* Filter Buttons */}
        <div className="admin-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({orders.length})
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({orders.filter(o => o.status === 'pending').length})
          </button>
          <button
            className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilter('confirmed')}
          >
            Confirmed ({orders.filter(o => o.status === 'confirmed').length})
          </button>
          <button
            className={`filter-btn ${filter === 'preparing' ? 'active' : ''}`}
            onClick={() => setFilter('preparing')}
          >
            Preparing ({orders.filter(o => o.status === 'preparing').length})
          </button>
          <button
            className={`filter-btn ${filter === 'on_the_way' ? 'active' : ''}`}
            onClick={() => setFilter('on_the_way')}
          >
            On the Way ({orders.filter(o => o.status === 'on_the_way').length})
          </button>
          <button
            className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`}
            onClick={() => setFilter('delivered')}
          >
            Delivered ({orders.filter(o => o.status === 'delivered').length})
          </button>
          <button
            className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled ({orders.filter(o => o.status === 'cancelled').length})
          </button>
        </div>

        {/* Orders Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
                <th>Delivery</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem' }}>
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const badge = getStatusBadge(order.status);
                  return (
                    <tr key={order._id}>
                      <td>#{order.orderNumber || String(order._id).slice(-6)}</td>
                      <td>
                        <div>{order.user?.name || 'Customer'}</div>
                        <small style={{ color: 'var(--text-gray)' }}>
                          {order.user?.email || ''}
                        </small>
                      </td>
                      <td>
                        {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                      </td>
                      <td style={{ fontWeight: '600', color: 'var(--primary-orange)' }}>
                        ৳{order.totalAmount?.toFixed(2)}
                      </td>
                      <td>
                        {new Date(order.createdAt).toLocaleDateString('en-BD', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td>
                        {(() => {
                          const statusConfig = {
                            pending: { text: 'Pending', class: 'status-pending' },
                            confirmed: { text: 'Confirmed', class: 'status-preparing' },
                            preparing: { text: 'Preparing', class: 'status-preparing' },
                            on_the_way: { text: 'On the Way', class: 'status-sent' },
                            delivered: { text: 'Delivered', class: 'status-delivered' },
                            cancelled: { text: 'Cancelled', class: 'status-cancelled' }
                          };
                          const config = statusConfig[order.status] || statusConfig.pending;
                          return (
                            <span className={`badge ${config.class}`}>{config.text}</span>
                          );
                        })()}
                      </td>
                      <td>
                        {order.deliveryStatus === 'sent' ? (
                          <span className="badge status-sent">📦 In Transit</span>
                        ) : order.status === 'delivered' ? (
                          <span className="badge status-delivered">✅ Delivered</span>
                        ) : order.status === 'cancelled' ? (
                          <span className="badge status-cancelled">❌ Cancelled</span>
                        ) : (
                          <span className="badge status-preparing">🔄 Preparing</span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          {/* Show next status button based on current status */}
                          {order.status === 'pending' && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleStatusUpdate(order, 'confirmed')}
                            >
                              ✅ Confirm
                            </button>
                          )}

                          {order.status === 'confirmed' && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleStatusUpdate(order, 'preparing')}
                            >
                              👨‍🍳 Preparing
                            </button>
                          )}

                          {order.status === 'preparing' && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleStatusUpdate(order, 'on_the_way')}
                            >
                              🚚 Dispatch
                            </button>
                          )}

                          {order.status === 'on_the_way' && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleStatusUpdate(order, 'delivered')}
                            >
                              🎉 Delivered
                            </button>
                          )}

                          {order.status !== 'cancelled' &&
                            order.status !== 'delivered' && (
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleCancelOrder(order)}
                              >
                                Cancel
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderManagement;
