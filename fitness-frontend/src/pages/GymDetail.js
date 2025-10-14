// src/pages/GymDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { gymAPI } from '../services/api';
import GymRating from '../components/Gym/GymRating';
import './GymDetail.css';

const GymDetail = () => {
  const { id } = useParams();
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(null);

  useEffect(() => {
    fetchGymDetails();
  }, [id]);

  const fetchGymDetails = async () => {
    try {
      // For now, we'll simulate getting a single gym
      // You might need to add a GET /gyms/:id endpoint
      const response = await gymAPI.getNearbyGyms({ limit: 50 });
      const foundGym = response.data.gyms.find(g => g.id === id);
      setGym(foundGym);
    } catch (error) {
      alert('Error fetching gym details: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = (newRating) => {
    setUserRating(newRating);
    // Refresh gym data to show updated rating
    fetchGymDetails();
  };

  if (loading) return <div className="loading">Loading gym details...</div>;
  if (!gym) return <div className="error">Gym not found</div>;

  return (
    <div className="gym-detail">
      <div className="gym-header">
        <h1>{gym.name}</h1>
        <div className="gym-rating-overview">
          <span className="rating">⭐ {gym.averageRating || 'No ratings'}</span>
          <span className="reviews">({gym.totalReviews} reviews)</span>
        </div>
      </div>

      <div className="gym-content">
        <div className="gym-info">
          <div className="info-section">
            <h3>Address</h3>
            <p>{gym.address}</p>
            {gym.distance && <p className="distance">{gym.distance.toFixed(1)} km away</p>}
          </div>

          <div className="info-section">
            <h3>Description</h3>
            <p>{gym.description || 'No description available.'}</p>
          </div>

          {gym.facilities && gym.facilities.length > 0 && (
            <div className="info-section">
              <h3>Facilities</h3>
              <div className="facilities-list">
                {gym.facilities.map((facility, index) => (
                  <span key={index} className="facility-tag">{facility}</span>
                ))}
              </div>
            </div>
          )}

          {gym.contactEmail || gym.contactPhone ? (
            <div className="info-section">
              <h3>Contact</h3>
              {gym.contactEmail && <p>Email: {gym.contactEmail}</p>}
              {gym.contactPhone && <p>Phone: {gym.contactPhone}</p>}
            </div>
          ) : null}
        </div>

        <div className="gym-rating-section">
          <GymRating 
            gymId={gym.id} 
            userRating={userRating}
            onRatingSubmit={handleRatingSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default GymDetail;