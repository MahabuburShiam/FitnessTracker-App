import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Alert } from 'react-bootstrap';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/diet';

const DietChart = () => {
  const [dietEntries, setDietEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    log_date: new Date().toISOString().split('T')[0],
    meal_type: 'Breakfast',
    food_item: ''
  });

  // Function to get axios config with Authorization header
  const getAxiosConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  useEffect(() => {
    fetchDietEntries();
  }, []);

  const fetchDietEntries = async () => {
    try {
      const res = await axios.get(BASE_URL, getAxiosConfig());
      setDietEntries(res.data);
    } catch (error) {
      console.error('Fetch diet entries error:', error);
      setError('Failed to load diet entries');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(BASE_URL, formData, getAxiosConfig());
      setFormData({
        ...formData,
        food_item: ''
      });
      fetchDietEntries();
    } catch (error) {
      console.error('Log diet entry error:', error);
      setError('Failed to log diet entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (entryId) => {
    try {
      await axios.delete(`${BASE_URL}/${entryId}`, getAxiosConfig());
      fetchDietEntries();
    } catch (error) {
      console.error('Delete diet entry error:', error);
      setError('Failed to delete diet entry');
    }
  };

  const groupEntriesByDate = () => {
    const grouped = {};
    dietEntries.forEach(entry => {
      const date = new Date(entry.log_date).toLocaleDateString();
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(entry);
    });
    return grouped;
  };

  const groupedEntries = groupEntriesByDate();

  return (
    <Container className="mt-4">
      <Row>
        <Col md={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Log Meal</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.log_date}
                    onChange={(e) => setFormData({...formData, log_date: e.target.value})}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Meal Type</Form.Label>
                  <Form.Select
                    value={formData.meal_type}
                    onChange={(e) => setFormData({...formData, meal_type: e.target.value})}
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Food Item</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.food_item}
                    onChange={(e) => setFormData({...formData, food_item: e.target.value})}
                    placeholder="What did you eat?"
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading} className="w-100">
                  {loading ? 'Logging...' : 'Log Meal'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Diet History</h5>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              
              {dietEntries.length === 0 ? (
                <p className="text-muted">No diet entries yet. Log your first meal!</p>
              ) : (
                Object.entries(groupedEntries).map(([date, entries]) => (
                  <div key={date} className="mb-4">
                    <h6>{date}</h6>
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Meal</th>
                          <th>Food</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entries.map(entry => (
                          <tr key={entry.id}>
                            <td>{entry.meal_type}</td>
                            <td>{entry.food_item}</td>
                            <td>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(entry.id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DietChart;

