import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: '💪',
      title: 'Workout Tracking',
      description: 'Log your workouts, track progress, and follow personalized exercise plans.'
    },
    {
      icon: '📊',
      title: 'Progress Analytics',
      description: 'Visualize your fitness journey with detailed charts and progress reports.'
    },
    {
      icon: '😴',
      title: 'Sleep Analysis',
      description: 'Monitor your sleep patterns and get insights for better recovery.'
    },
    {
      icon: '🍎',
      title: 'Nutrition Logging',
      description: 'Track calories, water intake, and maintain a balanced diet.'
    },
    {
      icon: '🏋️',
      title: 'Gym & Trainer Network',
      description: 'Find nearby gyms and connect with certified personal trainers.'
    },
    {
      icon: '📝',
      title: 'Fitness Journal',
      description: 'Share your journey, get inspired by others, and build a fitness community.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '50+', label: 'Expert Trainers' },
    { number: '100+', label: 'Partner Gyms' },
    { number: '1M+', label: 'Workouts Logged' }
  ];

  // Remove the redirect logic - allow both authenticated and non-authenticated users to see home page

  return (
    <div className="home-page">
      {/* Hero Section - Conditional content based on authentication */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            {isAuthenticated ? (
              <>
                <h1>Welcome Back, {user?.firstName}! 👋</h1>
                <p>
                  Ready to continue your fitness journey? Track your progress, 
                  log today's activities, and stay motivated with your personalized dashboard.
                </p>
                <div className="hero-buttons">
                  <Link to="/dashboard" className="btn btn-primary">
                    Go to Dashboard
                  </Link>
                  <Link to="/profile" className="btn btn-secondary">
                    View Profile
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h1>Transform Your Fitness Journey</h1>
                <p>
                  Track workouts, monitor progress, connect with trainers, and achieve your fitness goals 
                  with our comprehensive fitness tracking platform.
                </p>
                <div className="hero-buttons">
                  <Link to="/register" className="btn btn-primary">
                    Start Your Journey
                  </Link>
                  <Link to="/login" className="btn btn-secondary">
                    Sign In
                  </Link>
                </div>
              </>
            )}
          </div>
          <div className="hero-image">
            <div className="floating-cards">
              <div className="card workout-card">💪 Workout Log</div>
              <div className="card progress-card">📈 Progress</div>
              <div className="card sleep-card">😴 Sleep Track</div>
              <div className="card nutrition-card">🍎 Nutrition</div>
            </div>
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="stats-bar">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Everything You Need for Your Fitness Journey</h2>
            <p>Comprehensive tools to track, analyze, and improve your fitness</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Get started in three simple steps</p>
          </div>
          
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create Your Profile</h3>
              <p>Sign up and set up your fitness profile with your goals, measurements, and preferences.</p>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <h3>Track Your Activities</h3>
              <p>Log workouts, monitor nutrition, track sleep, and record your daily progress.</p>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <h3>Achieve Your Goals</h3>
              <p>Get insights, connect with trainers, and watch your fitness transform over time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="user-types-section">
        <div className="container">
          <div className="section-header">
            <h2>For Every Fitness Enthusiast</h2>
            <p>Join a community that supports your unique fitness journey</p>
          </div>
          
          <div className="user-types-grid">
            <div className="user-type-card">
              <div className="user-type-icon">👤</div>
              <h3>Fitness Enthusiasts</h3>
              <p>Track personal progress, set goals, and maintain consistency in your fitness routine.</p>
            </div>
            
            <div className="user-type-card">
              <div className="user-type-icon">🏋️</div>
              <h3>Personal Trainers</h3>
              <p>Connect with clients, create workout plans, and grow your training business.</p>
            </div>
            
            <div className="user-type-card">
              <div className="user-type-icon">🏢</div>
              <h3>Gym Owners</h3>
              <p>Showcase your facility, attract new members, and manage your business effectively.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Conditional content based on authentication */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            {isAuthenticated ? (
              <>
                <h2>Continue Your Fitness Journey</h2>
                <p>Your personalized dashboard is waiting with the latest insights and recommendations</p>
                <div className="cta-buttons">
                  <Link to="/dashboard" className="btn btn-primary btn-large">
                    Go to Dashboard
                  </Link>
                  <Link to="/profile" className="btn btn-secondary btn-large">
                    Update Profile
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h2>Ready to Start Your Fitness Journey?</h2>
                <p>Join thousands of users who have transformed their lives with our platform</p>
                <div className="cta-buttons">
                  <Link to="/register" className="btn btn-primary btn-large">
                    Get Started Free
                  </Link>
                  <Link to="/login" className="btn btn-secondary btn-large">
                    Sign In
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;