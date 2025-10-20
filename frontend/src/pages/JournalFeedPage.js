
import React, { useState, useEffect, useContext } from 'react';
import journalService from '../services/journalService';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const JournalFeedPage = () => {
  const [journals, setJournals] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      journalService.getJournals(localStorage.getItem('token'))
        .then(response => {
          setJournals(response.data);
        })
        .catch(error => {
          console.error('Error fetching journals:', error);
        });
    }
  }, [user]);

  return (
    <div>
      <h1>Journal Feed</h1>
      <Link to="/journals/new">Create New Journal</Link>
      <div>
        {journals.map(journal => (
          <div key={journal.id}>
            <h2>{journal.title}</h2>
            <p>{journal.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JournalFeedPage;
