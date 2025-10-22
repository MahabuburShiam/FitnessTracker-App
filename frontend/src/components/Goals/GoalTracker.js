import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Table, Alert } from 'react-bootstrap';
import axios from 'axios';

const GoalTracker = () => {
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    goal_description: '',
    target_date: ''
  });

  // ✅ Base API URL
  const API_URL = 'http://localhost:5000';

  // ✅ Get JWT token from localStorage
  const token = localStorage.getItem('token');

  // ✅ Axios config with Authorization header
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/goals`, config);
      setGoals(res.data);
    } catch (error) {
      console.error('Fetch goals error:', error);
      setError('Failed to load goals (Unauthorized or Server error)');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/goals`, formData, config);
      setShowModal(false);
      setFormData({ goal_description: '', target_date: '' });
      fetchGoals();
    } catch (error) {
      console.error('Create goal error:', error);
      setError('Failed to create goal (Unauthorized or Invalid token)');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (goalId, isComplete) => {
    try {
      await axios.put(`${API_URL}/api/goals/${goalId}`, { is_complete: !isComplete }, config);
      fetchGoals();
    } catch (error) {
      setError('Failed to update goal');
    }
  };

  const handleDelete = async (goalId) => {
    try {
      await axios.delete(`${API_URL}/api/goals/${goalId}`, config);
      fetchGoals();
    } catch (error) {
      setError('Failed to delete goal');
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1>Goal Tracker</h1>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Add New Goal
            </Button>
          </div>
          <p className="text-muted">Set and track your fitness goals.</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">My Goals</h5>
            </Card.Header>
            <Card.Body>
              {goals.length === 0 ? (
                <p className="text-muted">No goals set yet. Create your first goal to get started!</p>
              ) : (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Goal</th>
                      <th>Target Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {goals.map(goal => (
                      <tr key={goal.id}>
                        <td>{goal.goal_description}</td>
                        <td>{new Date(goal.target_date).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${goal.is_complete ? 'bg-success' : 'bg-warning'}`}>
                            {goal.is_complete ? 'Completed' : 'In Progress'}
                          </span>
                        </td>
                        <td>
                          <Button
                            variant={goal.is_complete ? 'warning' : 'success'}
                            size="sm"
                            className="me-2"
                            onClick={() => handleMarkComplete(goal.id, goal.is_complete)}
                          >
                            {goal.is_complete ? 'Mark Incomplete' : 'Mark Complete'}
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(goal.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Goal Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Goal</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Goal Description</Form.Label>
              <Form.Control
                type="text"
                value={formData.goal_description}
                onChange={(e) => setFormData({ ...formData, goal_description: e.target.value })}
                placeholder="e.g., Lose 5kg, Run 5km, Bench press 100kg"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Target Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.target_date}
                onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Goal'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default GoalTracker;


