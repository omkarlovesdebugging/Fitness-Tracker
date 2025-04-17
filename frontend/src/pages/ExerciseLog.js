import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { getExerciseEntries, deleteExerciseEntry } from '../services/exerciseService';
import ExerciseEntryForm from '../components/ExerciseEntryForm';
import '../styles/logs.css';

const ExerciseLog = () => {
  const [date, setDate] = useState(new Date());
  const [exerciseEntries, setExerciseEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchExerciseEntries = useCallback(async () => {
    setLoading(true);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const data = await getExerciseEntries(formattedDate);
      setExerciseEntries(data);
    } catch (error) {
      console.error('Error fetching exercise entries:', error);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchExerciseEntries();
  }, [fetchExerciseEntries]);

  const handleDateChange = (e) => {
    setDate(new Date(e.target.value));
  };

  const handleDeleteEntry = async (id) => {
    try {
      await deleteExerciseEntry(id);
      fetchExerciseEntries();
    } catch (error) {
      console.error('Error deleting exercise entry:', error);
    }
  };

  const handleAddEntry = () => {
    setShowAddForm(true);
  };

  const handleEntryAdded = () => {
    setShowAddForm(false);
    fetchExerciseEntries();
  };

  return (
    <div className="log-container">
      <div className="container mx-auto">
        <div className="log-header">
          <h1 className="log-title">Exercise Journal</h1>
          <p className="log-subtitle">Track your daily workouts</p>
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
              Add Exercise
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
          </div>
        ) : showAddForm ? (
          <div className="form-container">
            <ExerciseEntryForm onEntryAdded={handleEntryAdded} />
          </div>
        ) : (
          <div className="entries-grid">
            {exerciseEntries.length > 0 ? (
              exerciseEntries.map((entry) => (
                <div key={entry._id} className="entry-card">
                  <div className="entry-header">
                    <h3 className="entry-name">{entry.name}</h3>
                    <span className="entry-calories calories-burned">-{entry.caloriesBurned} cal</span>
                  </div>
                  <div className="entry-details">
                    <div className="detail-item">
                      <span>Exercise Type</span>
                      <span className="capitalize">{entry.exerciseType}</span>
                    </div>
                    <div className="detail-item">
                      <span>Duration</span>
                      <span>{entry.duration} minutes</span>
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
                <div className="empty-icon">🏃‍♂️</div>
                <h3 className="empty-title">No Exercise Entries Yet</h3>
                <p className="empty-text">Start tracking your workouts by adding your first exercise.</p>
                <button onClick={handleAddEntry} className="add-entry-btn">
                  <span role="img" aria-label="add">➕</span>
                  Add Your First Exercise
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseLog;