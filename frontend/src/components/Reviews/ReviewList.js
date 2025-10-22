import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';

const ReviewList = ({ reviews, type }) => {
  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{type} Reviews ({reviews.length})</h5>
        {reviews.length > 0 && (
          <Badge bg="primary">
            {calculateAverageRating()} ★ Average
          </Badge>
        )}
      </Card.Header>
      <Card.Body className="p-0">
        {reviews.length === 0 ? (
          <div className="text-center p-3">
            <p className="text-muted">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <ListGroup variant="flush">
            {reviews.map(review => (
              <ListGroup.Item key={review.id}>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="mb-1">
                      {review.reviewer.first_name} {review.reviewer.last_name}
                    </h6>
                    <div className="mb-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span
                          key={star}
                          className={star <= review.rating ? 'text-warning' : 'text-muted'}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    {review.review_text && (
                      <p className="mb-1">{review.review_text}</p>
                    )}
                  </div>
                  <Badge bg="primary">{review.rating} ★</Badge>
                </div>
                <small className="text-muted">
                  {new Date(review.created_at).toLocaleDateString()}
                </small>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default ReviewList;