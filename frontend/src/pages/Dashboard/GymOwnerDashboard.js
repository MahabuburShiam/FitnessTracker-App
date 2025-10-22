import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';

const GymOwnerDashboard = () => {
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchGymData();
  }, []);

  const fetchGymData = async () => {
    try {
      const res = await axios.get('/api/users/profile');
      setGym(res.data.user.gym);
      setEditForm(res.data.user.gym || {});
    } catch (error) {
      console.error('Fetch gym data error:', error);
      setError('Failed to load gym data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/gyms/${gym.id}`, editForm);
      setShowEditModal(false);
      fetchGymData();
    } catch (error) {
      console.error('Update gym error:', error);
      setError('Failed to update gym');
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
              <Button variant="primary" onClick={() => setShowEditModal(true)}>
                Edit Profile
              </Button>
            </Card.Header>
            <Card.Body>
              {gym ? (
                <>
                  <h4>{gym.gym_name}</h4>
                  <p><strong>Address:</strong> {gym.address}</p>
                  <p><strong>Description:</strong> {gym.description || 'No description provided'}</p>
                  <p><strong>Pricing:</strong> {gym.pricing || 'No pricing information'}</p>
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
                value={editForm.gym_name || ''}
                onChange={(e) => setEditForm({...editForm, gym_name: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={editForm.address || ''}
                onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editForm.description || ''}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Pricing Information</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editForm.pricing || ''}
                onChange={(e) => setEditForm({...editForm, pricing: e.target.value})}
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

export default GymOwnerDashboard;