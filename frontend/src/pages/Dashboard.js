import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import DailyCaloriesSummary from '../components/DailyCaloriesSummary';
import FoodEntryForm from '../components/FoodEntryForm';
import ExerciseEntryForm from '../components/ExerciseEntryForm';
import { getFoodEntries } from '../services/foodService';
import { getExerciseEntries } from '../services/exerciseService';
import { getUserProfile } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';
import {BMICalculator} from '../components/BMICalculator';

const Dashboard = () => {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date());
  const [foodEntries, setFoodEntries] = useState([]);
  const [exerciseEntries, setExerciseEntries] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');

  // Calculate total calories
  const totalCaloriesConsumed = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalCaloriesBurned = exerciseEntries.reduce((sum, entry) => sum + entry.caloriesBurned, 0);
  
  // Calculate remaining calories (goal - consumed + burned)
  const remainingCalories = userProfile ? userProfile.calorieGoal - totalCaloriesConsumed + totalCaloriesBurned : 0;
  
  // Net calories is what the user has consumed after accounting for exercise
  const netCalories = totalCaloriesConsumed - totalCaloriesBurned;
  
  // Calculate percentage of goal consumed for progress bar
  const caloriePercentage = userProfile ? 
    Math.min(100, Math.max(0, (totalCaloriesConsumed - totalCaloriesBurned) / userProfile.calorieGoal * 100)) : 0;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const [foodData, exerciseData, profileData] = await Promise.all([
          getFoodEntries(formattedDate),
          getExerciseEntries(formattedDate),
          getUserProfile()
        ]);

        setFoodEntries(foodData);
        setExerciseEntries(exerciseData);
        setUserProfile(profileData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  const handleDateChange = (e) => {
    setDate(new Date(e.target.value));
  };

  const refreshData = async () => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const [foodData, exerciseData] = await Promise.all([
      getFoodEntries(formattedDate),
      getExerciseEntries(formattedDate)
    ]);

    setFoodEntries(foodData);
    setExerciseEntries(exerciseData);
  };

  if (loading || !userProfile) {
    return (
      <div className="dashboard-container flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-blue-100">Track your fitness journey</p>
            </div>
            <div className="date-picker-container">
              <input
                type="date"
                value={format(date, 'yyyy-MM-dd')}
                onChange={handleDateChange}
                className="date-picker"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon calories-icon text-white">🔥</div>
            <h3 className="text-gray-500 text-sm font-medium">Calories Remaining</h3>
            <p className="text-2xl font-bold mt-1">{remainingCalories} / {userProfile.calorieGoal}</p>
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${caloriePercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon food-icon text-white">🍎</div>
            <h3 className="text-gray-500 text-sm font-medium">Food Intake</h3>
            <p className="text-2xl font-bold mt-1">{totalCaloriesConsumed} cal</p>
            <p className="text-sm text-gray-500 mt-1">{foodEntries.length} meals today</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon exercise-icon text-white">💪</div>
            <h3 className="text-gray-500 text-sm font-medium">Calories Burned</h3>
            <p className="text-2xl font-bold mt-1">{totalCaloriesBurned} cal</p>
            <p className="text-sm text-gray-500 mt-1">{exerciseEntries.length} workouts today</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon goal-icon text-white">🎯</div>
            <h3 className="text-gray-500 text-sm font-medium">Daily Goal</h3>
            <p className="text-2xl font-bold mt-1">{userProfile.calorieGoal} cal</p>
            <p className="text-sm text-gray-500 mt-1">Goal: {userProfile.goal}</p>
          </div>
        </div>

        <div className="tab-container">
          <div className="tab-buttons">
            <button
              onClick={() => setActiveTab('summary')}
              className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`}
            >
              <span role="img" aria-label="summary">📊</span>
              Summary
            </button>
            <button
              onClick={() => setActiveTab('food')}
              className={`tab-button ${activeTab === 'food' ? 'active' : ''}`}
            >
              <span role="img" aria-label="food">🍽️</span>
              Add Food
            </button>
            <button
              onClick={() => setActiveTab('exercise')}
              className={`tab-button ${activeTab === 'exercise' ? 'active' : ''}`}
            >
              <span role="img" aria-label="exercise">💪</span>
              Add Exercise
            </button>
            <button
              onClick={() => setActiveTab('bmi')}
              className={`tab-button ${activeTab === 'bmi' ? 'active' : ''}`}
            >
              <span role="img" aria-label="bmi">⚖️</span>
              BMI Calculator
            </button>
          </div>

          <div className="tab-content mt-6">
            {activeTab === 'summary' && (
              <div className="space-y-6">
                <DailyCaloriesSummary
                  foodEntries={foodEntries}
                  exerciseEntries={exerciseEntries}
                  calorieGoal={userProfile.calorieGoal}
                />
                
                {foodEntries.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Today's Meals</h3>
                    <div className="entry-list">
                      {foodEntries.map(entry => (
                        <div key={entry._id} className="entry-item">
                          <div className="entry-details">
                            <span className="entry-name">{entry.name}</span>
                            <span className="entry-meta">{entry.mealType || "No meal type"}</span>
                          </div>
                          <span className="entry-calories calories-gained">+{entry.calories} cal</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {exerciseEntries.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Today's Workouts</h3>
                    <div className="entry-list">
                      {exerciseEntries.map(entry => (
                        <div key={entry._id} className="entry-item">
                          <div className="entry-details">
                            <span className="entry-name">{entry.name}</span>
                            <span className="entry-meta">{entry.duration} minutes</span>
                          </div>
                          <span className="entry-calories calories-burned">-{entry.caloriesBurned} cal</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'food' && (
              <div className="form-container">
                <h2 className="form-title">Add Food Entry</h2>
                <FoodEntryForm date={date} onSuccess={refreshData} />
              </div>
            )}

            {activeTab === 'exercise' && (
              <div className="form-container">
                <h2 className="form-title">Add Exercise Entry</h2>
                <ExerciseEntryForm date={date} onSuccess={refreshData} />
              </div>
            )}
            {/* BMI Calculator form */}
            {activeTab === 'bmi' && (
              <div className="form-container">
                <h2 className="form-title">Calculate Your BMI ⚖️</h2>
                <BMICalculator date={date} onSuccess={refreshData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;