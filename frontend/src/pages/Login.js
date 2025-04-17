import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, requestOtp, otpLogin } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setOtpError('');
    setOtpSuccess('');
  };

  const handleOtpRequest = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    setOtpError('');
    setOtpSuccess('');
    try {
      await requestOtp(formData.email);
      setOtpSent(true);
      setOtpSuccess('OTP sent to your email.');
    } catch (err) {
      setOtpError(err.message || 'Failed to send OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    setOtpError('');
    setOtpSuccess('');
    try {
      const response = await otpLogin(formData.email, otp);
      if (response?.user) {
        navigate('/dashboard');
      }
    } catch (err) {
      setOtpError(err.message || 'Invalid or expired OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await login(formData);
      if (response?.user) {
        if (response.access_token) {
          localStorage.setItem('token', response.access_token);
        }
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.message || 'Failed to login. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <span role="img" aria-label="fitness">🏃</span>
            <span>Fitness Tracker</span>
          </div>
          <h1 className="auth-title">Welcome Back!</h1>
          <p className="auth-subtitle">Sign in to continue your fitness journey</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {!showOtp ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-input-group">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <input
                type="email"
                id="email"
                name="email"
                className={`auth-input ${error ? 'error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="auth-input-group">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className={`auth-input ${error ? 'error' : ''}`}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            <button 
              type="submit" 
              className="auth-submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={otpSent ? handleOtpVerify : handleOtpRequest} className="auth-form">
            <div className="auth-input-group">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <input
                type="email"
                id="otp-email"
                name="email"
                className={`auth-input ${otpError ? 'error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={otpSent}
              />
            </div>
            {otpSent && (
              <div className="auth-input-group">
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  className={`auth-input ${otpError ? 'error' : ''}`}
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  required
                />
              </div>
            )}
            {otpError && <div className="auth-error">{otpError}</div>}
            {otpSuccess && <div className="auth-success">{otpSuccess}</div>}
            <button
              type="submit"
              className="auth-submit"
              disabled={otpLoading}
            >
              {otpLoading ? (otpSent ? 'Verifying...' : 'Sending...') : (otpSent ? 'Verify OTP' : 'Send OTP')}
            </button>
          </form>
        )}
        <div className="auth-alt-action">
          <button
            type="button"
            className="auth-link"
            onClick={() => {
              setShowOtp(!showOtp);
              setOtp('');
              setOtpSent(false);
              setOtpError('');
              setOtpSuccess('');
            }}
          >
            {showOtp ? 'Use Password Login' : 'Use OTP Login'}
          </button>
        </div>

        <div className="auth-divider">
          <span>Don't have an account?</span>
        </div>

        <div className="auth-alt-action">
          <Link to="/register" className="auth-link">
            Create a new account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;