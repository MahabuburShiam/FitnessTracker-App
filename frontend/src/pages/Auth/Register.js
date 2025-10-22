import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    user_type: 'user',
    first_name: '',
    last_name: '',
    location_lat: '',
    location_long: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    const result = await register(formData);
    
    if (result.success) {
      const userType = result.data.user.user_type;
      if (userType === 'admin') {
        navigate('/admin/dashboard');
      } else if (userType === 'gym_owner') {
        navigate('/gym-owner/dashboard');
      } else if (userType === 'trainer') {
        navigate('/trainer/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-4">Create Account</Card.Title>
              
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>User Type</Form.Label>
                  <Form.Select
                    name="user_type"
                    value={formData.user_type}
                    onChange={handleChange}
                  >
                    <option value="user">Normal User</option>
                    <option value="gym_owner">Gym Owner</option>
                    <option value="trainer">Trainer</option>
                  </Form.Select>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Latitude</Form.Label>
                      <Form.Control
                        type="number"
                        step="any"
                        name="location_lat"
                        value={formData.location_lat}
                        onChange={handleChange}
                        placeholder="e.g., 40.7128"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Longitude</Form.Label>
                      <Form.Control
                        type="number"
                        step="any"
                        name="location_long"
                        value={formData.location_long}
                        onChange={handleChange}
                        placeholder="e.g., -74.0060"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100" 
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Register'}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <Link to="/login">Already have an account? Login</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;