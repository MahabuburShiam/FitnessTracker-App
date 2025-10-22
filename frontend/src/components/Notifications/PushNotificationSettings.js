import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import pushNotificationService from '../../services/pushNotificationService';

const PushNotificationSettings = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    checkPushSupport();
  }, []);

  const checkPushSupport = async () => {
    const supported = await pushNotificationService.initialize();
    setIsSupported(supported);
    
    if (supported) {
      setIsSubscribed(pushNotificationService.isSubscribed());
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await pushNotificationService.subscribe();
      setIsSubscribed(true);
      setSuccess('Successfully subscribed to push notifications!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await pushNotificationService.unsubscribe();
      setIsSubscribed(false);
      setSuccess('Successfully unsubscribed from push notifications.');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async () => {
    setError('');
    setSuccess('');

    try {
      await pushNotificationService.sendTestNotification();
      setSuccess('Test notification sent successfully!');
    } catch (error) {
      setError(error.message);
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <Card.Header>
          <h5 className="mb-0">Push Notifications</h5>
        </Card.Header>
        <Card.Body>
          <Alert variant="warning">
            Push notifications are not supported in your browser.
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Push Notifications</h5>
        <Badge bg={isSubscribed ? 'success' : 'secondary'}>
          {isSubscribed ? 'Subscribed' : 'Not Subscribed'}
        </Badge>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <p className="text-muted mb-4">
          Receive push notifications for new messages, goal reminders, and important updates.
        </p>

        <div className="d-flex gap-2">
          {!isSubscribed ? (
            <Button 
              variant="primary" 
              onClick={handleSubscribe}
              disabled={loading}
            >
              {loading ? 'Subscribing...' : 'Enable Push Notifications'}
            </Button>
          ) : (
            <>
              <Button 
                variant="outline-danger" 
                onClick={handleUnsubscribe}
                disabled={loading}
              >
                {loading ? 'Unsubscribing...' : 'Disable Push Notifications'}
              </Button>
              <Button 
                variant="outline-primary" 
                onClick={handleTestNotification}
              >
                Test Notification
              </Button>
            </>
          )}
        </div>

        {isSubscribed && (
          <div className="mt-3">
            <small className="text-muted">
              You will receive notifications for:
            </small>
            <ul className="text-muted small mt-1">
              <li>New messages from gym owners and trainers</li>
              <li>Goal reminders and deadlines</li>
              <li>New journal ratings</li>
              <li>System announcements</li>
            </ul>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default PushNotificationSettings;