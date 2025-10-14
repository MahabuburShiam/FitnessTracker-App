// src/components/Journal/JournalSearch.js
import React, { useState } from 'react';
import './Journal.css';

const JournalSearch = ({ onSearch, onCategoryChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'nutrition', label: 'Nutrition' },
    { value: 'mental_health', label: 'Mental Health' },
    { value: 'success_story', label: 'Success Story' },
    { value: 'tips', label: 'Tips & Advice' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  return (
    <div className="journal-search">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search journals..."
          />
          <button type="submit">Search</button>
        </div>
      </form>

      <div className="category-filters">
        {categories.map(cat => (
          <button
            key={cat.value}
            className={`category-filter ${selectedCategory === cat.value ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JournalSearch;