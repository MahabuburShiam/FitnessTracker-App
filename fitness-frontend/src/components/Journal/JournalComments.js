// src/components/Journal/JournalComments.js
import React, { useState, useEffect } from 'react';
import { journalAPI } from '../../services/api';
import './Journal.css';

const JournalComments = ({ journalId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [journalId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await journalAPI.getJournalComments(journalId);
      setComments(response.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await journalAPI.addComment(journalId, { content: newComment });
      setNewComment('');
      fetchComments(); // Refresh comments
    } catch (error) {
      alert('Error adding comment: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="loading">Loading comments...</div>;

  return (
    <div className="journal-comments-section">
      <h4>Comments ({comments.length})</h4>
      
      <form onSubmit={handleSubmitComment} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows="3"
        />
        <button type="submit" disabled={submitting || !newComment.trim()}>
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment.id} className="comment">
            <div className="comment-header">
              <strong>{comment.User?.firstName} {comment.User?.lastName}</strong>
              <span className="comment-date">{formatDate(comment.createdAt)}</span>
            </div>
            <div className="comment-content">{comment.content}</div>
          </div>
        ))}
        
        {comments.length === 0 && (
          <div className="no-comments">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalComments;