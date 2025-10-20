import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import * as journalApi from '../../api/journal';

const Rating = ({ entryId, initialRating, onRatingSubmitted }) => {
  const { token } = useAuth();
  const [rating, setRating] = useState(initialRating || 0);
  const [hover, setHover] = useState(0);

  const handleSubmitRating = async (newRating) => {
    try {
      const updatedEntry = await journalApi.addRating(entryId, { rating: newRating }, token);
      onRatingSubmitted(updatedEntry);
      setRating(newRating);
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  };

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={starValue}
            type="button"
            className={`text-2xl ${starValue <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            onClick={() => handleSubmitRating(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
          >
            &#9733;
          </button>
        );
      })}
    </div>
  );
};

export const AverageRating = ({ ratings }) => {
  if (!ratings || ratings.length === 0) {
    return <span className="text-sm text-gray-500">Not yet rated</span>;
  }
  const avg = ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length;
  return (
    <div className="flex items-center">
      <span className="text-yellow-400 text-lg">&#9733;</span>
      <span className="font-bold ml-1">{avg.toFixed(1)}</span>
      <span className="text-sm text-gray-500 ml-2">({ratings.length} ratings)</span>
    </div>
  );
};

export default Rating;