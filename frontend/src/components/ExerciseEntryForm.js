import React, { useState } from 'react';
import { addExerciseEntry } from '../services/exerciseService';

const exerciseTypeIcons = {
  cardio: '🏃‍♂️',
  strength: '🏋️‍♂️',
  flexibility: '🧘‍♂️',
  sports: '⚽',
  other: '🎯'
};

const ExerciseEntryForm = ({ onEntryAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    caloriesBurned: '',
    date: new Date().toISOString().split('T')[0],
    exerciseType: 'cardio'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addExerciseEntry(formData);
      setFormData({
        name: '',
        duration: '',
        caloriesBurned: '',
        date: new Date().toISOString().split('T')[0],
        exerciseType: 'cardio'
      });
      if (onEntryAdded) onEntryAdded();
    } catch (error) {
      console.error('Error adding exercise entry:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="exercise-type-selector mb-8">
        <label className="form-label block mb-3">Select Exercise Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(exerciseTypeIcons).map(([type, icon]) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, exerciseType: type })}
              className={`exercise-type-btn ${formData.exerciseType === type ? 'active' : ''}`}
            >
              <span className="text-2xl">{icon}</span>
              <span className="capitalize">{type}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label className="form-label">Exercise Name</label>
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input pl-10"
              placeholder="e.g., Running, Swimming"
              required
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">
              {exerciseTypeIcons[formData.exerciseType]}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Duration</label>
          <div className="relative">
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="form-input pl-10"
              placeholder="Duration in minutes"
              required
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">⏱️</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Calories Burned</label>
          <div className="relative">
            <input
              type="number"
              name="caloriesBurned"
              value={formData.caloriesBurned}
              onChange={handleChange}
              className="form-input pl-10"
              placeholder="Estimated calories"
              required
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">🔥</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Date</label>
          <div className="relative">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input pl-10"
              required
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">📅</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="add-button mt-6"
      >
        <span role="img" aria-label="add">➕</span>
        Add Exercise
      </button>
    </form>
  );
};

export default ExerciseEntryForm;