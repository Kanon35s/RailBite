import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('railbiteUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Simulate login - in production, this would call your backend API
    const userData = {
      email,
      name: email.split('@')[0],
      id: Date.now()
    };
    setUser(userData);
    localStorage.setItem('railbiteUser', JSON.stringify(userData));
    return { success: true };
  };

  const register = (fullName, email, phone, password) => {
    // Simulate registration - in production, this would call your backend API
    const userData = {
      email,
      name: fullName,
      phone,
      id: Date.now()
    };
    setUser(userData);
    localStorage.setItem('railbiteUser', JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('railbiteUser');
    localStorage.removeItem('railbiteCart');
    localStorage.removeItem('railbiteOrderType');
    localStorage.removeItem('railbiteBooking');
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
