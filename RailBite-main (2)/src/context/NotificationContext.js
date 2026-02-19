import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('railbiteNotifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  }, []);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      read: false,
      time: new Date().toISOString(),
      ...notification
    };

    const updated = [newNotification, ...notifications];
    setNotifications(updated);
    localStorage.setItem('railbiteNotifications', JSON.stringify(updated));
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('railbiteNotifications');
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      addNotification, 
      clearNotifications 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};