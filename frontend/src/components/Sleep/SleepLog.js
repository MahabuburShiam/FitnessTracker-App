import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Alert } from 'react-bootstrap';
import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Base API URL

const SleepLog = () => {
  const [sleepLogs, setSleepLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    log_date: new Date().toISOString().split('T')[0],
    hours_slept: ''
  });

  // Fetch sleep logs when component mounts
  useEffect(() => {
    fetchSleepLogs();
  }, []);

  const fetchSleepLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/sleep`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSleepLogs(res.data);
      setError('');
    } catch (error) {
      console.error('Fetch sleep logs error:', error);
      setError('Failed to load sleep logs');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/sleep`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setFormData({
        log_date: new Date().toISOString().split('T')[0],
        hours_slept: ''
      });

      fetchSleepLogs();
    } catch (error) {
      console.error('Sleep log post error:', error);
      setError('Failed to log sleep');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (logId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/sleep/${logId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchSleepLogs();
    } catch (error) {
      console.error('Delete sleep log error:', error);
      setError('Failed to delete sleep log');
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Log Sleep</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.log_date}
                    onChange={(e) => setFormData({ ...formData, log_date: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Hours Slept</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    min="0"
                    max="24"
                    value={formData.hours_slept}
                    onChange={(e) => setFormData({ ...formData, hours_slept: e.target.value })}
                    placeholder="Enter hours slept"
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading} className="w-100">
                  {loading ? 'Logging...' : 'Log Sleep'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Sleep History</h5>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              
              {sleepLogs.length === 0 ? (
                <p className="text-muted">No sleep logs yet. Log your first night's sleep!</p>
              ) : (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Hours Slept</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sleepLogs.map((log) => (
                      <tr key={log.id}>
                        <td>{new Date(log.log_date).toLocaleDateString()}</td>
                        <td>{log.hours_slept} hours</td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(log.id)}
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
    </Container>
  );
};

export default SleepLog;
