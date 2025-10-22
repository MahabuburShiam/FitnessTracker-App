import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Fetch users error:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/api/users/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Delete user error:', error);
      setError('Failed to delete user');
    }
  };

  const getUserTypeBadge = (userType) => {
    const variants = {
      user: 'primary',
      gym_owner: 'success',
      trainer: 'warning',
      admin: 'danger'
    };
    return variants[userType] || 'secondary';
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
          <h1>Admin Dashboard</h1>
          <p className="text-muted">Manage all users on the platform.</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">All Users ({users.length})</h5>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>User Type</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.first_name} {user.last_name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge bg-${getUserTypeBadge(user.user_type)}`}>
                          {user.user_type}
                        </span>
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => setDeleteConfirm(user)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={!!deleteConfirm} onHide={() => setDeleteConfirm(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete user: <strong>{deleteConfirm?.first_name} {deleteConfirm?.last_name}</strong>?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDeleteUser(deleteConfirm.id)}>
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;