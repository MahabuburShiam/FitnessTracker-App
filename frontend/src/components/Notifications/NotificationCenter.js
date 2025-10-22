import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, ListGroup } from 'react-bootstrap';
import axios from 'axios';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error('Fetch notifications error:', error);
      setError('Failed to load notifications');
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`/api/notifications/${notificationId}/read`);
      setNotifications(notifications.map(notif => 
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      ));
    } catch (error) {
      setError('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(notif => !notif.is_read);
      await Promise.all(
        unreadNotifications.map(notif => 
          axios.patch(`/api/notifications/${notif.id}/read`)
        )
      );
      setNotifications(notifications.map(notif => ({ ...notif, is_read: true })));
    } catch (error) {
      setError('Failed to mark all notifications as read');
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      goal_reminder: '🎯',
      goal_deadline: '⏰',
      message: '💬',
      journal_rating: '⭐',
      system: '🔔'
    };
    return icons[type] || '🔔';
  };

  const getNotificationVariant = (type) => {
    const variants = {
      goal_reminder: 'warning',
      goal_deadline: 'danger',
      message: 'primary',
      journal_rating: 'success',
      system: 'info'
    };
    return variants[type] || 'secondary';
  };

  const unreadCount = notifications.filter(notif => !notif.is_read).length;

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1>Notifications</h1>
            <div>
              {unreadCount > 0 && (
                <Button variant="outline-primary" onClick={markAllAsRead}>
                  Mark All as Read
                </Button>
              )}
            </div>
          </div>
          <p className="text-muted">Stay updated with your fitness journey.</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mt-4">
        <Col md={8}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                Notifications {unreadCount > 0 && <Badge bg="danger">{unreadCount}</Badge>}
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {notifications.length === 0 ? (
                <div className="text-center p-4">
                  <p className="text-muted">No notifications yet.</p>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {notifications.map(notification => (
                    <ListGroup.Item
                      key={notification.id}
                      className={`p-3 ${!notification.is_read ? 'bg-light' : ''}`}
                    >
                      <div className="d-flex align-items-start">
                        <div className="me-3 fs-4">
                          {getNotificationIcon(notification.notification_type)}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <h6 className="mb-1">{notification.title}</h6>
                            <small className="text-muted">
                              {new Date(notification.created_at).toLocaleDateString()}
                            </small>
                          </div>
                          <p className="mb-1">{notification.message}</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <Badge bg={getNotificationVariant(notification.notification_type)}>
                              {notification.notification_type.replace('_', ' ')}
                            </Badge>
                            {!notification.is_read && (
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Mark as Read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Notification Types</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <Badge bg="warning" className="me-2">🎯</Badge>
                <span>Goal Reminders</span>
              </div>
              <div className="mb-3">
                <Badge bg="danger" className="me-2">⏰</Badge>
                <span>Goal Deadlines</span>
              </div>
              <div className="mb-3">
                <Badge bg="primary" className="me-2">💬</Badge>
                <span>New Messages</span>
              </div>
              <div className="mb-3">
                <Badge bg="success" className="me-2">⭐</Badge>
                <span>Journal Ratings</span>
              </div>
              <div className="mb-3">
                <Badge bg="info" className="me-2">🔔</Badge>
                <span>System Notifications</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NotificationCenter;