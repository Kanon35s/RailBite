import React, { createContext, useState, useContext, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const savedAdmin = localStorage.getItem('railbiteAdmin');
    if (savedAdmin) {
      const admin = JSON.parse(savedAdmin);
      setAdminUser(admin);
      setIsAdminAuthenticated(true);
    }
  }, []);

  const adminLogin = (credentials) => {
    // Demo admin credentials - replace with actual API call
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      const admin = {
        id: 1,
        username: credentials.username,
        name: 'Admin User',
        role: 'admin',
        email: 'admin@railbite.com'
      };
      setAdminUser(admin);
      setIsAdminAuthenticated(true);
      localStorage.setItem('railbiteAdmin', JSON.stringify(admin));
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const adminLogout = () => {
    setAdminUser(null);
    setIsAdminAuthenticated(false);
    localStorage.removeItem('railbiteAdmin');
  };

  const value = {
    adminUser,
    isAdminAuthenticated,
    adminLogin,
    adminLogout
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
