import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge, Modal } from 'react-bootstrap';
import axios from 'axios';
import ReviewList from '../Reviews/ReviewList';
import ReviewForm from '../Reviews/ReviewForm';

const GymSearch = () => {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    maxPrice: ''
  });
  const [selectedGym, setSelectedGym] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchGyms();
  }, []);

  const fetchGyms = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/gyms');
      setGyms(res.data);
    } catch (error) {
      console.error('Fetch gyms error:', error);
      setError('Failed to load gyms');
    } finally {
      setLoading(false);
    }
  };

  const fetchGymReviews = async (gymId) => {
    try {
      const res = await axios.get(`/api/reviews/gym/${gymId}`);
      setReviews(res.data);
    } catch (error) {
      console.error('Fetch gym reviews error:', error);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      await axios.post(`/api/reviews/gym/${selectedGym.id}`, reviewData);
      setShowReviewForm(false);
      fetchGymReviews(selectedGym.id);
    } catch (error) {
      throw new Error('Failed to submit review');
    }
  };

  const handleViewDetails = async (gym) => {
    setSelectedGym(gym);
    setShowDetails(true);
    fetchGymReviews(gym.id);
  };

  const calculateAverageRating = (gymReviews) => {
    if (!gymReviews || gymReviews.length === 0) return 0;
    const sum = gymReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / gymReviews.length).toFixed(1);
  };

  const filteredGyms = gyms.filter(gym => {
    const matchesSearch = gym.gym_name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         gym.address.toLowerCase().includes(filters.search.toLowerCase());
    return matchesSearch;
  });

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h1>Find Gyms</h1>
          <p className="text-muted">Discover gyms near you and find your perfect fitness home.</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mt-4">
        <Col md={3}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Filters</h5>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search gyms..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9}>
          {loading ? (
            <div className="text-center">Loading gyms...</div>
          ) : (
            <>
              <div className="mb-3">
                <p className="text-muted">
                  Showing {filteredGyms.length} of {gyms.length} gyms
                </p>
              </div>

              {filteredGyms.map(gym => (
                <Card key={gym.id} className="mb-3">
                  <Card.Body>
                    <Row>
                      <Col md={8}>
                        <Card.Title>{gym.gym_name}</Card.Title>
                        <Card.Text className="text-muted">{gym.address}</Card.Text>
                        <Card.Text>{gym.description}</Card.Text>
                        
                        {gym.reviews && gym.reviews.length > 0 && (
                          <div className="mb-2">
                            <Badge bg="success" className="me-2">
                              {calculateAverageRating(gym.reviews)} ★
                            </Badge>
                            <span className="text-muted">
                              ({gym.reviews.length} reviews)
                            </span>
                          </div>
                        )}
                        
                        {gym.pricing && (
                          <div>
                            <strong>Pricing:</strong>
                            <Badge bg="info" className="ms-1">
                              {gym.pricing}
                            </Badge>
                          </div>
                        )}
                      </Col>

                      <Col md={4}>
                        <div className="text-end">
                          <Button 
                            variant="outline-primary" 
                            className="me-2"
                            onClick={() => handleViewDetails(gym)}
                          >
                            View Details
                          </Button>
                          <Button variant="primary">
                            Message Owner
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}

              {filteredGyms.length === 0 && !loading && (
                <Card>
                  <Card.Body className="text-center">
                    <p className="text-muted">No gyms found matching your criteria.</p>
                    <Button variant="outline-primary" onClick={() => setFilters({ search: '', maxPrice: '' })}>
                      Clear Filters
                    </Button>
                  </Card.Body>
                </Card>
              )}
            </>
          )}
        </Col>
      </Row>

      {/* Gym Details Modal */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedGym?.gym_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedGym && (
            <>
              <Row>
                <Col md={8}>
                  <p><strong>Address:</strong> {selectedGym.address}</p>
                  <p><strong>Description:</strong> {selectedGym.description}</p>
                  <p><strong>Pricing:</strong> {selectedGym.pricing}</p>
                </Col>
                <Col md={4}>
                  <Button 
                    variant="primary" 
                    className="w-100 mb-2"
                    onClick={() => setShowReviewForm(true)}
                  >
                    Write Review
                  </Button>
                  <Button variant="outline-primary" className="w-100">
                    Message Owner
                  </Button>
                </Col>
              </Row>
              
              <hr />
              
              <ReviewList reviews={reviews} type="Gym" />
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Review Form Modal */}
      <Modal show={showReviewForm} onHide={() => setShowReviewForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Review {selectedGym?.gym_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReviewForm 
            onReviewSubmit={handleSubmitReview}
            type="gym"
            entityId={selectedGym?.id}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default GymSearch;