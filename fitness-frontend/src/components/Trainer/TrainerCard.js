// src/components/Trainer/TrainerCard.js
import React from 'react';
import './Trainer.css';

const TrainerCard = ({ trainer, onClick }) => {
  const trainerProfile = trainer.TrainerProfile || {};
  
  return (
    <div className="trainer-card" onClick={() => onClick(trainer.id)}>
      <div className="trainer-image">
        <img src={trainer.profileImage || '/default-trainer.jpg'} alt={`${trainer.firstName} ${trainer.lastName}`} />
      </div>
      <div className="trainer-info">
        <h3>{trainer.firstName} {trainer.lastName}</h3>
        <p className="trainer-specialization">
          {trainerProfile.specialization?.join(', ') || 'General Fitness'}
        </p>
        <div className="trainer-rating">
          <span className="rating">⭐ {trainerProfile.averageRating || 'No ratings'}</span>
          <span className="review-count">({trainerProfile.totalReviews || 0} reviews)</span>
        </div>
        <div className="trainer-details">
          <p className="experience">{trainerProfile.experience} years experience</p>
          <p className="rate">${trainerProfile.hourlyRate}/hour</p>
        </div>
        {trainerProfile.certifications && trainerProfile.certifications.length > 0 && (
          <div className="trainer-certifications">
            {trainerProfile.certifications.slice(0, 2).map((cert, index) => (
              <span key={index} className="cert-tag">{cert}</span>
            ))}
            {trainerProfile.certifications.length > 2 && (
              <span className="cert-tag">+{trainerProfile.certifications.length - 2} more</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerCard;