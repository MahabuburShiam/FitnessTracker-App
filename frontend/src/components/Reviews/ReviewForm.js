import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';

const ReviewForm = ({ onReviewSubmit, type, entityId }) => {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onReviewSubmit({ 
        rating, 
        review_text: reviewText,
        entityId 
      });
      setReviewText('');
      setRating(5);
    } catch (error) {
      setError('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">Write a Review</h5>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Rating</Form.Label>
            <div>
              {[1, 2, 3, 4, 5].map(star => (
                <Button
                  key={star}
                  type="button"
                  variant={star <= rating ? 'warning' : 'outline-warning'}
                  className="me-1"
                  onClick={() => setRating(star)}
                >
                  {star} ★
                </Button>
              ))}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Review (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder={`Share your experience with this ${type}...`}
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ReviewForm;