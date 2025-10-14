// src/pages/Journal.js (Personal Journal)
import React, { useState, useEffect } from 'react';
import { journalAPI } from '../services/api';
import JournalCard from '../components/Journal/JournalCard';
import JournalEditor from '../components/Journal/JournalEditor';
import './Journal.css';

const Journal = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingJournal, setEditingJournal] = useState(null);

  useEffect(() => {
    fetchUserJournals();
  }, []);

  const fetchUserJournals = async () => {
    setLoading(true);
    try {
      const response = await journalAPI.getUserJournals();
      setJournals(response.journals || []);
    } catch (error) {
      alert('Error fetching journals: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJournal = () => {
    setEditingJournal(null);
    setShowEditor(true);
  };

  const handleEditJournal = (journal) => {
    setEditingJournal(journal);
    setShowEditor(true);
  };

  const handleSaveJournal = (savedJournal) => {
    setShowEditor(false);
    fetchUserJournals(); // Refresh the list
  };

  const handleJournalClick = (journalId) => {
    // Navigate to journal detail or open in modal
    window.location.href = `/journal/${journalId}`;
  };

  if (showEditor) {
    return (
      <div className="journal-page">
        <div className="page-header">
          <h1>{editingJournal ? 'Edit Journal' : 'Create New Journal'}</h1>
          <button onClick={() => setShowEditor(false)} className="btn-back">
            ← Back to Journals
          </button>
        </div>
        <JournalEditor
          journal={editingJournal}
          onSave={handleSaveJournal}
          onCancel={() => setShowEditor(false)}
        />
      </div>
    );
  }

  return (
    <div className="journal-page">
      <div className="page-header">
        <h1>My Journal</h1>
        <button onClick={handleCreateJournal} className="btn-primary">
          + New Journal Entry
        </button>
      </div>

      {loading && <div className="loading">Loading your journals...</div>}

      <div className="journals-grid">
        {journals.map(journal => (
          <JournalCard
            key={journal.id}
            journal={journal}
            onClick={handleJournalClick}
            showUser={false}
          />
        ))}
      </div>

      {journals.length === 0 && !loading && (
        <div className="empty-state">
          <h3>No journal entries yet</h3>
          <p>Start documenting your fitness journey by creating your first journal entry!</p>
          <button onClick={handleCreateJournal} className="btn-primary">
            Create Your First Journal
          </button>
        </div>
      )}
    </div>
  );
};

export default Journal;