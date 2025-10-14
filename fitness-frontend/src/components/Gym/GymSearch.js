// src/components/Gym/GymSearch.js
import React, { useState } from 'react';
import './Gym.css';

const GymSearch = ({ onSearch, currentLocation }) => {
  const [searchParams, setSearchParams] = useState({
    radius: 10,
    limit: 20
  });

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({
      ...searchParams,
      latitude: currentLocation?.latitude,
      longitude: currentLocation?.longitude
    });
  };

  return (
    <div className="gym-search">
      <form onSubmit={handleSearch}>
        <div className="search-fields">
          <div className="form-group">
            <label>Search Radius (km)</label>
            <input
              type="number"
              value={searchParams.radius}
              onChange={(e) => setSearchParams({...searchParams, radius: e.target.value})}
              min="1"
              max="50"
            />
          </div>
          <div className="form-group">
            <label>Max Results</label>
            <input
              type="number"
              value={searchParams.limit}
              onChange={(e) => setSearchParams({...searchParams, limit: e.target.value})}
              min="1"
              max="50"
            />
          </div>
        </div>
        <button type="submit" className="search-btn">
          Find Nearby Gyms
        </button>
      </form>
    </div>
  );
};

export default GymSearch;