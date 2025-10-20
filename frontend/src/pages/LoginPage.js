import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd call your backend API to verify credentials
    // and get a user object with a role.
    console.log('Logging in with:', { email, password });

    // For demonstration, we'll mock a successful login and assign a role.
    // You can change 'Regular' to 'Trainer' or 'Gym Owner' to test different dashboards.
    const mockUser = {
      email: email,
      role: 'Regular', // Change this to 'Trainer' or 'Gym Owner' to test
    };

    login(mockUser);
    navigate('/dashboard');
  };

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;