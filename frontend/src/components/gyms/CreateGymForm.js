import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import * as gymApi from '../../api/gyms';

const CreateGymForm = ({ onGymCreated }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    facilities: '', // Will be converted to an array
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const gymData = {
        ...formData,
        // Convert comma-separated string to an array of trimmed strings
        facilities: formData.facilities.split(',').map(f => f.trim()).filter(f => f),
      };
      const newGym = await gymApi.createGym(gymData, token);
      onGymCreated(newGym); // Notify parent component
    } catch (err) {
      setError(err.message || 'An error occurred while creating the gym.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Your Gym Profile</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Gym Name</label>
          <input type="text" name="name" id="name" onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700 font-bold mb-2">Address</label>
          <input type="text" name="address" id="address" onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <div className="mb-6">
          <label htmlFor="facilities" className="block text-gray-700 font-bold mb-2">Facilities (comma-separated)</label>
          <input type="text" name="facilities" id="facilities" placeholder="e.g., Pool, Sauna, Free Weights" onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300">
          {loading ? 'Creating...' : 'Create Gym'}
        </button>
      </form>
    </div>
  );
};

export default CreateGymForm;