import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import BackButton from '../components/BackButton';
import Toast from '../components/Toast';

function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders } = useOrder();
  const [order, setOrder] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('pending');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [toast, setToast] = useState(null);

  // Wrap statusSteps in useMemo to prevent recreation on every render
  const statusSteps = useMemo(() => [
    { 
      id: 'pending', 
      label: 'Order Placed', 
      icon: '📋', 
      description: 'Your order has been received',
      estimatedMinutes: 0
    },
    { 
      id: 'confirmed', 
      label: 'Order Confirmed', 
      icon: '✅', 
      description: 'Restaurant confirmed your order',
      estimatedMinutes: 2
    },
    { 
      id: 'preparing', 
      label: 'Preparing Food', 
      icon: '👨‍🍳', 
      description: 'Chef is preparing your meal',
      estimatedMinutes: 15
    },
    { 
      id: 'ready', 
      label: 'Ready for Delivery', 
      icon: '📦', 
      description: 'Food is packed and ready',
      estimatedMinutes: 20
    },
    { 
      id: 'ontheway', 
      label: 'Out for Delivery', 
      icon: '🚚', 
      description: 'Delivery partner on the way',
      estimatedMinutes: 30
    },
    { 
      id: 'delivered', 
      label: 'Delivered', 
      icon: '🎉', 
      description: 'Enjoy your meal!',
      estimatedMinutes: 0
    }
  ], []); // Empty dependency array means this only gets created once

  useEffect(() => {
    // Helper function for getting status index
    const getStatusIndex = (status) => {
      return statusSteps.findIndex((step) => step.id === status);
    };

    // Calculate estimated time based on status
    const calculateEstimatedTime = (status) => {
      const currentIndex = getStatusIndex(status);
      if (currentIndex === -1 || currentIndex === statusSteps.length - 1) {
        setEstimatedTime('Order completed');
        return;
      }
      
      const nextStep = statusSteps[currentIndex + 1];
      const remainingMinutes = nextStep.estimatedMinutes;
      
      if (remainingMinutes <= 5) {
        setEstimatedTime(`${remainingMinutes} minutes`);
      } else {
        setEstimatedTime(`${remainingMinutes - 5}-${remainingMinutes} minutes`);
      }
    };

    // Get order from context
    if (orders && orders.length > 0) {
      const foundOrder = orders.find((o) => o.id === orderId || o.orderId === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
        setCurrentStatus(foundOrder.status || 'pending');
        calculateEstimatedTime(foundOrder.status || 'pending');
      }
    } else {
      // Mock order for demo
      const mockOrder = {
        orderId: orderId || 'ORD-' + Date.now(),
        date: new Date().toISOString(),
        items: [
          { name: 'Bengali Biryani', quantity: 2, price: 250 },
          { name: 'Chicken Shwarma', quantity: 1, price: 120 }
        ],
        total: 620,
        status: 'pending',
        paymentMethod: 'bkash',
        customerInfo: {
          name: 'Passenger',
          phone: '01712345678',
          address: 'Coach A1, Seat 12',
          trainNumber: '701 Suborna Express'
        }
      };
      setOrder(mockOrder);
      setCurrentStatus('pending');
      calculateEstimatedTime('pending');
    }
  }, [orderId, orders, statusSteps]); // Now statusSteps won't cause unnecessary re-renders

  // Helper function for status index (used in component body)
  const getStatusIndex = (status) => {
    return statusSteps.findIndex((step) => step.id === status);
  };

  const currentIndex = getStatusIndex(currentStatus);
  const progressPercentage = ((currentIndex + 1) / statusSteps.length) * 100;

  const handleCancelOrder = () => {
    if (currentIndex <= 1) {
      if (window.confirm('Are you sure you want to cancel this order?')) {
        setToast({ message: 'Order cancelled successfully', type: 'success' });
        setTimeout(() => navigate('/order-history'), 2000);
      }
    } else {
      setToast({ 
        message: 'Order cannot be cancelled. Please contact support.', 
        type: 'error' 
      });
    }
  };

  const getDeliveryPerson = () => {
    return {
      name: 'Karim Ahmed',
      phone: '01712345678',
      rating: 4.8
    };
  };

  if (!order) {
    return (
      <div className="order-tracking-page">
        <BackButton />
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">📦</div>
            <h2>No Order Found</h2>
            <p>The order you're looking for doesn't exist or has been removed.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/menu-categories')}
            >
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  const deliveryPerson = getDeliveryPerson();

  return (
    <div className="order-tracking-page">
      <BackButton />
      <div className="container">
        <div className="tracking-header">
          <h1>🚚 Track Your Order</h1>
          <p className="order-id">
            Order ID: <strong>{order.orderId || order.id}</strong>
          </p>
          <p style={{ color: '#b0b0b0', fontSize: '0.95rem', marginTop: '0.5rem' }}>
            Placed on {new Date(order.date || order.orderDate).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{
          background: 'var(--dark-card)',
          padding: '2rem',
          borderRadius: '15px',
          marginBottom: '2rem',
          border: '1px solid var(--border-dark)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h3 style={{ color: '#fff', margin: 0 }}>Order Progress</h3>
            <span style={{ 
              color: 'var(--primary-orange)', 
              fontWeight: 'bold',
              fontSize: '1.1rem' 
            }}>
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '12px',
            background: 'var(--dark-lighter)',
            borderRadius: '10px',
            overflow: 'hidden',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: `${progressPercentage}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--primary-orange) 0%, var(--orange-hover) 100%)',
              transition: 'width 0.5s ease',
              borderRadius: '10px'
            }}></div>
          </div>
          {currentIndex < statusSteps.length - 1 && (
            <p style={{ color: '#b0b0b0', fontSize: '0.9rem', margin: 0 }}>
              ⏱️ Estimated time: <strong style={{ color: 'var(--primary-orange)' }}>{estimatedTime}</strong>
            </p>
          )}
        </div>

        <div className="tracking-container">
          <div className="order-status-timeline">
            <h3 style={{ marginBottom: '2rem', color: '#fff' }}>Order Status</h3>
            {statusSteps.map((step, index) => (
              <div
                key={step.id}
                className={`timeline-step ${index <= currentIndex ? 'completed' : 'pending'}`}
              >
                <div className="step-icon" style={{
                  animation: index === currentIndex ? 'pulse 2s infinite' : 'none'
                }}>
                  {step.icon}
                </div>
                <div className="step-content">
                  <h3>{step.label}</h3>
                  <p className="step-time" style={{ fontSize: '0.85rem', color: '#888' }}>
                    {step.description}
                  </p>
                  {index === currentIndex && index < statusSteps.length - 1 && (
                    <p style={{ 
                      color: 'var(--primary-orange)', 
                      fontSize: '0.9rem',
                      marginTop: '0.5rem',
                      fontWeight: 'bold'
                    }}>
                      🔄 In Progress...
                    </p>
                  )}
                  {index < currentIndex && (
                    <p style={{ 
                      color: 'var(--success)', 
                      fontSize: '0.85rem',
                      marginTop: '0.5rem'
                    }}>
                      ✓ Completed
                    </p>
                  )}
                </div>
                {index < statusSteps.length - 1 && (
                  <div className={`timeline-line ${index < currentIndex ? 'completed' : ''}`}></div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Delivery Person Info */}
            {currentIndex >= 3 && currentIndex < 5 && (
              <div className="order-details-card">
                <h3>Delivery Partner</h3>
                <div style={{
                  background: 'var(--dark-lighter)',
                  padding: '1.5rem',
                  borderRadius: '10px',
                  marginTop: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: 'var(--primary-orange)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem'
                    }}>
                      👤
                    </div>
                    <div>
                      <h4 style={{ margin: 0, color: '#fff' }}>{deliveryPerson.name}</h4>
                      <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>
                        ⭐ {deliveryPerson.rating} Rating
                      </p>
                    </div>
                  </div>
                  <button
                    className="btn btn-secondary btn-block"
                    onClick={() => window.location.href = `tel:${deliveryPerson.phone}`}
                  >
                    📞 Call {deliveryPerson.phone}
                  </button>
                </div>
              </div>
            )}

            {/* Order Details */}
            <div className="order-details-card">
              <h3>Order Details</h3>
              <div className="detail-row">
                <span>Total Items</span>
                <strong>{order.items?.length || 0}</strong>
              </div>
              <div className="detail-row">
                <span>Payment Method</span>
                <strong>{order.paymentMethod?.toUpperCase()}</strong>
              </div>
              <div className="detail-row">
                <span>Delivery Address</span>
                <strong style={{ fontSize: '0.9rem' }}>
                  {order.customerInfo?.address || order.deliveryAddress || 'Train Seat'}
                </strong>
              </div>
              {order.customerInfo?.trainNumber && (
                <div className="detail-row">
                  <span>Train Number</span>
                  <strong>{order.customerInfo.trainNumber}</strong>
                </div>
              )}
              <div className="detail-row" style={{ borderTop: '2px solid var(--border-dark)', paddingTop: '1rem', marginTop: '1rem' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Total Amount</span>
                <strong className="price-text" style={{ fontSize: '1.3rem' }}>৳{order.total}</strong>
              </div>

              <div className="order-items-list">
                <h4>Items Ordered</h4>
                {order.items?.map((item, idx) => (
                  <div key={idx} className="order-item-row">
                    <span>{item.name} x {item.quantity}</span>
                    <span>৳{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="tracking-actions">
                {currentIndex <= 1 && (
                  <button 
                    className="btn btn-secondary btn-block"
                    onClick={handleCancelOrder}
                    style={{ background: 'var(--danger)', borderColor: 'var(--danger)' }}
                  >
                    ❌ Cancel Order
                  </button>
                )}
                <button 
                  className="btn btn-secondary btn-block"
                  onClick={() => window.location.href = 'tel:16123'}
                >
                  📞 Contact Support
                </button>
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => navigate('/order-history')}
                >
                  📋 View Order History
                </button>
                <button
                  className="btn btn-secondary btn-block"
                  onClick={() => navigate('/')}
                >
                  🏠 Back to Home
                </button>
              </div>
            </div>
                      </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}

export default OrderTracking;
