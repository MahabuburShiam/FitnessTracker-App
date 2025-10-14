import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    userType: 'user',
    location: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bmi, setBmi] = useState(null);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // Calculate BMI when weight or height changes
  useEffect(() => {
    if (formData.weight && formData.height) {
      const heightInMeters = formData.height / 100;
      const calculatedBmi = (formData.weight / (heightInMeters * heightInMeters)).toFixed(2);
      setBmi(calculatedBmi);
    } else {
      setBmi(null);
    }
  }, [formData.weight, formData.height]);

  const getBmiCategory = (bmi) => {
    if (!bmi) return '';
    if (bmi < 18.5) return 'Underweight';
    if (bmi >= 18.5 && bmi < 24.9) return 'Normal weight';
    if (bmi >= 25 && bmi < 29.9) return 'Overweight';
    return 'Obesity';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (error) setError('');
  };

  const handleUserTypeSelect = (userType) => {
    setFormData({
      ...formData,
      userType
    });
  };

  const handleLocationAccess = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Location access denied. You can still register without location.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Convert string numbers to actual numbers
    const submissionData = {
      ...formData,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height)
    };

    const result = await register(submissionData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Start Your Journey</h1>
          <p>Create your fitness account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Account Type</label>
            <div className="user-type-grid">
              {['user', 'trainer', 'gym_owner'].map(type => (
                <label 
                  key={type}
                  className={`user-type-option ${formData.userType === type ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="userType"
                    value={type}
                    checked={formData.userType === type}
                    onChange={() => handleUserTypeSelect(type)}
                  />
                  {type === 'user' ? 'Fitness Enthusiast' : 
                   type === 'trainer' ? 'Personal Trainer' : 'Gym Owner'}
                </label>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              minLength="6"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                min="1"
                max="150"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Weight in kg"
                min="1"
                max="200"
                step="0.1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="height">Height (cm)</label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="Height in cm"
                min="1"
                max="300"
                step="0.1"
                required
              />
            </div>
          </div>

          {bmi && (
            <div className="bmi-preview">
              <div className="bmi-value">BMI: {bmi}</div>
              <div className="bmi-category">{getBmiCategory(bmi)}</div>
            </div>
          )}

          <div className="form-group">
            <label>Location (Optional)</label>
            <button
              type="button"
              className="submit-btn"
              onClick={handleLocationAccess}
              style={{ background: '#6c757d', marginBottom: '10px' }}
            >
              {formData.location ? '📍 Location Saved' : '📍 Use Current Location'}
            </button>
            <small style={{ color: '#666', display: 'block', textAlign: 'center' }}>
              {formData.location 
                ? 'Location will be used for nearby gyms and trainers'
                : 'Enable location for personalized gym and trainer recommendations'
              }
            </small>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? <div className="loading-spinner"></div> : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;