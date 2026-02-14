// src/components/NotificationBell.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

function NotificationBell() {
  const {
    notifications,
    unreadCount,
    loading,
    markAllAsRead,
    markNotificationRead,
    deleteNotification,
  } = useNotification();

  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setIsOpen((prev) => !prev);
  };

  const handleNotificationClick = async (notification) => {
    // mark as read in backend
    if (!notification.read && notification._id) {
      await markNotificationRead(notification._id);
    }

    setIsOpen(false);

    // Navigate if backend stored a link (your Notification model has `link`)
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDeleteNotification = async (notification) => {
    if (notification._id) {
      await deleteNotification(notification._id);
    }
  };

  const handleViewAll = () => {
    setIsOpen(false);
    navigate('/notifications'); // if you have a notifications page
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) {
      const mins = Math.floor(diffInSeconds / 60);
      return `${mins}m ago`;
    }
    if (diffInSeconds < 86400) {
      const hrs = Math.floor(diffInSeconds / 3600);
      return `${hrs}h ago`;
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks}w ago`;
  };

  return (
    <div
      ref={wrapperRef}
      className="relative inline-block text-left"
    >
      {/* Bell icon */}
      <button
        type="button"
        onClick={handleBellClick}
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white shadow hover:bg-gray-100 transition"
        aria-label="Notifications"
      >
        <span className="text-xl">🔔</span>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Notifications</h3>
              <p className="text-xs text-gray-500">
                {loading
                  ? 'Loading notifications...'
                  : unreadCount > 0
                  ? `${unreadCount} unread`
                  : 'All caught up'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-sm text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`px-4 py-3 flex items-start gap-3 border-b cursor-pointer hover:bg-gray-50 ${
                    !notif.read ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notif)}
                >
                  <div className="mt-0.5 text-lg">
                    {/* Simple icon based on type */}
                    {notif.type === 'promotion' && '🎉'}
                    {notif.type === 'order' && '✅'}
                    {notif.type === 'system' && '📢'}
                    {!['promotion', 'order', 'system'].includes(
                      notif.type
                    ) && '🔔'}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p
                        className={`text-sm font-semibold ${
                          !notif.read ? 'text-gray-900' : 'text-gray-700'
                        }`}
                      >
                        {notif.title}
                      </p>
                      <span className="text-xs text-gray-400 ml-2">
                        {getRelativeTime(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {notif.message}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notif);
                    }}
                    className="text-xs text-gray-400 hover:text-red-500"
                    aria-label="Delete notification"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-2 border-t flex justify-between items-center">
            <button
              type="button"
              onClick={handleViewAll}
              className="text-xs text-blue-600 hover:underline"
            >
              View all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
