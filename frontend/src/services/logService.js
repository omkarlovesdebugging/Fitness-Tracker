import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Food Logging
export const getFoodEntries = async (date) => {
  try {
    const response = await axios.get(`${API_URL}/food`, {
      params: { date },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch food entries' };
  }
};

export const addFoodEntry = async (foodData) => {
  try {
    const response = await axios.post(`${API_URL}/food`, foodData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to add food entry' };
  }
};

export const updateFoodEntry = async (id, foodData) => {
  try {
    const response = await axios.put(`${API_URL}/food/${id}`, foodData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to update food entry' };
  }
};

export const deleteFoodEntry = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/food/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to delete food entry' };
  }
};

// Exercise Logging
export const getExerciseEntries = async (date) => {
  try {
    const response = await axios.get(`${API_URL}/exercise`, {
      params: { date },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch exercise entries' };
  }
};

export const addExerciseEntry = async (exerciseData) => {
  try {
    const response = await axios.post(`${API_URL}/exercise`, exerciseData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to add exercise entry' };
  }
};

export const updateExerciseEntry = async (id, exerciseData) => {
  try {
    const response = await axios.put(`${API_URL}/exercise/${id}`, exerciseData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to update exercise entry' };
  }
};

export const deleteExerciseEntry = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/exercise/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to delete exercise entry' };
  }
};

// Example usage for food entry:
/*
const foodEntry = {
  name: 'Chicken Breast',
  calories: 165,
  protein: 31,
  carbs: 0,
  fat: 3.6,
  date: '2025-04-14',
  mealType: 'lunch'
};
*/

// Example usage for exercise entry:
/*
const exerciseEntry = {
  name: 'Running',
  duration: 30,
  caloriesBurned: 300,
  date: '2025-04-14',
  exerciseType: 'cardio'
};
*/
