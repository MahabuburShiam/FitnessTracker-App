import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';

// Axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

const GymOwnerDashboard = () => {
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    gym_name: '',
    address: '',
    description: '',
    pricing: '',
    location_lat: '',
    location_lng: ''
  });

  useEffect(() => {
    fetchGymData();
  }, []);

  const fetchGymData = async () => {
    try {
      const res = await api.get('/users/profile');
      const userGym = res.data.user.gym || {};
      setGym(userGym);
      setEditForm({
        gym_name: userGym.gym_name || '',
        address: userGym.address || '',
        description: userGym.description || '',
        pricing: userGym.pricing || '',
        location_lat: userGym.location_lat || '',
        location_lng: userGym.location_lng || ''
      });
    } catch (err) {
      console.error('Fetch gym data error:', err);
      setError('Failed to load gym data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send all fields including location
      await api.post('/gyms', editForm);
      setShowEditModal(false);
      fetchGymData();
    } catch (err) {
      console.error('Update gym error:', err);
      setError('Failed to update gym');
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div>Loading...</div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h1>Gym Owner Dashboard</h1>
          <p className="text-muted">Manage your gym profile and connect with members.</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mt-4">
        <Col md={8}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Gym Profile</h5>
              <Button variant="primary" onClick={() => setShowEditModal(true)}>Edit Profile</Button>
            </Card.Header>
            <Card.Body>
              {gym ? (
                <>
                  <h4>{gym.gym_name}</h4>
                  <p><strong>Address:</strong> {gym.address}</p>
                  <p><strong>Description:</strong> {gym.description || 'No description provided'}</p>
                  <p><strong>Pricing:</strong> {gym.pricing || 'No pricing information'}</p>
                  <p><strong>Latitude:</strong> {gym.location_lat || 'Not set'}</p>
                  <p><strong>Longitude:</strong> {gym.location_lng || 'Not set'}</p>
                </>
              ) : (
                <p>No gym profile found. <Button variant="link" onClick={() => setShowEditModal(true)}>Create one now</Button></p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Quick Stats</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center">
                <h3>0</h3>
                <p className="text-muted">Total Members</p>
              </div>
              <div className="text-center mt-3">
                <h3>0</h3>
                <p className="text-muted">Messages</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit Gym Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Gym Profile</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Gym Name</Form.Label>
              <Form.Control
                type="text"
                value={editForm.gym_name}
                onChange={(e) => setEditForm({ ...editForm, gym_name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Pricing Information</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editForm.pricing}
                onChange={(e) => setEditForm({ ...editForm, pricing: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Latitude</Form.Label>
              <Form.Control
                type="number"
                value={editForm.location_lat}
                onChange={(e) => setEditForm({ ...editForm, location_lat: e.target.value })}
                step="any"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Longitude</Form.Label>
              <Form.Control
                type="number"
                value={editForm.location_lng}
                onChange={(e) => setEditForm({ ...editForm, location_lng: e.target.value })}
                step="any"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Changes</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default GymOwnerDashboard;
