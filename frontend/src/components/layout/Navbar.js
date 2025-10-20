import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ background: '#333', color: 'white', padding: '1rem', display: 'flex', gap: '1rem' }}>
      <Link to="/" style={{ color: 'white' }}>Home</Link>
      {user ? (
        <>
          <Link to="/dashboard" style={{ color: 'white' }}>Dashboard</Link>
          <button onClick={handleLogout} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1rem' }}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ color: 'white', marginLeft: 'auto' }}>Login</Link>
          <Link to="/register" style={{ color: 'white' }}>Register</Link>
          <Link to="/admin" style={{ color: 'white' }}>Admin</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;