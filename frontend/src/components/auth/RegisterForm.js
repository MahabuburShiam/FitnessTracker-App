import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const RegisterForm = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    location: {
      lat: '',
      lon: ''
    }
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(formData);
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="mb-4">
        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required className="w-full p-2 border rounded" />
      </div>
      <div className="mb-4">
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 border rounded" />
      </div>
      <div className="mb-4">
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-2 border rounded" />
      </div>
      <fieldset className="mb-4 border p-4 rounded">
        <legend className="font-bold">Location (2 points)</legend>
        <div className="flex space-x-4">
          <input type="number" name="lat" placeholder="Latitude" onChange={handleLocationChange} required className="w-1/2 p-2 border rounded" step="any" />
          <input type="number" name="lon" placeholder="Longitude" onChange={handleLocationChange} required className="w-1/2 p-2 border rounded" step="any" />
        </div>
      </fieldset>
      <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Register
      </button>
    </form>
  );
};

export default RegisterForm;