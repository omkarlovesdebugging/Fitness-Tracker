import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, updateCalorieGoal } from '../services/userService';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [formData, setFormData] = useState({
    name: '',
    weight: '',
    height: '',
    age: '',
    gender: '',
    activityLevel: '',
    goal: '',
    calorieGoal: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await getUserProfile();
      setProfile(data);
      setFormData({
        name: data.name,
        weight: data.weight,
        height: data.height,
        age: data.age,
        gender: data.gender,
        activityLevel: data.activityLevel,
        goal: data.goal,
        calorieGoal: data.calorieGoal
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile({
        name: formData.name,
        weight: Number(formData.weight),
        height: Number(formData.height),
        age: Number(formData.age),
        gender: formData.gender,
        activityLevel: formData.activityLevel,
        goal: formData.goal
      });
      
      if (formData.calorieGoal !== profile.calorieGoal) {
        await updateCalorieGoal(Number(formData.calorieGoal));
      }
      
      await fetchProfile();
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner" />
        <p>Loading your profile...</p>
      </div>
    );
  }

  const renderPersonalInfo = () => (
    <div className="profile-section">
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="avatar-text">{profile.name[0].toUpperCase()}</span>
        </div>
        <div className="profile-title">
          <h2>{profile.name}</h2>
          <p>{profile.email}</p>
        </div>
      </div>
      <div className="profile-stats">
        <div className="stat-card">
          <span className="stat-icon">⚖️</span>
          <span className="stat-value">{profile.weight}kg</span>
          <span className="stat-label">Weight</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📏</span>
          <span className="stat-value">{profile.height}cm</span>
          <span className="stat-label">Height</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🎯</span>
          <span className="stat-value">{profile.calorieGoal}</span>
          <span className="stat-label">Daily Goal</span>
        </div>
      </div>
    </div>
  );

  const renderFitnessGoals = () => (
    <div className="profile-section">
      <div className="goals-grid">
        <div className="goal-card">
          <h3>Current Goal</h3>
          <p className="goal-type">{profile.goal}</p>
          <div className="goal-progress">
            <div 
              className="progress-bar" 
              style={{ width: '75%' }}
              role="progressbar" 
              aria-valuenow={75} 
              aria-valuemin={0} 
              aria-valuemax={100}
            />
          </div>
          <p className="goal-status">75% to goal</p>
        </div>
        <div className="goal-card">
          <h3>Activity Level</h3>
          <p className="activity-level">{profile.activityLevel}</p>
          <div className="activity-stats">
            <div className="activity-stat">
              <span>🏃‍♂️</span>
              <p>Exercise: 3/5 days</p>
            </div>
            <div className="activity-stat">
              <span>🎯</span>
              <p>Calories: 2000/2500</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="profile-section">
      <div className="settings-grid">
        <div className="setting-card">
          <h3>Notifications</h3>
          <div className="setting-option">
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider round"></span>
            </label>
            <span>Daily Reminders</span>
          </div>
          <div className="setting-option">
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
            <span>Weekly Reports</span>
          </div>
        </div>
        <div className="setting-card">
          <h3>Privacy</h3>
          <div className="setting-option">
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider round"></span>
            </label>
            <span>Public Profile</span>
          </div>
          <div className="setting-option">
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider round"></span>
            </label>
            <span>Share Progress</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-nav">
        <button 
          className={`nav-item ${activeSection === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveSection('personal')}
        >
          <span role="img" aria-label="personal">👤</span> Personal
        </button>
        <button 
          className={`nav-item ${activeSection === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveSection('goals')}
        >
          <span role="img" aria-label="goals">🎯</span> Goals
        </button>
        <button 
          className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveSection('settings')}
        >
          <span role="img" aria-label="settings">⚙️</span> Settings
        </button>
        {!editing && (
          <button 
            className="edit-profile-btn"
            onClick={() => setEditing(true)}
          >
            <span role="img" aria-label="edit">✏️</span> Edit Profile
          </button>
        )}
      </div>

      <div className="profile-content">
        {editing ? (
          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Fitness Goals</h3>
              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Activity Level</label>
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select activity level</option>
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Lightly Active</option>
                  <option value="moderate">Moderately Active</option>
                  <option value="very">Very Active</option>
                  <option value="extra">Extra Active</option>
                </select>
              </div>
              <div className="form-group">
                <label>Goal</label>
                <select
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select goal</option>
                  <option value="lose">Lose Weight</option>
                  <option value="maintain">Maintain Weight</option>
                  <option value="gain">Gain Weight</option>
                </select>
              </div>
              <div className="form-group">
                <label>Daily Calorie Goal</label>
                <input
                  type="number"
                  name="calorieGoal"
                  value={formData.calorieGoal}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                <span role="img" aria-label="save">💾</span> Save Changes
              </button>
              <button 
                type="button" 
                onClick={() => setEditing(false)} 
                className="cancel-btn"
              >
                <span role="img" aria-label="cancel">❌</span> Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            {activeSection === 'personal' && renderPersonalInfo()}
            {activeSection === 'goals' && renderFitnessGoals()}
            {activeSection === 'settings' && renderSettings()}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;