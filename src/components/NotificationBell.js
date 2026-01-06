import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem('railbiteNotifications');
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications);
      setNotifications(parsed);
      setUnreadCount(parsed.filter((n) => !n.read).length);
    } else {
      // Default notifications for demo
      const defaultNotifications = [
        {
          id: 1,
          type: 'order',
          title: 'Order Confirmed',
          message: 'Your order #ORD-123 has been confirmed and is being prepared',
          time: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          read: false,
          icon: '✅',
          link: '/order-history'
        },
        {
          id: 2,
          type: 'delivery',
          title: 'Out for Delivery',
          message: 'Your food is on the way to your location!',
          time: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          read: false,
          icon: '🚚',
          link: '/order-tracking/ORD-123'
        },
        {
          id: 3,
          type: 'offer',
          title: 'Special Offer!',
          message: 'Get 20% off on all burgers today only',
          time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
          icon: '🎉',
          link: '/burger-menu'
        },
        {
          id: 4,
          type: 'info',
          title: 'Welcome to RailBite',
          message: 'Thank you for choosing RailBite for your journey meals',
          time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          icon: '👋',
          link: '/'
        }
      ];
      setNotifications(defaultNotifications);
      setUnreadCount(3);
      localStorage.setItem('railbiteNotifications', JSON.stringify(defaultNotifications));
    }
  }, []);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const saveNotifications = (updatedNotifications) => {
    setNotifications(updatedNotifications);
    localStorage.setItem('railbiteNotifications', JSON.stringify(updatedNotifications));
    setUnreadCount(updatedNotifications.filter((n) => !n.read).length);
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    const updated = notifications.map((n) =>
      n.id === notification.id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
    setIsOpen(false);
    
    // Navigate to link
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem('railbiteNotifications');
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  };

  return (
    <div style={{ position: 'relative' }} ref={panelRef}>
      {/* Notification Icon */}
      <div 
        className="notification-icon" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          position: 'relative', 
          fontSize: '1.8rem', 
          cursor: 'pointer',
          transition: 'transform 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </div>

      {/* Notification Panel */}
      {isOpen && (
        <div className="notification-panel">
          {/* Header */}
          <div className="notification-header">
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="mark-all-btn" onClick={markAllAsRead}>
                  Mark all read
                </button>
                <button 
                  className="mark-all-btn" 
                  onClick={clearAll}
                  style={{ color: 'var(--danger)' }}
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Notifications List */}
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔕</div>
                <p>No notifications</p>
                <small>You're all caught up!</small>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.read ? '' : 'unread'}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon-emoji">{notification.icon}</div>
                  <div className="notification-content">
                    <p style={{ 
                      fontWeight: notification.read ? 'normal' : 'bold',
                      color: 'var(--text-white)',
                      margin: 0,
                      marginBottom: '0.3rem',
                      fontSize: '0.95rem'
                    }}>
                      {notification.title}
                    </p>
                    <small className="notification-message" style={{
                      color: 'var(--text-gray)',
                      fontSize: '0.85rem',
                      display: 'block',
                      marginBottom: '0.3rem',
                      lineHeight: '1.4'
                    }}>
                      {notification.message}
                    </small>
                    <span className="notification-time" style={{
                      color: 'var(--text-light-gray)',
                      fontSize: '0.75rem'
                    }}>
                      {getRelativeTime(notification.time)}
                    </span>
                  </div>
                  {!notification.read && <div className="unread-dot"></div>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;