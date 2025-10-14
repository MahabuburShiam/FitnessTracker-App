import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

// Import components we'll create
import DailyLogTracker from '../components/Dashboard/DailyLogTracker';
import WorkoutSessions from '../components/Dashboard/WorkoutSessions';
import SleepTracker from '../components/Dashboard/SleepTracker';
import ProgressCharts from '../components/Dashboard/ProgressCharts';
import StatsOverview from '../components/Dashboard/StatsOverview';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState({
    dailyLogs: [],
    workoutSessions: [],
    sleepLogs: [],
    progress: {},
    stats: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [dailyLogsRes, workoutsRes, sleepRes, progressRes] = await Promise.all([
        fetch('/api/daily-logs?limit=7'),
        fetch('/api/workouts/sessions?limit=5'),
        fetch('/api/sleep?limit=7'),
        fetch('/api/daily-logs/progress?days=30')
      ]);

      const dailyLogsData = await dailyLogsRes.json();
      const workoutsData = await workoutsRes.json();
      const sleepData = await sleepRes.json();
      const progressData = await progressRes.json();

      setDashboardData({
        dailyLogs: dailyLogsData.logs || [],
        workoutSessions: workoutsData.workoutSessions || [],
        sleepLogs: sleepData.sleepLogs || [],
        progress: progressData.progress || {},
        stats: workoutsData.stats || {}
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner-large"></div>
        <p>Loading your fitness dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>{getGreeting()}, {user?.firstName}!</h1>
          <p>Welcome back to your fitness journey</p>
        </div>
        <div className="user-stats-quick">
          <div className="stat-badge">
            <span className="stat-value">{user?.bmi || '--'}</span>
            <span className="stat-label">BMI</span>
          </div>
          <div className="stat-badge">
            <span className="stat-value">{user?.bmiCategory || '--'}</span>
            <span className="stat-label">Category</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'daily', label: 'Daily Log', icon: '📝' },
          { id: 'workouts', label: 'Workouts', icon: '💪' },
          { id: 'sleep', label: 'Sleep', icon: '😴' },
          { id: 'progress', label: 'Progress', icon: '📈' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <StatsOverview 
            data={dashboardData}
            user={user}
            onRefresh={fetchDashboardData}
          />
        )}

        {activeTab === 'daily' && (
          <DailyLogTracker 
            logs={dashboardData.dailyLogs}
            onUpdate={fetchDashboardData}
          />
        )}

        {activeTab === 'workouts' && (
          <WorkoutSessions 
            sessions={dashboardData.workoutSessions}
            stats={dashboardData.stats}
            onUpdate={fetchDashboardData}
          />
        )}

        {activeTab === 'sleep' && (
          <SleepTracker 
            logs={dashboardData.sleepLogs}
            onUpdate={fetchDashboardData}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressCharts 
            progress={dashboardData.progress}
            onUpdate={fetchDashboardData}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;