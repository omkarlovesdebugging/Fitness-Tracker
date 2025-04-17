import React, { useState } from 'react';
import '../styles/forms.css';
import { addFoodEntry } from '../services/foodService';

const FoodEntryForm = ({ onEntryAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    date: new Date().toISOString().split('T')[0],
    mealType: '' // Added mealType field
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user makes changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await addFoodEntry(formData);
      if (response) {
        onEntryAdded();
        setFormData({
          name: '',
          calories: '',
          protein: '',
          carbs: '',
          fat: '',
          date: new Date().toISOString().split('T')[0],
          mealType: '' // Reset mealType
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add food entry. Please try again.');
      console.error('Error adding food entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      date: new Date().toISOString().split('T')[0],
      mealType: '' // Reset mealType
    });
    setError('');
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Track Your Food</h2>
        <p>Record what you've eaten to track your nutrition goals</p>
      </div>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="name">Food Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., Grilled Chicken Breast"
              required
            />
            <div className="form-helper">Enter the name of the food item</div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="mealType">Meal Type</label>
            <select
              id="mealType"
              name="mealType"
              value={formData.mealType}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select meal type</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
            <div className="form-helper">When did you eat this food?</div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="calories">Calories</label>
            <input
              id="calories"
              type="number"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., 250"
              min="0"
              required
            />
            <div className="form-helper">Total calories per serving</div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="protein">Protein (g)</label>
            <input
              id="protein"
              type="number"
              name="protein"
              value={formData.protein}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., 30"
              min="0"
            />
            <div className="form-helper">Grams of protein per serving</div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="carbs">Carbs (g)</label>
            <input
              id="carbs"
              type="number"
              name="carbs"
              value={formData.carbs}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., 45"
              min="0"
            />
            <div className="form-helper">Grams of carbohydrates per serving</div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="fat">Fat (g)</label>
            <input
              id="fat"
              type="number"
              name="fat"
              value={formData.fat}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., 12"
              min="0"
            />
            <div className="form-helper">Grams of fat per serving</div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-control"
              required
            />
            <div className="form-helper">Date you consumed this food</div>
          </div>
        </div>
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={handleClear}
          >
            Clear Form
          </button>
          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? (
              <span>Adding Entry...</span>
            ) : (
              <>
                <span>Add Food Entry</span>
                <span role="img" aria-label="food">🍽️</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FoodEntryForm;