import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Alert, Toast, ToastContainer } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

const FitnessJournal = () => {
  const [journals, setJournals] = useState([]);
  const [publicJournals, setPublicJournals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('my');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  // ✅ Setup axios instance with auth header
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      'Content-Type': 'application/json'
    }
  });

  useEffect(() => {
    fetchJournals();
  }, [activeTab]);

  const fetchJournals = async () => {
    try {
      if (!localStorage.getItem('token')) {
        setError('You must be logged in to view journals');
        return;
      }

      if (activeTab === 'my') {
        const res = await axiosInstance.get('/api/journals/my');
        setJournals(res.data);
      } else {
        const res = await axiosInstance.get('/api/journals/public');
        setPublicJournals(res.data);
      }
    } catch (error) {
      console.error('Fetch journals error:', error);
      setError('Failed to load journals');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axiosInstance.post('/api/journals', formData);
      setShowModal(false);
      setFormData({ title: '', content: '' });
      fetchJournals();
      setToastMessage('Journal entry created successfully!');
      setShowToast(true);
    } catch (error) {
      console.error('Create journal error:', error);
      setError('Failed to create journal entry');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Enhanced handleRate with toast-based feedback
  const handleRate = async (journalId, rating) => {
    try {
      await axiosInstance.post(`/api/journals/${journalId}/rate`, { rating });
      fetchJournals();
      setToastMessage('Thanks for rating this journal!');
      setShowToast(true);
    } catch (error) {
      console.error('Rate journal error:', error);
      let message = 'Failed to rate journal.';

      if (error.response && error.response.status === 400) {
        const msg = error.response.data?.message || '';
        if (msg.toLowerCase().includes('already rated') || msg.toLowerCase().includes('duplicate')) {
          message = 'Sorry, you already rated this journal.';
        } else {
          message = 'Sorry, you already rated this journal.';
        }
      }

      setToastMessage(message);
      setShowToast(true);
    }
  };

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1>Fitness Journal</h1>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Write New Entry
            </Button>
          </div>
          <p className="text-muted">Share your fitness journey and read others' experiences.</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              <div className="d-flex">
                <Button
                  variant={activeTab === 'my' ? 'primary' : 'outline-primary'}
                  onClick={() => setActiveTab('my')}
                  className="me-2"
                >
                  My Journals
                </Button>
                <Button
                  variant={activeTab === 'public' ? 'primary' : 'outline-primary'}
                  onClick={() => setActiveTab('public')}
                >
                  Public Journals
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {activeTab === 'my' ? (
                journals.length === 0 ? (
                  <p className="text-muted">You haven't written any journal entries yet.</p>
                ) : (
                  journals.map(journal => (
                    <Card key={journal.id} className="mb-3 shadow-sm border-0">
                      <Card.Body>
                        <Card.Title>{journal.title}</Card.Title>
                        <div 
                          className="journal-content"
                          dangerouslySetInnerHTML={{ __html: journal.content }}
                        />
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <small className="text-muted">
                            Posted on {new Date(journal.created_at).toLocaleDateString()}
                          </small>
                          <div>
                            <span className="badge bg-primary me-2">
                              {calculateAverageRating(journal.ratings)} ★
                            </span>
                            <span className="text-muted">
                              {journal.ratings?.length || 0} ratings
                            </span>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))
                )
              ) : (
                publicJournals.length === 0 ? (
                  <p className="text-muted">No public journal entries available.</p>
                ) : (
                  publicJournals.map(journal => (
                    <Card key={journal.id} className="mb-3 shadow-sm border-0">
                      <Card.Body>
                        <Card.Title>{journal.title}</Card.Title>
                        <div className="d-flex align-items-center mb-2">
                          <small className="text-muted">
                            By {journal.author.first_name} {journal.author.last_name}
                          </small>
                        </div>
                        <div 
                          className="journal-content"
                          dangerouslySetInnerHTML={{ __html: journal.content }}
                        />
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <small className="text-muted">
                            Posted on {new Date(journal.created_at).toLocaleDateString()}
                          </small>
                          <div>
                            {journal.ratings.some(r => r.rater_id === parseInt(localStorage.getItem('userId'))) ? (
                              <span className="badge bg-primary">
                                {calculateAverageRating(journal.ratings)} ★
                              </span>
                            ) : (
                              <div>
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Button
                                    key={star}
                                    variant="outline-warning"
                                    size="sm"
                                    className="me-1"
                                    onClick={() => handleRate(journal.id, star)}
                                  >
                                    {star} ★
                                  </Button>
                                ))}
                              </div>
                            )}
                            <span className="text-muted ms-2">
                              ({journal.ratings?.length || 0} ratings)
                            </span>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))
                )
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Create Journal Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Write Journal Entry</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter a title for your journal entry"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <ReactQuill
                value={formData.content}
                onChange={(content) => setFormData({...formData, content})}
                theme="snow"
                placeholder="Write about your fitness journey..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Entry'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* ✅ Toast Notification for rating or success messages */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg="light"
        >
          <Toast.Body className="text-dark fw-semibold">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default FitnessJournal;


