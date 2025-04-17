
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getFoodEntries = async (date) => {
  try {
    const response = await axios.get(`${API_URL}/food?date=${date}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const addFoodEntry = async (foodData) => {
  try {
    const response = await axios.post(`${API_URL}/food`, foodData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const updateFoodEntry = async (id, foodData) => {
  try {
    const response = await axios.put(`${API_URL}/food/${id}`, foodData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const deleteFoodEntry = async (id) => {
  try {
    await axios.delete(`${API_URL}/food/${id}`, {
      withCredentials: true,
    });
    return true;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};