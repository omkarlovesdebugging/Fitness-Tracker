import React from 'react';
import './DailyCaloriesSummary.css';

const DailyCaloriesSummary = ({ date, foodEntries }) => {
  const totalCalories = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalProtein = foodEntries.reduce((sum, entry) => sum + (entry.protein || 0), 0);
  const totalCarbs = foodEntries.reduce((sum, entry) => sum + (entry.carbs || 0), 0);
  const totalFat = foodEntries.reduce((sum, entry) => sum + (entry.fat || 0), 0);

  // Target values (you can make these dynamic based on user goals)
  const targetCalories = 2000;
  const targetProtein = 150;
  const targetCarbs = 250;
  const targetFat = 70;

  // Calculate percentages for progress bars
  // Calculate remaining values
  const remainingCalories = Math.max(targetCalories - totalCalories, 0);
  const remainingProtein = Math.max(targetProtein - totalProtein, 0);
  const remainingCarbs = Math.max(targetCarbs - totalCarbs, 0);
  const remainingFat = Math.max(targetFat - totalFat, 0);

  // Calculate percentages for progress bars
  const caloriesPercentage = Math.min((totalCalories / targetCalories) * 100, 100);
  const proteinPercentage = Math.min((totalProtein / targetProtein) * 100, 100);
  const carbsPercentage = Math.min((totalCarbs / targetCarbs) * 100, 100);
  const fatPercentage = Math.min((totalFat / targetFat) * 100, 100);

  // Helper function to determine progress bar color
  const getProgressColor = (percentage) => {
    if (percentage > 100) return 'danger';
    if (percentage > 85) return 'warning';
    return '';
  };

  return (
    <div className="summary-card">
      <div className="summary-header">
        <h2>Daily Summary</h2>
        <span className="summary-date">{date}</span>
      </div>
      <div className="summary-grid">
        <div className="summary-item">
          <div className="metric-label">Calories</div>
          <div className="metric-value">{totalCalories}</div>
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className={`progress-fill ${getProgressColor(caloriesPercentage)}`}
                style={{ width: `${caloriesPercentage}%` }}
              />
            </div>
            <div className="remaining-text">{remainingCalories} remaining</div>
          </div>
        </div>

        <div className="summary-item">
          <div className="metric-label">Protein</div>
          <div className="metric-value">{totalProtein}g</div>
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className={`progress-fill ${getProgressColor(proteinPercentage)}`}
                style={{ width: `${proteinPercentage}%` }}
              />
            </div>
            <div className="remaining-text">{remainingProtein}g remaining</div>
          </div>
        </div>

        <div className="summary-item">
          <div className="metric-label">Carbs</div>
          <div className="metric-value">{totalCarbs}g</div>
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className={`progress-fill ${getProgressColor(carbsPercentage)}`}
                style={{ width: `${carbsPercentage}%` }}
              />
            </div>
            <div className="remaining-text">{remainingCarbs}g remaining</div>
          </div>
        </div>

        <div className="summary-item">
          <div className="metric-label">Fat</div>
          <div className="metric-value">{totalFat}g</div>
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className={`progress-fill ${getProgressColor(fatPercentage)}`}
                style={{ width: `${fatPercentage}%` }}
              />
            </div>
            <div className="remaining-text">{remainingFat}g remaining</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyCaloriesSummary;