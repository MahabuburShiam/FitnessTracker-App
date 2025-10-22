import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Fetch user data on initial load if token exists
      api.get('/auth/me')
        .then(res => setCurrentUser(res.data.user))
        .catch(() => {
          // Token is invalid or expired, log the user out
          localStorage.removeItem('token');
          setCurrentUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setCurrentUser(user);

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      return { success: false, error: errorMessage };
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setCurrentUser(user);

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  const adminLogin = async (credentials) => {
    try {
      const response = await api.post('/auth/admin/login', credentials);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setCurrentUser(user);

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Admin login failed';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    register,
    login,
    adminLogin,
    logout,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.user_type === 'admin',
    isGymOwner: currentUser?.user_type === 'gym_owner',
    isTrainer: currentUser?.user_type === 'trainer',
    isNormalUser: currentUser?.user_type === 'user'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};