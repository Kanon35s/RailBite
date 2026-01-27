import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedNotifications = localStorage.getItem('railbiteNotifications');
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications);
      setNotifications(parsed);
      setUnreadCount(parsed.filter((n) => !n.read).length);
    } else {
      const defaultNotifications = [
        {
          id: 1,
          type: 'admin',
          title: 'Hello from Admin!!!',
          message: 'Hello, Dear Customer. I hope you are using our app comfortably. If you face any issues, please do not hesitate to let us know. Thank you.',
          time: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
          read: false,
          icon: '📢',
          link: null
        },
        {
          id: 2,
          type: 'order',
          title: 'Order Confirmed',
          message: 'Your order #ORD-123 has been confirmed',
          time: new Date(Date.now() - 60 * 1000).toISOString(),
          read: false,
          icon: '✅',
          link: '/order-history'
        },
        {
          id: 3,
          type: 'delivery',
          title: 'Out for Delivery',
          message: 'Your food is on the way!',
          time: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          read: false,
          icon: '🚚',
          link: '/order-tracking'
        },
        {
          id: 4,
          type: 'offer',
          title: 'Special Offer!',
          message: '20% off on all burgers today',
          time: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          read: false,
          icon: '🎉',
          link: '/menu'
        }
      ];
      setNotifications(defaultNotifications);
      setUnreadCount(4);
      localStorage.setItem('railbiteNotifications', JSON.stringify(defaultNotifications));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveNotifications = (updatedNotifications) => {
    setNotifications(updatedNotifications);
    localStorage.setItem('railbiteNotifications', JSON.stringify(updatedNotifications));
    setUnreadCount(updatedNotifications.filter((n) => !n.read).length);
  };

  const handleNotificationClick = (notification) => {
    const updated = notifications.map((n) =>
      n.id === notification.id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
    setIsOpen(false);
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
    setIsOpen(false);
  };

  const viewAllNotifications = () => {
    setIsOpen(false);
    navigate('/notifications');
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) {
      const mins = Math.floor(diffInSeconds / 60);
      return mins + 'm ago';
    }
    if (diffInSeconds < 86400) {
      const hrs = Math.floor(diffInSeconds / 3600);
      return hrs + 'h ago';
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return days + 'd ago';
    }
    const weeks = Math.floor(diffInSeconds / 604800);
    return weeks + 'w ago';
  };

  return (
    <>
      {isOpen && <div className="notification-overlay active" onClick={() => setIsOpen(false)} />}

      <div className="notification-wrapper" ref={wrapperRef}>
        <button className="notification-btn" onClick={() => setIsOpen(!isOpen)}>
          🔔
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </button>

        <div className={'notification-dropdown ' + (isOpen ? 'show active' : '')}>
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="notification-header-actions">
              {unreadCount > 0 && (
                <button className="notification-action-btn" onClick={markAllAsRead}>
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button className="notification-action-btn danger" onClick={clearAll}>
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="notification-list">
            {notifications.length > 0 ? (
              notifications.slice(0, 4).map((notification) => (
                <div
                  key={notification.id}
                  className={'notification-item ' + (!notification.read ? 'unread' : '')}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">{notification.icon}</div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">{getRelativeTime(notification.time)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-notifications">
                <div className="no-notifications-icon">🔕</div>
                <p>No notifications</p>
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notification-footer">
              <button className="view-all-notifications" onClick={viewAllNotifications}>
                View all notifications
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default NotificationBell;