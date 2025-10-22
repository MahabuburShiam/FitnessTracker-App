import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge, Tab, Tabs } from 'react-bootstrap';
import axios from 'axios';

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState({
    sleep: null,
    diet: null,
    exercise: null,
    wellness: null
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRecommendationHistory();
  }, []);

  const fetchRecommendationHistory = async () => {
    try {
      const res = await axios.get('/api/ai/history');
      setHistory(res.data);
    } catch (error) {
      console.error('Fetch recommendation history error:', error);
    }
  };

  const getRecommendation = async (type) => {
    setLoading(prev => ({ ...prev, [type]: true }));
    setError('');
    setSuccess('');

    try {
      const res = await axios.get(`/api/ai/recommendations?type=${type}`);
      setRecommendations(prev => ({
        ...prev,
        [type]: res.data
      }));
      
      if (type === 'wellness') {
        setSuccess('Comprehensive wellness report generated successfully!');
      }
      
      // Refresh history
      fetchRecommendationHistory();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to get recommendations');
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const generateWellnessReport = async () => {
    await getRecommendation('wellness');
  };

  const getAnalysisCard = (type, data) => {
    if (!data) return null;

    const titles = {
      sleep: 'Sleep Analysis',
      diet: 'Diet Suggestions',
      exercise: 'Exercise Recommendations'
    };

    return (
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">{titles[type]}</h5>
        </Card.Header>
        <Card.Body>
          {data.analysis && (
            <div className="mb-3">
              <strong>Analysis:</strong>
              <p className="mb-2">{data.analysis}</p>
            </div>
          )}
          
          {data.recommendation && (
            <div className="mb-3">
              <strong>Recommendation:</strong>
              <p className="mb-2 text-primary">{data.recommendation}</p>
            </div>
          )}

          {data.metrics && (
            <div>
              <strong>Metrics:</strong>
              <div className="mt-2">
                {Object.entries(data.metrics).map(([key, value]) => (
                  <Badge key={key} bg="secondary" className="me-2 mb-2">
                    {key}: {value.toString()}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1>AI Recommendations</h1>
              <p className="text-muted">Get personalized fitness insights powered by AI analysis.</p>
            </div>
            <Button 
              variant="primary" 
              onClick={generateWellnessReport}
              disabled={loading.wellness}
            >
              {loading.wellness ? 'Generating...' : 'Generate Wellness Report'}
            </Button>
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Tabs defaultActiveKey="recommendations" className="mt-4">
        <Tab eventKey="recommendations" title="AI Recommendations">
          <Row className="mt-4">
            <Col md={4}>
              <Card className="text-center h-100">
                <Card.Body className="d-flex flex-column">
                  <Card.Title>Sleep Analysis</Card.Title>
                  <Card.Text className="flex-grow-1">
                    Get insights about your sleep patterns and recommendations for better sleep quality.
                  </Card.Text>
                  <Button 
                    variant="outline-primary" 
                    onClick={() => getRecommendation('sleep')}
                    disabled={loading.sleep}
                    className="mt-auto"
                  >
                    {loading.sleep ? 'Analyzing...' : 'Analyze Sleep'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="text-center h-100">
                <Card.Body className="d-flex flex-column">
                  <Card.Title>Diet Suggestions</Card.Title>
                  <Card.Text className="flex-grow-1">
                    Receive personalized nutrition advice based on your food logs and dietary patterns.
                  </Card.Text>
                  <Button 
                    variant="outline-primary" 
                    onClick={() => getRecommendation('diet')}
                    disabled={loading.diet}
                    className="mt-auto"
                  >
                    {loading.diet ? 'Analyzing...' : 'Analyze Diet'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="text-center h-100">
                <Card.Body className="d-flex flex-column">
                  <Card.Title>Exercise Plan</Card.Title>
                  <Card.Text className="flex-grow-1">
                    Get customized workout recommendations based on your fitness level and goals.
                  </Card.Text>
                  <Button 
                    variant="outline-primary" 
                    onClick={() => getRecommendation('exercise')}
                    disabled={loading.exercise}
                    className="mt-auto"
                  >
                    {loading.exercise ? 'Analyzing...' : 'Get Exercise Plan'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Display Recommendations */}
          <Row className="mt-4">
            <Col>
              {recommendations.wellness ? (
                <>
                  <h4>Comprehensive Wellness Report</h4>
                  <p className="text-muted mb-4">Generated on {new Date().toLocaleDateString()}</p>
                  
                  {getAnalysisCard('sleep', recommendations.wellness.sleep)}
                  {getAnalysisCard('diet', recommendations.wellness.diet)}
                  {getAnalysisCard('exercise', recommendations.wellness.exercise)}
                </>
              ) : (
                <>
                  {getAnalysisCard('sleep', recommendations.sleep)}
                  {getAnalysisCard('diet', recommendations.diet)}
                  {getAnalysisCard('exercise', recommendations.exercise)}
                </>
              )}
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="history" title="Recommendation History">
          <Row className="mt-4">
            <Col>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Previous Recommendations</h5>
                </Card.Header>
                <Card.Body>
                  {history.length === 0 ? (
                    <p className="text-muted">No previous recommendations found.</p>
                  ) : (
                    history.map(rec => (
                      <Card key={rec.id} className="mb-3">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="text-capitalize">
                                {rec.recommendation_type.replace('_', ' ')}
                              </h6>
                              <p className="mb-2">{rec.recommendation_text}</p>
                            </div>
                            <Badge bg="secondary">
                              {new Date(rec.created_at).toLocaleDateString()}
                            </Badge>
                          </div>
                        </Card.Body>
                      </Card>
                    ))
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AIRecommendations;