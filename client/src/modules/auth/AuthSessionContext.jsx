import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';

const AuthSessionContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storeUser = localStorage.getItem('user');
    if (token && storeUser) {
      try {
        setUser(JSON.parse(storeUser));
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    const { token: authToken, user: userData } = res.data;

    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));

    setToken(authToken);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password, role) => {
    const res = await apiClient.post('/auth/register', { name, email, password, role });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // 🔑 Calculate whether current logged-in user is an admin
  const isAdmin = user?.role === 'admin';

  return (
    <AuthSessionContext.Provider value={{ user, token, loading, isAdmin, login, logout, register }}>
      {children}
    </AuthSessionContext.Provider>
  );
};

export const useAuth = () => useContext(AuthSessionContext);
