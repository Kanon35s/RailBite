import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const savedNotifications = localStorage.getItem('railbiteNotifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  const saveNotifications = (updatedNotifications) => {
    setNotifications(updatedNotifications);
    localStorage.setItem('railbiteNotifications', JSON.stringify(updatedNotifications));
  };

  const markAsRead = (id) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter((n) => n.id !== id);
    saveNotifications(updated);
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem('railbiteNotifications');
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) {
      const mins = Math.floor(diffInSeconds / 60);
      return mins + ' minute' + (mins > 1 ? 's' : '') + ' ago';
    }
    if (diffInSeconds < 86400) {
      const hrs = Math.floor(diffInSeconds / 3600);
      return hrs + ' hour' + (hrs > 1 ? 's' : '') + ' ago';
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return days + ' day' + (days > 1 ? 's' : '') + ' ago';
    }
    const weeks = Math.floor(diffInSeconds / 604800);
    return weeks + ' week' + (weeks > 1 ? 's' : '') + ' ago';
  };

  const getFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = notifications.filter((n) => n.read).length;

  return (
    <div className="notifications-page">
      <div className="container">
        <div className="notifications-header">
          <div>
            <h1>Notifications</h1>
            <p className="notifications-subtitle">
              {unreadCount > 0 
                ? 'You have ' + unreadCount + ' unread notification' + (unreadCount > 1 ? 's' : '')
                : 'All caught up!'}
            </p>
          </div>
          <div className="notifications-actions">
            {notifications.length > 0 && unreadCount > 0 && (
              <button className="btn-secondary" onClick={markAllAsRead}>
                Mark all as read
              </button>
            )}
            {notifications.length > 0 && (
              <button className="btn-danger-outline" onClick={clearAll}>
                Clear all
              </button>
            )}
          </div>
        </div>

        <div className="notifications-filter">
          <button
            className={'filter-tab ' + (filter === 'all' ? 'active' : '')}
            onClick={() => setFilter('all')}
          >
            All ({notifications.length})
          </button>
          <button
            className={'filter-tab ' + (filter === 'unread' ? 'active' : '')}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
          <button
            className={'filter-tab ' + (filter === 'read' ? 'active' : '')}
            onClick={() => setFilter('read')}
          >
            Read ({readCount})
          </button>
        </div>

        <div className="notifications-list">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={'notification-card ' + (!notification.read ? 'unread' : '')}
              >
                <div className="notification-card-icon">
                  {notification.icon}
                </div>
                <div className="notification-card-content">
                  <div className="notification-card-header">
                    <h3>{notification.title}</h3>
                    {!notification.read && <span className="unread-dot"></span>}
                  </div>
                  <p className="notification-card-message">{notification.message}</p>
                  <div className="notification-card-footer">
                    <span className="notification-card-time">
                      {getRelativeTime(notification.time)}
                    </span>
                    <span className="notification-card-date">
                      {getFullDate(notification.time)}
                    </span>
                  </div>
                  <div className="notification-card-actions">
                    {notification.link && (
                      <button
                        className="btn-link-small"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        View details →
                      </button>
                    )}
                    {!notification.read && (
                      <button
                        className="btn-link-small"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      className="btn-link-small danger"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-notifications-page">
              <div className="no-notifications-icon">🔕</div>
              <h2>No {filter !== 'all' ? filter : ''} notifications</h2>
              <p>You are all caught up! Check back later for updates.</p>
              <button className="btn-primary" onClick={() => navigate('/')}>
                Back to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;