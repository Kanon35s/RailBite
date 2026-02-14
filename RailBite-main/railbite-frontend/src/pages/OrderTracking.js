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

  const statusSteps = useMemo(
    () => [
      {
        id: 'pending',
        label: 'Order Placed',
        icon: '📋',
        description: 'Your order has been received',
        estimatedMinutes: 0,
      },
      {
        id: 'confirmed',
        label: 'Order Confirmed',
        icon: '✅',
        description: 'Restaurant confirmed your order',
        estimatedMinutes: 2,
      },
      {
        id: 'preparing',
        label: 'Preparing Food',
        icon: '👨‍🍳',
        description: 'Chef is preparing your meal',
        estimatedMinutes: 15,
      },
      {
        id: 'ready',
        label: 'Ready for Delivery',
        icon: '📦',
        description: 'Food is packed and ready',
        estimatedMinutes: 20,
      },
      {
        id: 'ontheway',
        label: 'Out for Delivery',
        icon: '🚚',
        description: 'Delivery partner on the way',
        estimatedMinutes: 30,
      },
      {
        id: 'delivered',
        label: 'Delivered',
        icon: '🎉',
        description: 'Enjoy your meal!',
        estimatedMinutes: 0,
      },
    ],
    []
  );

  useEffect(() => {
    const getStatusIndex = (status) =>
      statusSteps.findIndex((step) => step.id === status);

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

    if (orders && orders.length > 0) {
      const foundOrder = orders.find(
        (o) => o.id === orderId || o.orderId === orderId
      );
      if (foundOrder) {
        setOrder(foundOrder);
        const status = foundOrder.status || 'pending';
        setCurrentStatus(status);
        calculateEstimatedTime(status);
        return;
      }
    }

    // Fallback mock order
    const mockOrder = {
      orderId: orderId || 'ORD-' + Date.now(),
      date: new Date().toISOString(),
      items: [
        { name: 'Bengali Biryani', quantity: 2, price: 250 },
        { name: 'Chicken Shwarma', quantity: 1, price: 120 },
      ],
      total: 620,
      status: 'pending',
      paymentMethod: 'bkash',
      customerInfo: {
        name: 'Passenger',
        phone: '01712345678',
        address: 'Coach A1, Seat 12',
        trainNumber: '701 Suborna Express',
      },
      deliveryAddress: 'Coach A1, Seat 12',
    };
    setOrder(mockOrder);
    setCurrentStatus('pending');
    calculateEstimatedTime('pending');
  }, [orderId, orders, statusSteps]);

  const getStatusIndex = (status) =>
    statusSteps.findIndex((step) => step.id === status);

  const currentIndex = getStatusIndex(currentStatus);
  const progressPercentage =
    currentIndex === -1
      ? 0
      : ((currentIndex + 1) / statusSteps.length) * 100;

  const handleCancelOrder = () => {
    if (currentIndex <= 1) {
      if (window.confirm('Are you sure you want to cancel this order?')) {
        setToast({ message: 'Order cancelled successfully', type: 'success' });
        setTimeout(() => navigate('/order-history'), 2000);
      }
    } else {
      setToast({
        message: 'Order cannot be cancelled. Please contact support.',
        type: 'error',
      });
    }
  };

  const getDeliveryPerson = () => ({
    name: 'Karim Ahmed',
    phone: '01712345678',
    rating: 4.8,
  });

  if (!order) {
    return (
      <div className="order-tracking-page">
        <BackButton />
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">📦</div>
            <h2>No Order Found</h2>
            <p>The order you are looking for does not exist or has been removed.</p>
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
  const displayOrderId = order.orderId || order.id;
  const orderDate = order.date || order.orderDate;

  return (
    <div className="order-tracking-page">
      <BackButton />
      <div className="container">
        {/* Header */}
        <div className="tracking-header">
          <h1>🚚 Track Your Order</h1>
          <p className="tracking-order-id">
            Order ID: <strong>{displayOrderId}</strong>
          </p>
          <p className="tracking-order-date">
            Placed on{' '}
            {orderDate
              ? new Date(orderDate).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Date not available'}
          </p>
        </div>

        {/* Progress overview */}
        <div className="tracking-progress-card">
          <div className="tracking-progress-header">
            <h3>Order Progress</h3>
            <span className="tracking-progress-percent">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="tracking-progress-bar">
            <div
              className="tracking-progress-bar-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {currentIndex < statusSteps.length - 1 && (
            <p className="tracking-estimated">
              ⏱️ Estimated time:{' '}
              <strong>{estimatedTime}</strong>
            </p>
          )}
        </div>

        {/* Main content: timeline + details */}
        <div className="tracking-layout">
          {/* Left: timeline */}
          <div className="order-status-timeline">
            <h3 className="tracking-section-title">Order Status</h3>
            {statusSteps.map((step, index) => (
              <div
                key={step.id}
                className={`timeline-step ${
                  index < currentIndex
                    ? 'completed'
                    : index === currentIndex
                    ? 'active'
                    : 'pending'
                }`}
              >
                <div className="timeline-icon-wrapper">
                  <div className="timeline-icon">
                    {step.icon}
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div
                      className={`timeline-line ${
                        index < currentIndex ? 'completed' : ''
                      }`}
                    />
                  )}
                </div>
                <div className="timeline-content">
                  <h4>{step.label}</h4>
                  <p className="timeline-description">
                    {step.description}
                  </p>
                  {index === currentIndex &&
                    index < statusSteps.length - 1 && (
                      <p className="timeline-status-current">
                        🔄 In progress...
                      </p>
                    )}
                  {index < currentIndex && (
                    <p className="timeline-status-done">
                      ✓ Completed
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right: details column */}
          <div className="tracking-details-column">
            {/* Delivery partner card */}
            {currentIndex >= 3 && currentIndex < 5 && (
              <div className="order-details-card">
                <h3>Delivery Partner</h3>
                <div className="delivery-partner-card">
                  <div className="delivery-avatar">
                    👤
                  </div>
                  <div className="delivery-info">
                    <h4>{deliveryPerson.name}</h4>
                    <p>⭐ {deliveryPerson.rating} Rating</p>
                    <button
                      className="btn btn-secondary btn-block"
                      onClick={() =>
                        (window.location.href = `tel:${deliveryPerson.phone}`)
                      }
                    >
                      📞 Call {deliveryPerson.phone}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Order summary card */}
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
                <strong className="detail-address">
                  {order.customerInfo?.address ||
                    order.deliveryAddress ||
                    'Train Seat'}
                </strong>
              </div>
              {order.customerInfo?.trainNumber && (
                <div className="detail-row">
                  <span>Train Number</span>
                  <strong>{order.customerInfo.trainNumber}</strong>
                </div>
              )}

              <div className="detail-row detail-total-row">
                <span>Total Amount</span>
                <strong className="detail-total-amount">
                  ৳{order.total}
                </strong>
              </div>

              <div className="order-items-list">
                <h4>Items Ordered</h4>
                {order.items?.map((item, idx) => (
                  <div key={idx} className="order-item-row">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>৳{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="tracking-actions">
                {currentIndex <= 1 && (
                  <button
                    className="btn btn-secondary btn-block tracking-cancel-btn"
                    onClick={handleCancelOrder}
                  >
                    ❌ Cancel Order
                  </button>
                )}
                <button
                  className="btn btn-secondary btn-block"
                  onClick={() => (window.location.href = 'tel:16123')}
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
    </div>
  );
}

export default OrderTracking;
