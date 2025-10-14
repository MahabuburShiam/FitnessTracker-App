// src/pages/TrainerDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { trainerAPI } from '../services/api';
import TrainerRating from '../components/Trainer/TrainerRating';
import './TrainerDetail.css';

const TrainerDetail = () => {
  const { id } = useParams();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(null);

  useEffect(() => {
    fetchTrainerDetails();
  }, [id]);

  const fetchTrainerDetails = async () => {
    try {
      // For now, we'll simulate getting a single trainer
      // You might need to add a GET /trainers/:id endpoint
      const response = await trainerAPI.getTrainers({ limit: 50 });
      const foundTrainer = response.data.trainers.find(t => t.id === id);
      setTrainer(foundTrainer);
    } catch (error) {
      alert('Error fetching trainer details: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = (newRating) => {
    setUserRating(newRating);
    // Refresh trainer data to show updated rating
    fetchTrainerDetails();
  };

  if (loading) return <div className="loading">Loading trainer details...</div>;
  if (!trainer) return <div className="error">Trainer not found</div>;

  const trainerProfile = trainer.TrainerProfile || {};

  return (
    <div className="trainer-detail">
      <div className="trainer-header">
        <div className="trainer-basic-info">
          <img 
            src={trainer.profileImage || '/default-trainer.jpg'} 
            alt={`${trainer.firstName} ${trainer.lastName}`}
            className="trainer-avatar"
          />
          <div className="trainer-info">
            <h1>{trainer.firstName} {trainer.lastName}</h1>
            <div className="trainer-rating-overview">
              <span className="rating">⭐ {trainerProfile.averageRating || 'No ratings'}</span>
              <span className="reviews">({trainerProfile.totalReviews} reviews)</span>
            </div>
            <p className="trainer-rate">${trainerProfile.hourlyRate}/hour</p>
          </div>
        </div>
      </div>

      <div className="trainer-content">
        <div className="trainer-info">
          <div className="info-section">
            <h3>About</h3>
            <p>{trainerProfile.bio || 'No bio available.'}</p>
          </div>

          <div className="info-section">
            <h3>Specializations</h3>
            <div className="specializations-list">
              {trainerProfile.specialization?.map((spec, index) => (
                <span key={index} className="specialization-tag">
                  {spec.replace('_', ' ').toUpperCase()}
                </span>
              )) || 'No specializations listed'}
            </div>
          </div>

          <div className="info-section">
            <h3>Experience & Certifications</h3>
            <p><strong>Experience:</strong> {trainerProfile.experience} years</p>
            {trainerProfile.certifications && trainerProfile.certifications.length > 0 && (
              <div className="certifications-list">
                <strong>Certifications:</strong>
                <ul>
                  {trainerProfile.certifications.map((cert, index) => (
                    <li key={index}>{cert}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {trainerProfile.languages && trainerProfile.languages.length > 0 && (
            <div className="info-section">
              <h3>Languages</h3>
              <div className="languages-list">
                {trainerProfile.languages.map((language, index) => (
                  <span key={index} className="language-tag">{language}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="trainer-rating-section">
          <TrainerRating 
            trainerId={trainer.id} 
            userRating={userRating}
            onRatingSubmit={handleRatingSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default TrainerDetail;