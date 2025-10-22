import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';

const AppNavbar = () => {
  const { currentUser: user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderUserLinks = () => {
    if (!isAuthenticated) {
      return (
        <>
          <Nav.Link as={Link} to="/login">Login</Nav.Link>
          <Nav.Link as={Link} to="/register">Register</Nav.Link>
          <Nav.Link as={Link} to="/admin/login">Admin</Nav.Link>
        </>
      );
    }

    if (user.user_type === 'admin') {
      return (
        <>
          <Nav.Link as={Link} to="/admin/dashboard">Dashboard</Nav.Link>
          <Button variant="outline-light" onClick={handleLogout}>
            Logout
          </Button>
        </>
      );
    }

    if (user.user_type === 'gym_owner') {
      return (
        <>
          <Nav.Link as={Link} to="/gym-owner/dashboard">Dashboard</Nav.Link>
          <Nav.Link as={Link} to="/messaging">Messages</Nav.Link>
          <Button variant="outline-light" onClick={handleLogout}>
            Logout
          </Button>
        </>
      );
    }

    if (user.user_type === 'trainer') {
      return (
        <>
          <Nav.Link as={Link} to="/trainer/dashboard">Dashboard</Nav.Link>
          <Nav.Link as={Link} to="/messaging">Messages</Nav.Link>
          <Button variant="outline-light" onClick={handleLogout}>
            Logout
          </Button>
        </>
      );
    }

    // Normal user
    return (
      <>
        <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
        <Nav.Link as={Link} to="/bmi-calculator">BMI Calculator</Nav.Link>
        <Nav.Link as={Link} to="/goals">Goals</Nav.Link>
        <Nav.Link as={Link} to="/sleep-log">Sleep Log</Nav.Link>
        <Nav.Link as={Link} to="/diet-chart">Diet Chart</Nav.Link>
        <Nav.Link as={Link} to="/workouts">Workouts</Nav.Link>
        <Nav.Link as={Link} to="/fitness-journal">Journal</Nav.Link>
        <Nav.Link as={Link} to="/gym-search">Find Gyms</Nav.Link>
        <Nav.Link as={Link} to="/trainer-search">Find Trainers</Nav.Link>
        <Nav.Link as={Link} to="/messaging">Messages</Nav.Link>
        <Nav.Link as={Link} to="/notifications">
          Notifications <Badge bg="danger">0</Badge>
        </Nav.Link>
        <Button variant="outline-light" onClick={handleLogout}>
          Logout
        </Button>
      </>
    );
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Fitness Connect
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {renderUserLinks()}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;