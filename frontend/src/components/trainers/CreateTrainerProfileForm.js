import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import * as trainerApi from '../../api/trainers';

const CreateTrainerProfileForm = ({ onProfileCreated }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    specialization: '',
    bio: '',
    rate: '',
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
      const profileData = {
        ...formData,
        rate: Number(formData.rate)
      };
      const newProfile = await trainerApi.createTrainerProfile(profileData, token);
      onProfileCreated(newProfile);
    } catch (err) {
      setError(err.message || 'An error occurred while creating your profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Your Trainer Profile</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="specialization" className="block text-gray-700 font-bold mb-2">Specialization</label>
          <input type="text" name="specialization" id="specialization" placeholder="e.g., Weight Loss, Yoga" onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label htmlFor="bio" className="block text-gray-700 font-bold mb-2">Bio</label>
          <textarea name="bio" id="bio" rows="4" placeholder="Tell clients about yourself" onChange={handleChange} required className="w-full p-2 border rounded"></textarea>
        </div>
        <div className="mb-6">
          <label htmlFor="rate" className="block text-gray-700 font-bold mb-2">Hourly Rate ($)</label>
          <input type="number" name="rate" id="rate" min="0" step="1" onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-green-300">
          {loading ? 'Creating...' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
};

export default CreateTrainerProfileForm;