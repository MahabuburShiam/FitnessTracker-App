// src/components/Gym/GymCard.js
import React from 'react';
import './Gym.css';

const GymCard = ({ gym, onClick }) => {
  return (
    <div className="gym-card" onClick={() => onClick(gym.id)}>
      <div className="gym-image">
        <img src={gym.image || '/default-gym.jpg'} alt={gym.name} />
      </div>
      <div className="gym-info">
        <h3>{gym.name}</h3>
        <p className="gym-address">{gym.address}</p>
        {gym.distance && (
          <p className="gym-distance">{gym.distance.toFixed(1)} km away</p>
        )}
        <div className="gym-rating">
          <span className="rating">⭐ {gym.averageRating || 'No ratings'}</span>
          <span className="review-count">({gym.totalReviews || 0} reviews)</span>
        </div>
        <div className="gym-facilities">
          {gym.facilities?.slice(0, 3).map((facility, index) => (
            <span key={index} className="facility-tag">{facility}</span>
          ))}
          {gym.facilities?.length > 3 && (
            <span className="facility-tag">+{gym.facilities.length - 3} more</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GymCard;