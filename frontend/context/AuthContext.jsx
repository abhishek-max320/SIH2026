'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hydrate token & user from localStorage
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('agrisentinel_token');
      const savedUser = localStorage.getItem('agrisentinel_user');
      if (savedToken && savedUser) {
        try {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        } catch (e) {
          localStorage.removeItem('agrisentinel_token');
          localStorage.removeItem('agrisentinel_user');
        }
      }
      setLoading(false);
    }
  }, []);

  const login = async (email, password, roleFallback = 'farmer') => {
    try {
      // In early phase, support demo credentials or live API
      let loggedUser = null;
      let authToken = null;

      try {
        const res = await apiClient.post('/auth/login', { email, password });
        loggedUser = res.user;
        authToken = res.access_token;
      } catch (err) {
        // Fallback for prototype testing if backend auth endpoint isn't seeded yet
        authToken = 'demo_jwt_token_' + Date.now();
        loggedUser = {
          id: 1,
          name: email.split('@')[0] || 'Farmer Rajesh Kumar',
          email: email,
          role: roleFallback || 'farmer',
          location: 'Punjab, India',
          farm_name: 'Green Field Farm',
          primary_crop: 'Wheat',
        };
      }

      setToken(authToken);
      setUser(loggedUser);
      localStorage.setItem('agrisentinel_token', authToken);
      localStorage.setItem('agrisentinel_user', JSON.stringify(loggedUser));
      return { success: true, user: loggedUser };
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('agrisentinel_token');
    localStorage.removeItem('agrisentinel_user');
  };

  const switchRole = (newRole) => {
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      localStorage.setItem('agrisentinel_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, switchRole, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
