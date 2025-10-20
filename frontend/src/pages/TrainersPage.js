
import React, { useState, useEffect, useContext } from 'react';
import trainerService from '../services/trainerService';
import AuthContext from '../context/AuthContext';

const TrainersPage = () => {
  const [trainers, setTrainers] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      trainerService.getAllTrainers(localStorage.getItem('token'))
        .then(response => {
          setTrainers(response.data);
        })
        .catch(error => {
          console.error('Error fetching trainers:', error);
        });
    }
  }, [user]);

  return (
    <div>
      <h1>Trainers</h1>
      <div>
        {trainers.map(trainer => (
          <div key={trainer.id}>
            <h2>{trainer.user.email}</h2>
            <p>{trainer.specialization}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainersPage;
