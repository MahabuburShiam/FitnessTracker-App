import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';

const TrainerSearch = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    specialty: '',
    maxPrice: ''
  });

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/trainers');
      setTrainers(res.data);
    } catch (error) {
      console.error('Fetch trainers error:', error);
      setError('Failed to load trainers');
    } finally {
      setLoading(false);
    }
  };

  const filteredTrainers = trainers.filter(trainer => {
    const matchesSearch = 
      trainer.user.first_name.toLowerCase().includes(filters.search.toLowerCase()) ||
      trainer.user.last_name.toLowerCase().includes(filters.search.toLowerCase()) ||
      trainer.specialties?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesSpecialty = !filters.specialty || 
      trainer.specialties?.toLowerCase().includes(filters.specialty.toLowerCase());
    
    const matchesPrice = !filters.maxPrice || 
      (trainer.charge_per_hour && trainer.charge_per_hour <= parseFloat(filters.maxPrice));
    
    return matchesSearch && matchesSpecialty && matchesPrice;
  });

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const specialties = [...new Set(trainers.flatMap(t => 
    t.specialties ? t.specialties.split(',').map(s => s.trim()) : []
  ))];

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h1>Find Trainers</h1>
          <p className="text-muted">Connect with certified trainers to achieve your fitness goals.</p>
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
                  placeholder="Search trainers..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Specialty</Form.Label>
                <Form.Select
                  value={filters.specialty}
                  onChange={(e) => setFilters({...filters, specialty: e.target.value})}
                >
                  <option value="">Any specialty</option>
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Max Hourly Rate</Form.Label>
                <Form.Select
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                >
                  <option value="">Any price</option>
                  <option value="50">Under $50</option>
                  <option value="100">Under $100</option>
                  <option value="150">Under $150</option>
                  <option value="200">Under $200</option>
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9}>
          {loading ? (
            <div className="text-center">Loading trainers...</div>
          ) : (
            <>
              <div className="mb-3">
                <p className="text-muted">
                  Showing {filteredTrainers.length} of {trainers.length} trainers
                </p>
              </div>

              {filteredTrainers.map(trainer => (
                <Card key={trainer.id} className="mb-3">
                  <Card.Body>
                    <Row>
                      <Col md={8}>
                        <Card.Title>
                          {trainer.user.first_name} {trainer.user.last_name}
                        </Card.Title>
                        
                        {trainer.qualifications && (
                          <Card.Text>
                            <strong>Qualifications:</strong> {trainer.qualifications}
                          </Card.Text>
                        )}

                        {trainer.specialties && (
                          <div className="mb-2">
                            <strong>Specialties:</strong>
                            {trainer.specialties.split(',').map(specialty => (
                              <Badge key={specialty} bg="primary" className="ms-1">
                                {specialty.trim()}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {trainer.charge_per_hour && (
                          <Card.Text>
                            <strong>Rate:</strong> ${trainer.charge_per_hour}/hour
                          </Card.Text>
                        )}

                        {trainer.availability && trainer.availability.length > 0 && (
                          <Card.Text>
                            <strong>Availability:</strong>{' '}
                            {trainer.availability.slice(0, 3).map(avail => (
                              <Badge key={avail.id} bg="success" className="me-1">
                                {avail.day_of_week}
                              </Badge>
                            ))}
                            {trainer.availability.length > 3 && (
                              <Badge bg="light" text="dark">
                                +{trainer.availability.length - 3} more days
                              </Badge>
                            )}
                          </Card.Text>
                        )}
                      </Col>

                      <Col md={4}>
                        <div className="text-end">
                          <div className="mb-2">
                            <span className="h4 text-warning">
                              {calculateAverageRating(trainer.reviews)} ★
                            </span>
                            <span className="text-muted">
                              ({trainer.reviews?.length || 0} reviews)
                            </span>
                          </div>
                          
                          <Button variant="outline-primary" className="me-2">
                            View Profile
                          </Button>
                          <Button variant="primary">
                            Message Trainer
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}

              {filteredTrainers.length === 0 && !loading && (
                <Card>
                  <Card.Body className="text-center">
                    <p className="text-muted">No trainers found matching your criteria.</p>
                    <Button variant="outline-primary" onClick={() => setFilters({ search: '', specialty: '', maxPrice: '' })}>
                      Clear Filters
                    </Button>
                  </Card.Body>
                </Card>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default TrainerSearch;