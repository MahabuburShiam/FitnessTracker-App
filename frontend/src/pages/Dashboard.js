import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If no user is logged in, redirect to the login page
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // or a loading spinner
  }

  const renderDashboardContent = () => {
    switch (user.role) {
      case 'Regular':
        return <p>Welcome, Regular User! Here you can track your fitness, log workouts, and engage with the community.</p>;
      case 'Trainer':
        return <p>Welcome, Trainer! Manage your clients, set your availability, and track sessions.</p>;
      case 'Gym Owner':
        return <p>Welcome, Gym Owner! Manage your gym listing, respond to reviews, and update your information.</p>;
      case 'Admin':
        return <p>Welcome, Admin! You have access to all user data and system management tools.</p>;
      default:
        return <p>Welcome! Your dashboard is being set up.</p>;
    }
  };

  return (
    <div>
      <h2>{user.role} Dashboard</h2>
      {renderDashboardContent()}
    </div>
  );
};

export default Dashboard;