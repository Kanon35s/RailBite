import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('railbiteUser');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('railbiteUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('railbiteUser');
    }
  }, [user]);

  const login = (email, password) => {
    // Mock login - replace with actual API call
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: email,
      phone: '+880 1712345678',
      joinDate: new Date().toISOString()
    };
    setUser(mockUser);
    return Promise.resolve(mockUser);
  };

  const register = (name, email, phone, password) => {
    // Mock register - replace with actual API call
    const newUser = {
      id: Date.now(),
      name,
      email,
      phone,
      joinDate: new Date().toISOString()
    };
    setUser(newUser);
    return Promise.resolve(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
