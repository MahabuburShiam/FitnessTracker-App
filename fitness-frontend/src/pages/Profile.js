import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    location: null
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        age: user.age || '',
        weight: user.weight || '',
        height: user.height || '',
        gender: user.gender || '',
        location: user.location || null
      });
    }
  }, [user]);

  const calculateBMI = () => {
    if (formData.weight && formData.height) {
      const heightInMeters = formData.height / 100;
      return (formData.weight / (heightInMeters * heightInMeters)).toFixed(2);
    }
    return null;
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return '';
    if (bmi < 18.5) return 'Underweight';
    if (bmi >= 18.5 && bmi < 24.9) return 'Normal weight';
    if (bmi >= 25 && bmi < 29.9) return 'Overweight';
    return 'Obesity';
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to change password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error changing password' });
    } finally {
      setLoading(false);
    }
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
          setMessage({ type: 'success', text: 'Location updated successfully!' });
        },
        (error) => {
          setMessage({ type: 'error', text: 'Location access denied' });
        }
      );
    } else {
      setMessage({ type: 'error', text: 'Geolocation not supported' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChangeInput = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Your Profile</h1>
        <p>Manage your personal information and settings</p>
      </div>

      <div className="profile-container">
        {/* Sidebar Navigation */}
        <div className="profile-sidebar">
          <div className="user-summary">
            <div className="user-avatar">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div className="user-info">
              <h3>{user?.firstName} {user?.lastName}</h3>
              <p className="user-email">{user?.email}</p>
              <span className="user-type-badge">{user?.userType}</span>
            </div>
          </div>

          <nav className="profile-nav">
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              📝 Personal Info
            </button>
            <button 
              className={`nav-item ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              🔒 Change Password
            </button>
            <button 
              className={`nav-item ${activeTab === 'fitness' ? 'active' : ''}`}
              onClick={() => setActiveTab('fitness')}
            >
              💪 Fitness Stats
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="profile-content">
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          {/* Personal Info Tab */}
          {activeTab === 'profile' && (
            <div className="profile-section">
              <h2>Personal Information</h2>
              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Age *</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      min="1"
                      max="150"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender *</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Weight (kg) *</label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      min="1"
                      max="200"
                      step="0.1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Height (cm) *</label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      min="1"
                      max="300"
                      step="0.1"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <div className="location-section">
                    <button
                      type="button"
                      className="location-btn"
                      onClick={handleLocationAccess}
                    >
                      {formData.location ? '📍 Update Location' : '📍 Use Current Location'}
                    </button>
                    {formData.location && (
                      <div className="location-coordinates">
                        Lat: {formData.location.latitude?.toFixed(4)}, 
                        Lng: {formData.location.longitude?.toFixed(4)}
                      </div>
                    )}
                  </div>
                  <small>Location helps find nearby gyms and trainers</small>
                </div>

                <button 
                  type="submit" 
                  className="save-btn"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* Change Password Tab */}
          {activeTab === 'password' && (
            <div className="profile-section">
              <h2>Change Password</h2>
              <form onSubmit={handlePasswordChange} className="profile-form">
                <div className="form-group">
                  <label>Current Password *</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChangeInput}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>New Password *</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChangeInput}
                    required
                    minLength="6"
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChangeInput}
                    required
                    minLength="6"
                  />
                </div>

                <button 
                  type="submit" 
                  className="save-btn"
                  disabled={loading}
                >
                  {loading ? 'Changing Password...' : 'Change Password'}
                </button>
              </form>
            </div>
          )}

          {/* Fitness Stats Tab */}
          {activeTab === 'fitness' && (
            <div className="profile-section">
              <h2>Fitness Statistics</h2>
              
              <div className="fitness-stats">
                <div className="stat-card">
                  <div className="stat-icon">⚖️</div>
                  <div className="stat-content">
                    <h3>Body Mass Index (BMI)</h3>
                    <div className="stat-value">{bmi || '--'}</div>
                    <div className={`stat-category ${bmiCategory?.toLowerCase().replace(' ', '-')}`}>
                      {bmiCategory || 'Calculate BMI by entering weight and height'}
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-content">
                    <h3>User Type</h3>
                    <div className="stat-value">{user?.userType}</div>
                    <div className="stat-description">
                      {user?.userType === 'user' && 'Fitness Enthusiast'}
                      {user?.userType === 'trainer' && 'Personal Trainer'}
                      {user?.userType === 'gym_owner' && 'Gym Business Owner'}
                      {user?.userType === 'admin' && 'System Administrator'}
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">🎯</div>
                  <div className="stat-content">
                    <h3>Account Created</h3>
                    <div className="stat-value">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '--'}
                    </div>
                    <div className="stat-description">
                      Member since
                    </div>
                  </div>
                </div>
              </div>

              <div className="bmi-info">
                <h4>BMI Categories:</h4>
                <div className="bmi-categories">
                  <div className="bmi-category-item">
                    <span className="category-dot underweight"></span>
                    <span>Underweight: &lt; 18.5</span>
                  </div>
                  <div className="bmi-category-item">
                    <span className="category-dot normal"></span>
                    <span>Normal weight: 18.5 - 24.9</span>
                  </div>
                  <div className="bmi-category-item">
                    <span className="category-dot overweight"></span>
                    <span>Overweight: 25 - 29.9</span>
                  </div>
                  <div className="bmi-category-item">
                    <span className="category-dot obesity"></span>
                    <span>Obesity: ≥ 30</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;