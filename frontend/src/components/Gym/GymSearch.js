import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge, Modal } from 'react-bootstrap';
import axios from 'axios';
import ReviewList from '../Reviews/ReviewList';
import ReviewForm from '../Reviews/ReviewForm';

// Base URL with port 5000
const BASE_URL = 'http://localhost:5000/api';

// Create axios instance with base URL and token
const axiosInstance = axios.create({
  baseURL: BASE_URL,   // ✅ base URL points to 5000
});

// Use an interceptor to dynamically add the token to every request
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

const GymSearch = () => {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', maxPrice: '' });
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
      const res = await axiosInstance.get('/gyms'); // ✅ goes to port 5000
      setGyms(res.data);
    } catch (error) {
      console.error('Fetch gyms error:', error.response || error.message);
      setError('Failed to load gyms');
    } finally {
      setLoading(false);
    }
  };

  const fetchGymReviews = async (gymId) => {
    try {
      const res = await axiosInstance.get(`/gyms/${gymId}/reviews`);
      setReviews(res.data);
    } catch (error) {
      console.error('Fetch gym reviews error:', error.response || error.message);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      await axiosInstance.post(`/gyms/${selectedGym.id}/reviews`, reviewData);
      setShowReviewForm(false);
      fetchGymReviews(selectedGym.id);
    } catch (error) {
      console.error('Failed to submit review:', error.response || error.message);
    }
  };

  const handleViewDetails = (gym) => {
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
      <h2 className="mb-4 text-center">Find a Gym</h2>

      <Row className="justify-content-center mb-4">
        <Col md={8}>
          <Form>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Search by gym name or address..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>

      {loading && <div className="text-center">Loading gyms...</div>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {filteredGyms.map(gym => (
          <Col md={4} key={gym.id} className="mb-4">
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{gym.gym_name}</Card.Title>
                <Card.Text>
                  {gym.address}
                  {gym.distance !== null && (
                    <Badge bg="info" className="ms-2">{gym.distance.toFixed(1)} km away</Badge>
                  )}
                </Card.Text>
                <Button variant="primary" onClick={() => handleViewDetails(gym)}>
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Gym Details Modal */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedGym?.gym_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedGym && (
            <div>
              <h5>Address</h5>
              <p>{selectedGym.address}</p>

              <h5>Facilities</h5>
              <p>{selectedGym.facilities}</p>

              <hr />

              <div className="d-flex justify-content-between align-items-center">
                <h4>
                  Reviews <Badge bg="secondary">{calculateAverageRating(reviews)} ★</Badge>
                </h4>
                <Button variant="outline-primary" onClick={() => setShowReviewForm(true)}>
                  Write a Review
                </Button>
              </div>

              <ReviewList reviews={reviews} />
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Review Form Modal */}
      <Modal show={showReviewForm} onHide={() => setShowReviewForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Write a review for {selectedGym?.gym_name}</Modal.Title>
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
