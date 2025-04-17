import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/profile`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await axios.put(`${API_URL}/user/profile`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const updateCalorieGoal = async (calorieGoal) => {
  try {
    const response = await axios.put(`${API_URL}/user/calorie-goal`, { calorieGoal }, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};