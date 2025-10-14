// src/pages/Trainers.js
import React, { useState, useEffect } from 'react';
import { trainerAPI } from '../services/api';
import TrainerCard from '../components/Trainer/TrainerCard';
import TrainerSearch from '../components/Trainer/TrainerSearch';
import './Trainers.css';

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load initial trainers
    handleSearch({});
  }, []);

  const handleSearch = async (searchParams) => {
    setLoading(true);
    try {
      const response = await trainerAPI.getTrainers(searchParams);
      setTrainers(response.data.trainers);
    } catch (error) {
      alert('Error fetching trainers: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTrainerClick = (trainerId) => {
    window.location.href = `/trainer/${trainerId}`;
  };

  return (
    <div className="trainers-page">
      <div className="trainers-header">
        <h1>Find Certified Trainers</h1>
        <p>Connect with professional fitness trainers</p>
      </div>

      <TrainerSearch onSearch={handleSearch} />

      {loading && <div className="loading">Loading trainers...</div>}

      <div className="trainers-grid">
        {trainers.map(trainer => (
          <TrainerCard 
            key={trainer.id} 
            trainer={trainer} 
            onClick={handleTrainerClick}
          />
        ))}
      </div>

      {trainers.length === 0 && !loading && (
        <div className="no-results">
          <p>No trainers found matching your criteria. Try adjusting your search filters.</p>
        </div>
      )}
    </div>
  );
};

export default Trainers;