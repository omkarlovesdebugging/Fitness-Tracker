import React, { useState, useEffect } from 'react';
import '../styles/forms.css';

export const BMICalculator = () => {
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    unit: 'metric' // metric (cm/kg) or imperial (ft/lbs)
  });
  const [bmiResult, setBmiResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const calculateBMI = (e) => {
    e.preventDefault();
    setError('');

    const { height, weight, unit } = formData;

    if (!height || !weight) {
      setError('Please enter both height and weight');
      return;
    }

    let heightInM, weightInKg;

    if (unit === 'metric') {
      // Convert cm to meters
      heightInM = parseFloat(height) / 100;
      weightInKg = parseFloat(weight);
    } else {
      // Convert feet to meters and lbs to kg
      heightInM = parseFloat(height) * 0.3048;
      weightInKg = parseFloat(weight) * 0.453592;
    }

    if (heightInM <= 0 || weightInKg <= 0) {
      setError('Please enter valid positive numbers');
      return;
    }

    const bmi = weightInKg / (heightInM * heightInM);
    const roundedBMI = Math.round(bmi * 10) / 10;

    let category = '';
    let categoryColor = '';
    let advice = '';

    if (roundedBMI < 18.5) {
      category = 'Underweight';
      categoryColor = '#3b82f6';
      advice = 'Consider increasing your caloric intake with nutrient-rich foods and consult a healthcare provider.';
    } else if (roundedBMI >= 18.5 && roundedBMI < 25) {
      category = 'Normal weight';
      categoryColor = '#059669';
      advice = 'Great! Maintain your current lifestyle with balanced diet and regular exercise.';
    } else if (roundedBMI >= 25 && roundedBMI < 30) {
      category = 'Overweight';
      categoryColor = '#d97706';
      advice = 'Consider incorporating more physical activity and a balanced diet to reach a healthier weight.';
    } else {
      category = 'Obese';
      categoryColor = '#dc2626';
      advice = 'We recommend consulting with a healthcare provider for a personalized weight management plan.';
    }

    setBmiResult({
      bmi: roundedBMI,
      category,
      categoryColor,
      advice
    });
  };

  const resetForm = () => {
    setFormData({
      height: '',
      weight: '',
      unit: 'metric'
    });
    setBmiResult(null);
    setError('');
  };

  return (
    <div className="bmi-calculator-container">
      <div className="bmi-form-wrapper">
        <form onSubmit={calculateBMI} className="bmi-form">
          {/* Unit Selector Section */}
          <div className="bmi-section">
            <div className="section-header">
              <h3 className="section-title">
                <span className="section-icon">⚙️</span>
                Choose Measurement Unit
              </h3>
              <p className="section-description">Select your preferred measurement system</p>
            </div>
            <div className="unit-selector">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, unit: 'metric', height: '', weight: '' }))}
                className={`unit-btn ${formData.unit === 'metric' ? 'active' : ''}`}
              >
                <span className="unit-emoji">📏</span>
                <span className="unit-name">Metric</span>
                <small className="unit-description">cm / kg</small>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, unit: 'imperial', height: '', weight: '' }))}
                className={`unit-btn ${formData.unit === 'imperial' ? 'active' : ''}`}
              >
                <span className="unit-emoji">📐</span>
                <span className="unit-name">Imperial</span>
                <small className="unit-description">ft / lbs</small>
              </button>
            </div>
          </div>

          {/* Input Fields Section */}
          <div className="bmi-section">
            <div className="section-header">
              <h3 className="section-title">
                <span className="section-icon">📊</span>
                Enter Your Measurements
              </h3>
              <p className="section-description">
                {formData.unit === 'metric' 
                  ? 'Enter your height in centimeters and weight in kilograms'
                  : 'Enter your height in feet (e.g., 5.8) and weight in pounds'
                }
              </p>
            </div>
            <div className="input-grid">
              <div className="input-group">
                <label className="input-label">
                  <span className="label-icon">📏</span>
                  Height {formData.unit === 'metric' ? '(cm)' : '(feet)'}
                </label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="form-input"
                    placeholder={formData.unit === 'metric' ? 'e.g., 175' : 'e.g., 5.8'}
                    step={formData.unit === 'metric' ? '1' : '0.1'}
                    min="0"
                  />
                  <span className="input-unit">{formData.unit === 'metric' ? 'cm' : 'ft'}</span>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">
                  <span className="label-icon">⚖️</span>
                  Weight {formData.unit === 'metric' ? '(kg)' : '(lbs)'}
                </label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="form-input"
                    placeholder={formData.unit === 'metric' ? 'e.g., 70' : 'e.g., 154'}
                    step={formData.unit === 'metric' ? '0.1' : '1'}
                    min="0"
                  />
                  <span className="input-unit">{formData.unit === 'metric' ? 'kg' : 'lbs'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-section">
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <span className="error-text">{error}</span>
              </div>
            </div>
          )}

          {/* Action Buttons Section */}
          <div className="bmi-section">
            <div className="form-actions">
              <button type="submit" className="calculate-btn">
                <span>⚖️</span>
                Calculate BMI
              </button>
              {bmiResult && (
                <button type="button" onClick={resetForm} className="reset-btn">
                  <span>🔄</span>
                  Reset Calculator
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* BMI Result Display */}
      {bmiResult && (
        <div className="bmi-result-container">
          <div className="bmi-result-card">
            <div className="bmi-header">
              <div className="bmi-icon">⚖️</div>
              <h3>Your BMI Result</h3>
            </div>
            
            <div className="bmi-score">
              <span className="bmi-number">{bmiResult.bmi}</span>
              <span className="bmi-unit">BMI</span>
            </div>
            
            <div 
              className="bmi-category"
              style={{ color: bmiResult.categoryColor }}
            >
              {bmiResult.category}
            </div>
            
            <div className="bmi-ranges">
              <div className="range-item">
                <span className="range-label">Underweight</span>
                <span className="range-value">&lt; 18.5</span>
              </div>
              <div className="range-item">
                <span className="range-label">Normal</span>
                <span className="range-value">18.5 - 24.9</span>
              </div>
              <div className="range-item">
                <span className="range-label">Overweight</span>
                <span className="range-value">25 - 29.9</span>
              </div>
              <div className="range-item">
                <span className="range-label">Obese</span>
                <span className="range-value">≥ 30</span>
              </div>
            </div>
            
            <div className="bmi-advice">
              <h4>💡 Recommendation</h4>
              <p>{bmiResult.advice}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BMICalculator;
