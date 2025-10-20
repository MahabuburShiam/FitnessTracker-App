import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import * as journalApi from '../../api/journal';
import Rating, { AverageRating } from './Rating';
import CommentSection from './CommentSection';

const CommunityFeed = () => {
  const { user, token } = useAuth();
  const [publicEntries, setPublicEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicEntries = async () => {
      try {
        const entries = await journalApi.getPublicEntries(token);
        setPublicEntries(entries);
      } catch (err) {
        setError('Could not load the community feed.');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicEntries();
  }, [token]);

  const handleStateUpdate = (updatedEntry) => {
    setPublicEntries(prevEntries =>
      prevEntries.map(entry => (entry.id === updatedEntry.id ? updatedEntry : entry))
    );
  };

  if (loading) return <p>Loading community feed...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      {publicEntries.length === 0 && <p>No community entries yet. Be the first to publish one!</p>}
      {publicEntries.map(entry => {
        const userRating = entry.Ratings.find(r => r.userId === user.id)?.rating;
        return (
          <div key={entry.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold">{entry.title}</h3>
            <p className="text-sm text-gray-500 mb-2">By {entry.User.name} in <span className="font-semibold">{entry.category}</span></p>
            <p className="text-gray-700 whitespace-pre-wrap mb-4">{entry.content}</p>
            
            <div className="flex justify-between items-center border-t pt-4">
              <div>
                <p className="text-xs font-semibold mb-1">Your Rating</p>
                <Rating entryId={entry.id} initialRating={userRating} onRatingSubmitted={handleStateUpdate} />
              </div>
              <AverageRating ratings={entry.Ratings} />
            </div>
            <CommentSection entryId={entry.id} initialComments={entry.Comments} />
          </div>
        );
      })}
    </div>
  );
};

export default CommunityFeed;