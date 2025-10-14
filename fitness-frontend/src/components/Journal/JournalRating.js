// src/components/Journal/JournalRating.js
import React, { useState } from 'react';
import { journalAPI } from '../../services/api';
import './Journal.css';

const JournalRating = ({ journalId, userRating, onRatingSubmit }) => {
  const [rating, setRating] = useState(userRating?.rating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRating = async (newRating) => {
    setRating(newRating);
    setIsSubmitting(true);
    
    try {
      await journalAPI.rateJournal(journalId, newRating);
      onRatingSubmit({ rating: newRating });
    } catch (error) {
      alert('Error submitting rating: ' + error.message);
      setRating(userRating?.rating || 0); // Revert on error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="journal-rating-widget">
      <h5>Rate this journal</h5>
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star ${star <= rating ? 'active' : ''}`}
            onClick={() => handleRating(star)}
            disabled={isSubmitting}
          >
            ★
          </button>
        ))}
      </div>
      <div className="rating-text">
        {rating === 0 ? 'Select a rating' : `You rated ${rating} star${rating > 1 ? 's' : ''}`}
      </div>
    </div>
  );
};

export default JournalRating;