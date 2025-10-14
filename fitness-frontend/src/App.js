import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Core Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

// ===== NEW ADDITIONS - GYM, TRAINER & JOURNAL PAGES =====
// Gym Pages
import Gyms from './pages/Gyms';
import GymDetail from './pages/GymDetail';

// Trainer Pages
import Trainers from './pages/Trainers';
import TrainerDetail from './pages/TrainerDetail';

// Journal Pages
import Journal from './pages/Journal';
import JournalCommunity from './pages/JournalCommunity';
import JournalDetail from './pages/JournalDetail';
// ===== END NEW ADDITIONS =====

// Layout Components
import Layout from './components/Common/Layout';

// Import API service to ensure it's initialized
import './services/api';

// CSS
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

// Home Route Component (accessible to all)
const HomeRoute = ({ children }) => {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Home Route - Accessible to all users */}
            <Route 
              path="/" 
              element={
                <HomeRoute>
                  <Home />
                </HomeRoute>
              } 
            />
            
            {/* Public Routes - Only for non-authenticated users */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />
            
            {/* Protected Routes - Only for authenticated users */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            {/* ===== NEW GYM ROUTES ===== */}
            <Route 
              path="/gyms" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Gyms />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/gym/:id" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <GymDetail />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            {/* ===== NEW TRAINER ROUTES ===== */}
            <Route 
              path="/trainers" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Trainers />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/trainer/:id" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <TrainerDetail />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            {/* ===== NEW JOURNAL ROUTES ===== */}
            <Route 
              path="/journal" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Journal />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/journal/community" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <JournalCommunity />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/journal/:id" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <JournalDetail />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            {/* Fitness Tracking Routes */}
            <Route 
              path="/daily-logs" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard activeTab="daily" />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/workouts" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard activeTab="workouts" />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/sleep" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard activeTab="sleep" />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/progress" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard activeTab="progress" />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;