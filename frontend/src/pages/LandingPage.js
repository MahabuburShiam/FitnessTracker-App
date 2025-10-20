import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div>
      <h1>Welcome to the Fitness Tracker!</h1>
      <p>This is the landing page. Here you would see app features and a value proposition.</p>
      <Link to="/register"><button>Get Started</button></Link>
    </div>
  );
};

export default LandingPage;