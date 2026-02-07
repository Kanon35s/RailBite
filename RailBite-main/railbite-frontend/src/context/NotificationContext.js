// src/context/NotificationContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import { notificationsAPI } from '../services/api';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within NotificationProvider'
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNotifications = async (filter) => {
    try {
      setLoading(true);
      setError(null);
      const res = await notificationsAPI.listMy(filter);
      if (res.data.success) {
        setNotifications(res.data.data || []);
        // backend already returns unreadCount, but recompute for safety
        const unread = (res.data.data || []).filter((n) => !n.read).length;
        setUnreadCount(unread);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('loadNotifications error:', err);
      setError(
        err.response?.data?.message || 'Failed to load notifications'
      );
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const refreshUnreadCount = async () => {
    try {
      const res = await notificationsAPI.unreadCount();
      if (res.data.success) {
        setUnreadCount(res.data.count || 0);
      }
    } catch (err) {
      console.error('refreshUnreadCount error:', err);
      // keep existing unreadCount on error
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('markAllAsRead error:', err);
    }
  };

  const markNotificationRead = async (id) => {
    try {
      const res = await notificationsAPI.markOneRead(id);
      if (res.data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (err) {
      console.error('markNotificationRead error:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationsAPI.deleteOne(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      // recompute unread
      setUnreadCount((prev) =>
        Math.max(
          (notifications.filter((n) => !n.read && n._id !== id).length),
          0
        )
      );
    } catch (err) {
      console.error('deleteNotification error:', err);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await notificationsAPI.clearAll();
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error('clearAllNotifications error:', err);
    }
  };

  // For now, "addNotification" is an in-memory helper for UI; real
  // backend creation is driven from orderController / server side.
  const addNotificationLocal = (notification) => {
    const newNotification = {
      _id: Date.now().toString(),
      read: false,
      createdAt: new Date().toISOString(),
      ...notification,
    };
    setNotifications((prev) => [newNotification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  // Initial load
  useEffect(() => {
    loadNotifications('unread'); // or 'all'
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    loadNotifications,
    refreshUnreadCount,
    markAllAsRead,
    markNotificationRead,
    deleteNotification,
    clearAllNotifications,
    addNotificationLocal,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

