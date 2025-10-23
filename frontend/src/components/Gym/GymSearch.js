import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge, Modal } from 'react-bootstrap';
import axios from 'axios';
import ReviewList from '../Reviews/ReviewList';
import ReviewForm from '../Reviews/ReviewForm';

// Base URL with port 5000
const BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
const token = localStorage.getItem('token');

// Create axios instance with base URL and token
const axiosInstance = axios.create({
  baseURL: BASE_URL,   // ✅ base URL points to 5000
  headers: {
    Authorization: `Bearer ${token || ''}`,
  },
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
      const res = await axiosInstance.get(`/reviews/gym/${gymId}`);
      setReviews(res.data);
    } catch (error) {
      console.error('Fetch gym reviews error:', error.response || error.message);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      await axiosInstance.post(`/reviews/gym/${selectedGym.id}`, reviewData);
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
      {/* ... rest of your JSX stays the same ... */}
    </Container>
  );
};

export default GymSearch;
