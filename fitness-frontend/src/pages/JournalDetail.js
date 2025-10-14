// src/pages/JournalDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { journalAPI } from '../services/api';
import JournalComments from '../components/Journal/JournalComments';
import JournalRating from '../components/Journal/JournalRating';
import './Journal.css';

const JournalDetail = () => {
  const { id } = useParams();
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(null);

  useEffect(() => {
    fetchJournalDetail();
  }, [id]);

  const fetchJournalDetail = async () => {
    try {
      // For now, we'll get from the list - you might need to add a detail endpoint
      const response = await journalAPI.getJournals({ limit: 50 });
      const foundJournal = response.journals.find(j => j.id === id);
      setJournal(foundJournal);
    } catch (error) {
      alert('Error fetching journal details: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = (newRating) => {
    setUserRating(newRating);
    fetchJournalDetail(); // Refresh to get updated ratings
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <div className="loading">Loading journal...</div>;
  if (!journal) return <div className="error">Journal not found</div>;

  return (
    <div className="journal-detail">
      <div className="journal-detail-header">
        <button onClick={() => window.history.back()} className="btn-back">
          ← Back
        </button>
        
        <h1>{journal.title}</h1>
        
        <div className="journal-meta-detail">
          <span className="author">
            By {journal.User?.firstName} {journal.User?.lastName}
          </span>
          <span className="date">{formatDate(journal.createdAt)}</span>
          <span className="category">{journal.category}</span>
        </div>

        <div className="journal-stats-detail">
          <div className="rating">
            ⭐ {journal.averageRating || 'No ratings'} ({journal.totalRatings} ratings)
          </div>
          <div className="comments">
            💬 {journal.totalComments} comments
          </div>
        </div>
      </div>

      <div className="journal-content-full">
        {journal.content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {journal.tags && journal.tags.length > 0 && (
        <div className="journal-tags-detail">
          {journal.tags.map((tag, index) => (
            <span key={index} className="journal-tag">#{tag}</span>
          ))}
        </div>
      )}

      <div className="journal-interactions">
        <JournalRating
          journalId={journal.id}
          userRating={userRating}
          onRatingSubmit={handleRatingSubmit}
        />
        
        <JournalComments journalId={journal.id} />
      </div>
    </div>
  );
};

export default JournalDetail;