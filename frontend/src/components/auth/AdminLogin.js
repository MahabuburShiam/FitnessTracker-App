import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const [passcode, setPasscode] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcode === 'admin2025') {
      alert('Admin login successful! Redirecting to admin dashboard...');
      // Log in the user with an 'Admin' role
      const adminUser = { email: 'admin@fittrack.com', role: 'Admin' };
      login(adminUser);
      navigate('/dashboard');
    } else {
      alert('Incorrect passcode.');
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Passcode:
          <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} required />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;