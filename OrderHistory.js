import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import BackButton from '../components/BackButton';

function OrderHistory() {
  const navigate = useNavigate();
  const { orders: contextOrders } = useOrder();
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Use orders from context or create mock data
    if (contextOrders && contextOrders.length > 0) {
      setOrders(contextOrders);
    } else {
      // Mock order history
      const mockOrders = [
        {
          orderId: 'ORD-20260105001',
          date: '2026-01-05',
          items: [
            { name: 'Bengali Biryani', quantity: 2, price: 250 },
            { name: 'Chicken Shwarma', quantity: 1, price: 120 }
          ],
          total: 620,
          status: 'delivered',
          paymentMethod: 'bkash',
          deliveryAddress: 'Coach A1, Seat 12'
        },
        {
          orderId: 'ORD-20260104001',
          date: '2026-01-04',
          items: [
            { name: 'Classic King Burger', quantity: 1, price: 180 },
            { name: 'Mango Smoothie', quantity: 1, price: 120 }
          ],
          total: 300,
          status: 'delivered',
          paymentMethod: 'cod',
          deliveryAddress: 'Dhaka Railway Station'
        },
        {
          orderId: 'ORD-20260103001',
          date: '2026-01-03',
          items: [
            { name: 'Beef Pepperoni Pizza', quantity: 1, price: 450 }
          ],
          total: 450,
          status: 'cancelled',
          paymentMethod: 'nagad',
          deliveryAddress: 'Coach B2, Seat 24'
        }
      ];
      setOrders(mockOrders);
    }
  }, [contextOrders]);

  const getStatusBadge = (status) => {
    const badges = {
      delivered: { text: '✅ Delivered', class: 'status-delivered', icon: '✅' },
      cancelled: { text: '❌ Cancelled', class: 'status-cancelled', icon: '❌' },
      processing: { text: '🔄 Processing', class: 'status-processing', icon: '🔄' }
    };
    return badges[status] || badges.processing;
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter((order) => order.status === filterStatus);

  const handleReorder = (order) => {
    alert('Items added to cart! Redirecting to menu...');
    navigate('/menu-categories');
  };

  const handleTrackOrder = (orderId) => {
    navigate(`/order-tracking/${orderId}`);
  };

  return (
    <div className="order-history-page">
      <BackButton />
      <div className="container">
        <div className="page-header">
          <h1>📦 Order History</h1>
          <p>View all your past orders</p>
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All Orders ({orders.length})
          </button>
          <button
            className={`filter-tab ${filterStatus === 'delivered' ? 'active' : ''}`}
            onClick={() => setFilterStatus('delivered')}
          >
            Delivered ({orders.filter((o) => o.status === 'delivered').length})
          </button>
          <button
            className={`filter-tab ${filterStatus === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilterStatus('cancelled')}
          >
            Cancelled ({orders.filter((o) => o.status === 'cancelled').length})
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
          <div className="orders-list">
            {filteredOrders.map((order) => {
              const badge = getStatusBadge(order.status);
              return (
                <div key={order.orderId || order.id} className="order-history-card">
                  <div className="order-card-header">
                    <div>
                      <h3>Order #{order.orderId || order.id}</h3>
                      <p className="order-date">
                        {new Date(order.date || order.orderDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <span className={`status-badge ${badge.class}`}>
                      {badge.icon} {badge.text}
                    </span>
                  </div>

                  <div className="order-items-summary">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item-row">
                        <span>{item.name} x {item.quantity}</span>
                        <span>৳{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-card-footer">
                    <div className="order-total">
                      <span>Total</span>
                                            <strong>৳{order.total}</strong>
                    </div>
                    <div className="order-actions">
                      {order.status === 'delivered' && (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleReorder(order)}
                        >
                          🔄 Reorder
                        </button>
                      )}
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleTrackOrder(order.orderId || order.id)}
                      >
                        👁️ View Details
                      </button>
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
