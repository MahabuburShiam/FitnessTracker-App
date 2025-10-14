// src/pages/Gyms.js
import React, { useState, useEffect } from 'react';
import { gymAPI } from '../services/api';
import GymCard from '../components/Gym/GymCard';
import GymSearch from '../components/Gym/GymSearch';
import './Gyms.css';

const Gyms = () => {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleSearch = async (searchParams) => {
    setLoading(true);
    try {
      const response = await gymAPI.getNearbyGyms(searchParams);
      setGyms(response.data.gyms);
    } catch (error) {
      alert('Error fetching gyms: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGymClick = (gymId) => {
    window.location.href = `/gym/${gymId}`;
  };

  return (
    <div className="gyms-page">
      <div className="gyms-header">
        <h1>Find Gyms Near You</h1>
        <p>Discover the best gyms in your area</p>
      </div>

      <GymSearch onSearch={handleSearch} currentLocation={currentLocation} />

      {loading && <div className="loading">Loading gyms...</div>}

      <div className="gyms-grid">
        {gyms.map(gym => (
          <GymCard 
            key={gym.id} 
            gym={gym} 
            onClick={handleGymClick}
          />
        ))}
      </div>

      {gyms.length === 0 && !loading && (
        <div className="no-results">
          <p>No gyms found in your area. Try increasing the search radius.</p>
        </div>
      )}
    </div>
  );
};

export default Gyms;