import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Add this import
import AIRecommendations from './components/AI/AIRecommendations';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Layout/Navbar';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AdminLogin from './pages/Auth/AdminLogin';
import UserDashboard from './pages/Dashboard/UserDashboard';
import GymOwnerDashboard from './pages/Dashboard/GymOwnerDashboard';
import TrainerDashboard from './pages/Dashboard/TrainerDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import BMICalculator from './components/BMI/BMICalculator';
import GoalTracker from './components/Goals/GoalTracker';
import SleepLog from './components/Sleep/SleepLog';
import DietChart from './components/Diet/DietChart';
import FitnessJournal from './components/Journal/FitnessJournal'; 
import GymSearch from './components/Gym/GymSearch';
import TrainerSearch from './components/Trainer/TrainerSearch';
//import  mging from './components/Messaging/Messaging';
///ort Messaging from './components/Messaging/EnhancedMessaging';


import Messaging from './components/Messaging/Messaging';






import WorkoutLogger from './components/Workout/WorkoutLogger';
import NotificationCenter from './components/Notifications/NotificationCenter';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <div className="App">
            <Navbar />
            <main className="container-fluid px-0">
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* User Routes */}
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/bmi-calculator" element={<BMICalculator />} />
                <Route path="/goals" element={<GoalTracker />} />
                <Route path="/sleep-log" element={<SleepLog />} />
                <Route path="/diet-chart" element={<DietChart />} />
                <Route path="/fitness-journal" element={<FitnessJournal />} />
                <Route path="/gym-search" element={<GymSearch />} />
                <Route path="/trainer-search" element={<TrainerSearch />} />
                <Route path="/messaging" element={<Messaging />} />
                <Route path="/workouts" element={<WorkoutLogger />} />
                <Route path="/notifications" element={<NotificationCenter />} />


                <Route path="/ai-recommendations" element={<AIRecommendations />} />

                {/* Gym Owner Routes */}
                <Route path="/gym-owner/dashboard" element={<GymOwnerDashboard />} />

                {/* Trainer Routes */}
                <Route path="/trainer/dashboard" element={<TrainerDashboard />} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                {/* Default Route */}
                <Route path="/" element={<Navigate to="/login" replace />} />
              </Routes>
            </main>
          </div>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;