import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';

// Create axios instance with base URL and token handling
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to include token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const TrainerDashboard = () => {
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchTrainerData();
  }, []);

  const fetchTrainerData = async () => {
    try {
      const res = await api.get('/users/profile'); // token sent automatically
      setTrainer(res.data.user.trainer_profile);
      setEditForm(res.data.user.trainer_profile || {});
    } catch (error) {
      console.error('Fetch trainer data error:', error);
      setError('Failed to load trainer data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/trainers/profile', editForm); // token sent automatically
      setShowEditModal(false);
      fetchTrainerData();
    } catch (error) {
      console.error('Update trainer error:', error);
      setError('Failed to update trainer profile');
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">Loading...</div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h1>Trainer Dashboard</h1>
          <p className="text-muted">Manage your trainer profile and connect with clients.</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mt-4">
        <Col md={8}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Trainer Profile</h5>
              <Button variant="primary" onClick={() => setShowEditModal(true)}>
                Edit Profile
              </Button>
            </Card.Header>
            <Card.Body>
              {trainer ? (
                <>
                  <h4>Trainer Profile</h4>
                  <p><strong>Qualifications:</strong> {trainer.qualifications || 'No qualifications provided'}</p>
                  <p><strong>Specialties:</strong> {trainer.specialties || 'No specialties provided'}</p>
                  <p><strong>Charge per hour:</strong> {trainer.charge_per_hour ? `$${trainer.charge_per_hour}` : 'Not set'}</p>
                </>
              ) : (
                <p>No trainer profile found. <Button variant="link" onClick={() => setShowEditModal(true)}>Create one now</Button></p>
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
                <p className="text-muted">Total Clients</p>
              </div>
              <div className="text-center mt-3">
                <h3>0</h3>
                <p className="text-muted">Messages</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit Trainer Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Trainer Profile</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Qualifications</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editForm.qualifications || ''}
                onChange={(e) => setEditForm({...editForm, qualifications: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Specialties</Form.Label>
              <Form.Control
                type="text"
                value={editForm.specialties || ''}
                onChange={(e) => setEditForm({...editForm, specialties: e.target.value})}
                placeholder="e.g., Yoga, HIIT, Weightlifting"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Charge per hour ($)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={editForm.charge_per_hour || ''}
                onChange={(e) => setEditForm({...editForm, charge_per_hour: e.target.value})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default TrainerDashboard;
