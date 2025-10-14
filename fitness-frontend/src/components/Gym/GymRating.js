// src/components/Gym/GymRating.js
import React, { useState } from 'react';
import { gymAPI } from '../../services/api';

const GymRating = ({ gymId, userRating, onRatingSubmit }) => {
  const [rating, setRating] = useState(userRating?.rating || 0);
  const [review, setReview] = useState(userRating?.review || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await gymAPI.rateGym(gymId, { rating, review });
      onRatingSubmit({ rating, review });
      alert('Rating submitted successfully!');
    } catch (error) {
      alert('Error submitting rating: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rating-form">
      <h4>Rate this Gym</h4>
      <form onSubmit={handleSubmit}>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`star ${star <= rating ? 'active' : ''}`}
              onClick={() => setRating(star)}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          placeholder="Write your review (optional)"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows="4"
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Rating'}
        </button>
      </form>
    </div>
  );
};

export default GymRating;