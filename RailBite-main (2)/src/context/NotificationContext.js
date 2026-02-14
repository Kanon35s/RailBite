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

    // inside NotificationProvider, after useEffect that loads localStorage
  useEffect(() => {
    // pseudo-code; you need api + role/group info
    const loadFromServer = async () => {
      try {
        const group = isStaff ? 'staff' : 'users';
        const res = await api.get(`/notifications/${group}`);
        const serverNotifications = res.data.data || [];
        // merge serverNotifications with local ones by id or time
      } catch (e) {}
    };
    loadFromServer();
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