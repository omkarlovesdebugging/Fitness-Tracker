import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { getFoodEntries, deleteFoodEntry } from '../services/foodService';
import FoodEntryForm from '../components/FoodEntryForm';
import '../styles/logs.css';

const FoodLog = () => {
  const [date, setDate] = useState(new Date());
  const [foodEntries, setFoodEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchFoodEntries = useCallback(async () => {
    setLoading(true);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const data = await getFoodEntries(formattedDate);
      setFoodEntries(data);
    } catch (error) {
      console.error('Error fetching food entries:', error);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchFoodEntries();
  }, [fetchFoodEntries]);

  const handleDateChange = (e) => {
    setDate(new Date(e.target.value));
  };

  const handleDeleteEntry = async (id) => {
    try {
      await deleteFoodEntry(id);
      fetchFoodEntries();
    } catch (error) {
      console.error('Error deleting food entry:', error);
    }
  };

  const handleAddEntry = () => {
    setShowAddForm(true);
  };

  const handleEntryAdded = () => {
    setShowAddForm(false);
    fetchFoodEntries();
  };

  return (
    <div className="log-container">
      <div className="container mx-auto">
        <div className="log-header">
          <h1 className="log-title">Food Journal</h1>
          <p className="log-subtitle">Track your daily nutrition</p>
          <div className="log-controls">
            <div className="date-control">
              <input
                type="date"
                value={format(date, 'yyyy-MM-dd')}
                onChange={handleDateChange}
                className="log-date-picker"
              />
            </div>
            <button onClick={handleAddEntry} className="add-entry-btn">
              <span role="img" aria-label="add">➕</span>
              Add Food Entry
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
          </div>
        ) : showAddForm ? (
          <div className="form-container">
            <FoodEntryForm onEntryAdded={handleEntryAdded} />
          </div>
        ) : (
          <div className="entries-grid">
            {foodEntries.length > 0 ? (
              foodEntries.map((entry) => (
                <div key={entry._id} className="entry-card">
                  <div className="entry-header">
                    <h3 className="entry-name">{entry.name}</h3>
                    <span className="entry-calories calories-gained">+{entry.calories} cal</span>
                  </div>
                  <div className="entry-details">
                    <div className="detail-item">
                      <span>Meal Type</span>
                      <span className="capitalize">{entry.mealType}</span>
                    </div>
                    <div className="detail-item">
                      <span>Protein</span>
                      <span>{entry.protein}g</span>
                    </div>
                    <div className="detail-item">
                      <span>Carbs</span>
                      <span>{entry.carbs}g</span>
                    </div>
                    <div className="detail-item">
                      <span>Fat</span>
                      <span>{entry.fat}g</span>
                    </div>
                  </div>
                  <div className="entry-actions">
                    <button 
                      onClick={() => handleDeleteEntry(entry._id)} 
                      className="action-btn delete-btn"
                    >
                      <span role="img" aria-label="delete">🗑️</span> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🍽️</div>
                <h3 className="empty-title">No Food Entries Yet</h3>
                <p className="empty-text">Start tracking your meals by adding your first food entry.</p>
                <button onClick={handleAddEntry} className="add-entry-btn">
                  <span role="img" aria-label="add">➕</span>
                  Add Your First Meal
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodLog;