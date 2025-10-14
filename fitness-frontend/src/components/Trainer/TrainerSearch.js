// src/components/Trainer/TrainerSearch.js
import React, { useState } from 'react';
import './Trainer.css';

const TrainerSearch = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    specialization: '',
    minRating: '',
    maxRate: '',
    page: 1,
    limit: 10
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // Clean up empty values
    const cleanedParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => value !== '')
    );
    onSearch(cleanedParams);
  };

  const specializations = [
    'weight_loss',
    'bodybuilding',
    'yoga',
    'rehabilitation',
    'cardio',
    'strength_training',
    'crossfit',
    'pilates'
  ];

  return (
    <div className="trainer-search">
      <form onSubmit={handleSearch}>
        <div className="search-fields">
          <div className="form-group">
            <label>Specialization</label>
            <select
              value={searchParams.specialization}
              onChange={(e) => setSearchParams({...searchParams, specialization: e.target.value})}
            >
              <option value="">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>
                  {spec.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Minimum Rating</label>
            <select
              value={searchParams.minRating}
              onChange={(e) => setSearchParams({...searchParams, minRating: e.target.value})}
            >
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
            </select>
          </div>

          <div className="form-group">
            <label>Max Hourly Rate ($)</label>
            <input
              type="number"
              value={searchParams.maxRate}
              onChange={(e) => setSearchParams({...searchParams, maxRate: e.target.value})}
              placeholder="No limit"
              min="0"
            />
          </div>
        </div>
        <button type="submit" className="search-btn">
          Find Trainers
        </button>
      </form>
    </div>
  );
};

export default TrainerSearch;