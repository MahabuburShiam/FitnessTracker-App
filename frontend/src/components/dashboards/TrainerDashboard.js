import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import * as trainerApi from '../../api/trainers';
import CreateTrainerProfileForm from '../trainers/CreateTrainerProfileForm';

const TrainerDashboard = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const myProfile = await trainerApi.getMyTrainerProfile(token);
        setProfile(myProfile);
      } catch (err) {
        if (err.message.includes('404') || err.message.includes('not found')) {
          setProfile(null);
        } else {
          setError('Could not fetch your profile data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  if (loading) return <div>Loading your trainer profile...</div>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold">Trainer Dashboard</h1>
      {profile ? (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2">Your Profile</h2>
          <p className="text-lg font-semibold">Specialization: <span className="font-normal">{profile.specialization}</span></p>
          <p className="text-lg font-semibold">Hourly Rate: <span className="font-normal">${profile.rate}</span></p>
          <div className="mt-4">
            <h3 className="font-semibold">Bio:</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
          </div>
        </div>
      ) : (
        <CreateTrainerProfileForm onProfileCreated={setProfile} />
      )}
    </div>
  );
};

export default TrainerDashboard;