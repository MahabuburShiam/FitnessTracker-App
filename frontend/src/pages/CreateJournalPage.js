
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import journalService from '../services/journalService';
import AuthContext from '../context/AuthContext';

const CreateJournalPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Fitness Journey');
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await journalService.createJournal({ title, content, category }, localStorage.getItem('token'));
      navigate('/journals');
    } catch (err) {
      setError('Failed to create journal entry');
    }
  };

  return (
    <div>
      <h1>Create Journal</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Fitness Journey">Fitness Journey</option>
          <option value="Nutrition Tips">Nutrition Tips</option>
          <option value="Workout Routines">Workout Routines</option>
          <option value="Mental Health">Mental Health</option>
          <option value="Success Stories">Success Stories</option>
        </select>
        <button type="submit">Publish</button>
      </form>
    </div>
  );
};

export default CreateJournalPage;
