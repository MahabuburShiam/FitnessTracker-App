// src/pages/JournalCommunity.js
import React, { useState, useEffect } from 'react';
import { journalAPI } from '../services/api';
import JournalCard from '../components/Journal/JournalCard';
import JournalSearch from '../components/Journal/JournalSearch';
import './Journal.css';

const JournalCommunity = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({});

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async (params = {}) => {
    setLoading(true);
    try {
      const response = await journalAPI.getJournals(params);
      setJournals(response.journals || []);
    } catch (error) {
      alert('Error fetching journals: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    const params = { ...searchParams, search: searchTerm };
    setSearchParams(params);
    fetchJournals(params);
  };

  const handleCategoryChange = (category) => {
    const params = { ...searchParams, category: category || undefined };
    setSearchParams(params);
    fetchJournals(params);
  };

  const handleJournalClick = (journalId) => {
    window.location.href = `/journal/${journalId}`;
  };

  return (
    <div className="journal-community">
      <div className="page-header">
        <h1>Community Journals</h1>
        <p>Discover inspiring stories and tips from our fitness community</p>
      </div>

      <JournalSearch
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
      />

      {loading && <div className="loading">Loading community journals...</div>}

      <div className="journals-grid">
        {journals.map(journal => (
          <JournalCard
            key={journal.id}
            journal={journal}
            onClick={handleJournalClick}
            showUser={true}
          />
        ))}
      </div>

      {journals.length === 0 && !loading && (
        <div className="empty-state">
          <h3>No journals found</h3>
          <p>Try adjusting your search criteria or check back later for new posts.</p>
        </div>
      )}
    </div>
  );
};

export default JournalCommunity;