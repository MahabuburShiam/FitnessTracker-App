import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';

const AdvancedSearch = ({ type, onResults }) => {
  const [filters, setFilters] = useState({
    search: '',
    lat: '',
    lng: '',
    radius: 50,
    minRating: '',
    maxPrice: '',
    specialties: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFilters({
            ...filters,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your current location');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = type === 'gym' ? '/api/search/gyms/advanced' : '/api/search/trainers/advanced';
      const res = await axios.get(endpoint, { params: filters });
      onResults(res.data);
    } catch (error) {
      console.error('Advanced search error:', error);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      lat: '',
      lng: '',
      radius: 50,
      minRating: '',
      maxPrice: '',
      specialties: ''
    });
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Advanced Search</h5>
        <Button variant="outline-secondary" size="sm" onClick={clearFilters}>
          Clear
        </Button>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Search</Form.Label>
            <Form.Control
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder={`Search ${type}s...`}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Row>
              <Col>
                <Form.Control
                  type="number"
                  step="any"
                  name="lat"
                  value={filters.lat}
                  onChange={handleChange}
                  placeholder="Latitude"
                />
              </Col>
              <Col>
                <Form.Control
                  type="number"
                  step="any"
                  name="lng"
                  value={filters.lng}
                  onChange={handleChange}
                  placeholder="Longitude"
                />
              </Col>
            </Row>
            <Button 
              variant="outline-primary" 
              size="sm" 
              className="mt-2"
              onClick={getCurrentLocation}
            >
              Use My Location
            </Button>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Search Radius: {filters.radius} km</Form.Label>
            <Form.Range
              name="radius"
              value={filters.radius}
              onChange={handleChange}
              min="1"
              max="100"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Minimum Rating</Form.Label>
            <Form.Select
              name="minRating"
              value={filters.minRating}
              onChange={handleChange}
            >
              <option value="">Any rating</option>
              <option value="4">4 ★ & above</option>
              <option value="3">3 ★ & above</option>
              <option value="2">2 ★ & above</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Max Price {type === 'trainer' ? 'per hour' : ''}</Form.Label>
            <Form.Control
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder={`Maximum budget`}
            />
          </Form.Group>

          {type === 'trainer' && (
            <Form.Group className="mb-3">
              <Form.Label>Specialties</Form.Label>
              <Form.Control
                type="text"
                name="specialties"
                value={filters.specialties}
                onChange={handleChange}
                placeholder="e.g., yoga, weightlifting, cardio"
              />
              <Form.Text className="text-muted">
                Separate multiple specialties with commas
              </Form.Text>
            </Form.Group>
          )}

          <Button 
            variant="primary" 
            type="submit" 
            className="w-100" 
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AdvancedSearch;