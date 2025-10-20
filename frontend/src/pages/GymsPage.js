
import React, { useState, useEffect, useContext } from 'react';
import gymService from '../services/gymService';
import AuthContext from '../context/AuthContext';

const GymsPage = () => {
  const [gyms, setGyms] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      gymService.getAllGyms(localStorage.getItem('token'))
        .then(response => {
          setGyms(response.data);
        })
        .catch(error => {
          console.error('Error fetching gyms:', error);
        });
    }
  }, [user]);

  return (
    <div>
      <h1>Gyms</h1>
      <div>
        {gyms.map(gym => (
          <div key={gym.id}>
            <h2>{gym.name}</h2>
            <p>{gym.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GymsPage;
