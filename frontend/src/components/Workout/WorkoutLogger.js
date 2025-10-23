import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';

// ✅ Base URL
const BASE_URL = 'http://localhost:5000/api/workouts';

// ✅ Create Axios instance with token
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// ✅ Automatically attach token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const WorkoutLogger = () => {
  const [workouts, setWorkouts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    exercise_name: '',
    duration_minutes: '',
    calories_burned: '',
    sets: '',
    reps: '',
    weight_used: '',
    distance: '',
    log_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const res = await axiosInstance.get('/');
      setWorkouts(res.data);
    } catch (error) {
      console.error('Fetch workouts error:', error);
      setError('Failed to load workouts');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post('/', formData);
      setShowModal(false);
      setFormData({
        exercise_name: '',
        duration_minutes: '',
        calories_burned: '',
        sets: '',
        reps: '',
        weight_used: '',
        distance: '',
        log_date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      fetchWorkouts();
    } catch (error) {
      console.error('Workout log error:', error);
      setError('Failed to log workout');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (workoutId) => {
    try {
      await axiosInstance.delete(`/${workoutId}`);
      fetchWorkouts();
    } catch (error) {
      console.error('Workout delete error:', error);
      setError('Failed to delete workout');
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1>Workout Logger</h1>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Log Workout
            </Button>
          </div>
          <p className="text-muted">Track your exercise sessions and progress.</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Workout History</h5>
            </Card.Header>
            <Card.Body>
              {workouts.length === 0 ? (
                <p className="text-muted">No workouts logged yet. Start your fitness journey!</p>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Exercise</th>
                      <th>Duration</th>
                      <th>Calories</th>
                      <th>Sets/Reps</th>
                      <th>Weight</th>
                      <th>Distance</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workouts.map(workout => (
                      <tr key={workout.id}>
                        <td>{new Date(workout.log_date).toLocaleDateString()}</td>
                        <td>{workout.exercise_name}</td>
                        <td>{workout.duration_minutes} min</td>
                        <td>{workout.calories_burned}</td>
                        <td>
                          {workout.sets && workout.reps && `${workout.sets}x${workout.reps}`}
                        </td>
                        <td>{workout.weight_used} kg</td>
                        <td>{workout.distance} km</td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(workout.id)}
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

      {/* Modal for Logging Workout */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Log Workout</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Exercise Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.exercise_name}
                    onChange={(e) => setFormData({...formData, exercise_name: e.target.value})}
                    placeholder="e.g., Running, Bench Press, Yoga"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.log_date}
                    onChange={(e) => setFormData({...formData, log_date: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({...formData, duration_minutes: e.target.value})}
                    placeholder="30"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Calories Burned</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.calories_burned}
                    onChange={(e) => setFormData({...formData, calories_burned: e.target.value})}
                    placeholder="300"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Sets</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.sets}
                    onChange={(e) => setFormData({...formData, sets: e.target.value})}
                    placeholder="3"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Reps</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.reps}
                    onChange={(e) => setFormData({...formData, reps: e.target.value})}
                    placeholder="10"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Weight (kg)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    value={formData.weight_used}
                    onChange={(e) => setFormData({...formData, weight_used: e.target.value})}
                    placeholder="50"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Distance (km)</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                value={formData.distance}
                onChange={(e) => setFormData({...formData, distance: e.target.value})}
                placeholder="5.0"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Any additional notes about your workout..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Logging...' : 'Log Workout'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default WorkoutLogger;
