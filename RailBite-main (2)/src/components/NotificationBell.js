import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationAPI } from '../services/api';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadIds, setUnreadIds] = useState([]);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // Load read IDs from localStorage so read state persists
  const getReadIds = () => {
    const saved = localStorage.getItem('railbiteReadNotifications');
    return saved ? JSON.parse(saved) : [];
  };

  const saveReadIds = (ids) => {
    localStorage.setItem('railbiteReadNotifications', JSON.stringify(ids));
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('railbiteToken');
      if (!token) return;

      const res = await notificationAPI.getCustomer(token);
      if (res.data.success) {
        const fetched = res.data.data || [];
        const readIds = getReadIds();

        // Mark as read/unread based on localStorage
        const mapped = fetched.map(n => ({
          ...n,
          read: readIds.includes(n._id),
          icon: getIcon(n.type),
          time: n.createdAt
        }));

        setNotifications(mapped);
        setUnreadIds(mapped.filter(n => !n.read).map(n => n._id));
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err.message);
    }
  };

  const getIcon = (type) => {
    const icons = {
      promotion: '🎉',
      alert: '⚠️',
      order: '📦',
      info: 'ℹ️'
    };
    return icons[type] || '🔔';
  };

  useEffect(() => {
    // Initial fetch
    fetchNotifications();

    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
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

  const handleNotificationClick = (notification) => {
    // Mark as read in localStorage
    const readIds = getReadIds();
    if (!readIds.includes(notification._id)) {
      const updated = [...readIds, notification._id];
      saveReadIds(updated);
    }

    // Update state
    setNotifications(prev =>
      prev.map(n => n._id === notification._id ? { ...n, read: true } : n)
    );
    setUnreadIds(prev => prev.filter(id => id !== notification._id));
    setIsOpen(false);
  };

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n._id);
    saveReadIds(allIds);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadIds([]);
  };

  const clearAll = () => {
    // Clear read tracking from localStorage
    localStorage.removeItem('railbiteReadNotifications');
    setNotifications([]);
    setUnreadIds([]);
    setIsOpen(false);
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

  const unreadCount = unreadIds.length;

  return (
    <>
      {isOpen && (
        <div
          className="notification-overlay active"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="notification-wrapper" ref={wrapperRef}>
        <button
          className="notification-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          🔔
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </button>

        <div className={'notification-dropdown ' + (isOpen ? 'show active' : '')}>
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="notification-header-actions">
              {unreadCount > 0 && (
                <button
                  className="notification-action-btn"
                  onClick={markAllAsRead}
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  className="notification-action-btn danger"
                  onClick={clearAll}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="notification-list">
            {notifications.length > 0 ? (
              notifications.slice(0, 4).map((notification) => (
                <div
                  key={notification._id}
                  className={'notification-item ' + (!notification.read ? 'unread' : '')}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">{notification.icon}</div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">
                      {notification.message.length > 60
                        ? notification.message.substring(0, 60) + '...'
                        : notification.message}
                    </div>
                    <div className="notification-time">
                      {getRelativeTime(notification.time)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-notifications">
                <div className="no-notifications-icon">🔕</div>
                <p>No notifications yet</p>
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notification-footer">
              <button
                className="view-all-notifications"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/notifications');
                }}
              >
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
