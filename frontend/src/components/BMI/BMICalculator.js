import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table } from 'react-bootstrap';
import axios from 'axios';

const BMICalculator = () => {
  const [formData, setFormData] = useState({
    height: '',
    weight: ''
  });
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_BASE_URL;


  React.useEffect(() => {
    fetchBMITistory();
  }, []);

  const fetchBMITistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // No need to set an error, just don't fetch if not logged in.
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(`${API_URL}/api/bmi/history`, config);
      setHistory(res.data);
    } catch (error) {
      console.error('Error fetching BMI history:', error);
      setError(error.response?.data?.message || 'Could not fetch BMI history.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to calculate BMI.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.post(`${API_URL}/api/bmi/calculate`, formData, config);
      setResult(res.data);
      await fetchBMITistory(); // Refresh history
    } catch (error) {
      setError(error.response?.data?.message || 'BMI calculation failed');
    } finally {
      setLoading(false);
    }
  };

  const getBMICategoryColor = (category) => {
    switch (category) {
      case 'Underweight': return 'warning';
      case 'Normal': return 'success';
      case 'Overweight': return 'warning';
      case 'Obese': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h4>BMI Calculator</h4>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Height (cm)</Form.Label>
                  <Form.Control
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="Enter height in centimeters"
                    required
                    step="0.1"
                    min="0"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Weight (kg)</Form.Label>
                  <Form.Control
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="Enter weight in kilograms"
                    required
                    step="0.1"
                    min="0"
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loading}
                  className="w-100"
                >
                  {loading ? 'Calculating...' : 'Calculate BMI'}
                </Button>
              </Form>

              {result && (
                <div className="mt-4 text-center">
                  <Alert variant={getBMICategoryColor(result.category)}>
                    <h5>Your BMI: {result.bmi}</h5>
                    <p className="mb-0">Category: {result.category}</p>
                  </Alert>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>
              <h4>BMI History</h4>
            </Card.Header>
            <Card.Body>
              {history.length === 0 ? (
                <p className="text-muted">No BMI records yet.</p>
              ) : (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Height</th>
                      <th>Weight</th>
                      <th>BMI</th>
                      <th>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(record => (
                      <tr key={record.id}>
                        <td>{new Date(record.created_at).toLocaleDateString()}</td>
                        <td>{record.height} cm</td>
                        <td>{record.weight} kg</td>
                        <td>{record.bmi_value}</td>
                        <td>
                          <span className={`badge bg-${getBMICategoryColor(record.bmi_category)}`}>
                            {record.bmi_category}
                          </span>
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

export default BMICalculator;