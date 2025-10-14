// src/components/Journal/JournalCard.js
import React from 'react';
import './Journal.css';

const JournalCard = ({ journal, onClick, showUser = true }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="journal-card" onClick={() => onClick(journal.id)}>
      <div className="journal-header">
        <h3 className="journal-title">{journal.title}</h3>
        {showUser && journal.User && (
          <div className="journal-author">
            By {journal.User.firstName} {journal.User.lastName}
          </div>
        )}
      </div>
      
      <div className="journal-meta">
        <span className="journal-category">{journal.category}</span>
        <span className="journal-date">{formatDate(journal.createdAt)}</span>
      </div>

      <div className="journal-content-preview">
        {journal.content.length > 150 
          ? `${journal.content.substring(0, 150)}...` 
          : journal.content
        }
      </div>

      {journal.tags && journal.tags.length > 0 && (
        <div className="journal-tags">
          {journal.tags.map((tag, index) => (
            <span key={index} className="journal-tag">#{tag}</span>
          ))}
        </div>
      )}

      <div className="journal-stats">
        <div className="journal-rating">
          ⭐ {journal.averageRating || 'No ratings'} 
          <span className="rating-count">({journal.totalRatings})</span>
        </div>
        <div className="journal-comments">
          💬 {journal.totalComments} comments
        </div>
      </div>
    </div>
  );
};

export default JournalCard;