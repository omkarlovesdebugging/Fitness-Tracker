import React, { createContext, useState, useContext, useEffect } from 'react';
import { login, register, checkAuthStatus, logout as logoutService, requestOtp, verifyOtp } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await checkAuthStatus();
        setUser(userData);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginUser = async (credentials) => {
    const userData = await login(credentials);
    setUser(userData);
    return userData;
  };

  const registerUser = async (userData) => {
    const newUser = await register(userData);
    setUser(newUser);
    return newUser;
  };

  const logout = async () => {
    await logoutService();
    setUser(null);
  };

  const otpLogin = async (email, otp) => {
    const response = await verifyOtp(email, otp);
    setUser(response.user);
    return response;
  };

  const value = {
    user,
    loading,
    login: loginUser,
    register: registerUser,
    logout,
    requestOtp,
    otpLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};