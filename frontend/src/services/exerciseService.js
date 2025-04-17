import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getExerciseEntries = async (date) => {
  try {
    const response = await axios.get(`${API_URL}/exercise?date=${date}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const addExerciseEntry = async (exerciseData) => {
  try {
    const response = await axios.post(`${API_URL}/exercise`, exerciseData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const updateExerciseEntry = async (id, exerciseData) => {
  try {
    const response = await axios.put(`${API_URL}/exercise/${id}`, exerciseData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const deleteExerciseEntry = async (id) => {
  try {
    await axios.delete(`${API_URL}/exercise/${id}`, {
      withCredentials: true,
    });
    return true;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
