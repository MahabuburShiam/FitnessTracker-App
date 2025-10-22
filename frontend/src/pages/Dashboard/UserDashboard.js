import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [recentGoals, setRecentGoals] = useState([]);
  const [bmiData, setBmiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const userRes = await axios.get('/api/users/profile');
      setUserData(userRes.data.user);

      // Fetch recent goals
      const goalsRes = await axios.get('/api/goals');
      setRecentGoals(goalsRes.data.slice(0, 3));

      // Fetch latest BMI
      const bmiRes = await axios.get('/api/bmi/history');
      if (bmiRes.data.length > 0) {
        setBmiData(bmiRes.data[0]);
      }

    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
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
          <h1>Welcome back, {userData?.first_name}!</h1>
          <p className="text-muted">Track your fitness journey and achieve your goals.</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mt-4">
        {/* Quick Stats */}
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>BMI</Card.Title>
              <h3>{bmiData ? bmiData.bmi_value : '--'}</h3>
              <Card.Text className="text-muted">
                {bmiData ? bmiData.bmi_category : 'Not calculated'}
              </Card.Text>
              <Button as={Link} to="/bmi-calculator" variant="outline-primary" size="sm">
                Calculate
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Active Goals</Card.Title>
              <h3>{recentGoals.filter(g => !g.is_complete).length}</h3>
              <Card.Text className="text-muted">In progress</Card.Text>
              <Button as={Link} to="/goals" variant="outline-primary" size="sm">
                Manage
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Journal Entries</Card.Title>
              <h3>0</h3>
              <Card.Text className="text-muted">Total entries</Card.Text>
              <Button as={Link} to="/fitness-journal" variant="outline-primary" size="sm">
                Write
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Workouts</Card.Title>
              <h3>0</h3>
              <Card.Text className="text-muted">This week</Card.Text>
              <Button variant="outline-primary" size="sm">
                Log Workout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        {/* Recent Goals */}
        <Col md={6}>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Goals</h5>
                <Button as={Link} to="/goals" variant="outline-primary" size="sm">
                  View All
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {recentGoals.length === 0 ? (
                <p className="text-muted">No goals set yet.</p>
              ) : (
                recentGoals.map(goal => (
                  <div key={goal.id} className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <strong>{goal.goal_description}</strong>
                      <br />
                      <small className="text-muted">
                        Due: {new Date(goal.target_date).toLocaleDateString()}
                      </small>
                    </div>
                    <span 
                      className={`badge ${goal.is_complete ? 'bg-success' : 'bg-warning'}`}
                    >
                      {goal.is_complete ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} className="mb-3">
                  <Button as={Link} to="/sleep-log" variant="outline-primary" className="w-100">
                    Log Sleep
                  </Button>
                </Col>
                <Col md={6} className="mb-3">
                  <Button as={Link} to="/diet-chart" variant="outline-primary" className="w-100">
                    Plan Diet
                  </Button>
                </Col>
                <Col md={6} className="mb-3">
                  <Button as={Link} to="/gym-search" variant="outline-success" className="w-100">
                    Find Gyms
                  </Button>
                </Col>
                <Col md={6} className="mb-3">
                  <Button as={Link} to="/trainer-search" variant="outline-success" className="w-100">
                    Find Trainers
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard;