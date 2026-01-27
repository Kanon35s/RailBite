import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import AdminSidebar from '../components/AdminSidebar';

const AdminOrderManagement = () => {
  const { orders, updateOrderStatus, markOrderAsSent, addNotification } = useOrder();
  const safeOrders = Array.isArray(orders) ? orders : [];
  const [filter, setFilter] = useState('all');

  const filteredOrders = safeOrders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'pending') return order.status === 'pending';
    if (filter === 'sent') return order.deliveryStatus === 'sent';
    if (filter === 'delivered') return order.status === 'delivered';
    return true;
  });

  const handleMarkAsSent = (order) => {
    if (window.confirm(`Mark order #${order.id} as sent?`)) {
      markOrderAsSent(order.id);
      
      // Send notification to user
      addNotification({
        userId: order.userId,
        type: 'order-status',
        title: '🚚 Order On The Way!',
        message: `Your order #${order.id} is on the way. Please confirm once you receive it.`,
        orderId: order.id,
      });

      alert('Order marked as sent and user notified!');
    }
  };

  const handleCancelOrder = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      updateOrderStatus(orderId, 'cancelled', 'cancelled');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Pending', class: 'status-pending' },
      sent: { text: 'Sent', class: 'status-sent' },
      delivered: { text: 'Delivered', class: 'status-delivered' },
      cancelled: { text: 'Cancelled', class: 'status-cancelled' },
    };
    
    return badges[status] || badges.pending;
  };

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
            All Orders ({safeOrders.length})
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filter === 'sent' ? 'active' : ''}`}
            onClick={() => setFilter('sent')}
          >
            Sent
          </button>
          <button
            className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`}
            onClick={() => setFilter('delivered')}
          >
            Delivered
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
                  const badge = getStatusBadge(order.deliveryStatus || order.status);
                  
                  return (
                    <tr key={order.id}>
                      <td>#{order.id.slice(-6)}</td>
                      <td>
                        <div>{order.contactInfo?.fullName || order.userId}</div>
                        <small style={{ color: 'var(--text-gray)' }}>
                          {order.contactInfo?.phone}
                        </small>
                      </td>
                      <td>
                        {order.items?.length} item{order.items?.length > 1 ? 's' : ''}
                      </td>
                      <td style={{ fontWeight: '600', color: 'var(--primary-orange)' }}>
                        ৳{order.total?.toFixed(2)}
                      </td>
                      <td>
                        {new Date(order.orderDate).toLocaleDateString('en-BD', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td>
                        <span className={`badge ${badge.class}`}>{badge.text}</span>
                      </td>
                      <td>
                        {order.isReceivedByUser ? (
                          <span className="badge status-delivered">✅ Received</span>
                        ) : order.deliveryStatus === 'sent' ? (
                          <span className="badge status-sent">📦 In Transit</span>
                        ) : (
                          <span className="badge status-preparing">🔄 Preparing</span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          {order.deliveryStatus !== 'sent' && 
                           order.status !== 'delivered' && 
                           order.status !== 'cancelled' && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleMarkAsSent(order)}
                            >
                              Mark as Sent
                            </button>
                          )}
                          
                          {order.status !== 'cancelled' && 
                           order.status !== 'delivered' && (
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleCancelOrder(order.id)}
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
