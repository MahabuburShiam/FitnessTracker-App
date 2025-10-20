import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import * as gymApi from '../../api/gyms';
import CreateGymForm from '../gyms/CreateGymForm';

const GymOwnerDashboard = () => {
  const { token } = useAuth();
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGym = async () => {
      try {
        const myGym = await gymApi.getMyGym(token);
        setGym(myGym);
      } catch (err) {
        // It's okay if it fails with a 404, it just means no gym exists yet.
        if (err.message.includes('404') || err.message.includes('not found')) {
          setGym(null);
        } else {
          setError('Could not fetch your gym data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchGym();
  }, [token]);

  if (loading) return <div>Loading your gym profile...</div>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold">Gym Owner Dashboard</h1>
      {gym ? (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2">{gym.name}</h2>
          <p className="text-gray-700 mb-4">{gym.address}</p>
          <div className="mb-4">
            <h3 className="font-semibold">Facilities:</h3>
            <ul className="list-disc list-inside">
              {gym.facilities.map((facility, index) => <li key={index}>{facility}</li>)}
            </ul>
          </div>
          <p className="text-gray-500">Your gym is live and visible to users.</p>
        </div>
      ) : (
        <CreateGymForm onGymCreated={setGym} />
      )}
    </div>
  );
};

export default GymOwnerDashboard;