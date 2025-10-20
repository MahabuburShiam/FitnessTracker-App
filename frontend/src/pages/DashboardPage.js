import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import UserDashboard from '../components/dashboards/UserDashboard';
import TrainerDashboard from '../components/dashboards/TrainerDashboard';
import GymOwnerDashboard from '../components/dashboards/GymOwnerDashboard';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div>Loading...</div>;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'user':
        return <UserDashboard />;
      case 'trainer':
        return <TrainerDashboard />;
      case 'gym-owner':
        return <GymOwnerDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      {renderDashboard()}
    </div>
  );
};

export default DashboardPage;