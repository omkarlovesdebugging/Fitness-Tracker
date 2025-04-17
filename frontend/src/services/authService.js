import axios from 'axios';

const API_URL = '/api';

// Axios interceptor to add token to requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    const { user, access_token } = response.data;
    
    if (access_token) {
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to login' };
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const checkAuthStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/status`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const requestOtp = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/request-otp`, { email });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || { message: 'Failed to send OTP' };
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });
    const { user, access_token } = response.data;
    if (access_token) {
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to verify OTP' };
  }
};

export const logout = async () => {
  try {
    await axios.post(`${API_URL}/auth/logout`, {}, {
      withCredentials: true,
    });
    return true;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
