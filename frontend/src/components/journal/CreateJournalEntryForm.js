import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import * as journalApi from '../../api/journal';

const CreateJournalEntryForm = ({ onEntryCreated }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Fitness Journey', // Default category
    isPublic: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = ['Fitness Journey', 'Nutrition Tips', 'Workout Routines', 'Mental Health', 'Success Stories'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'isPublic') {
      setFormData(prev => ({ ...prev, isPublic: e.target.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const newEntry = await journalApi.createEntry(formData, token);
      onEntryCreated(newEntry);
      setFormData({ title: '', content: '', category: 'Fitness Journey', isPublic: false }); // Reset form
    } catch (err) {
      setError(err.message || 'Failed to create journal entry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border">
      <h3 className="text-xl font-bold mb-4">New Journal Entry</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <input type="text" name="title" placeholder="Entry Title" value={formData.title} onChange={handleChange} required className="w-full p-2 border rounded" />
      </div>
      <div className="mb-4">
        <textarea name="content" rows="5" placeholder="Share your thoughts..." value={formData.content} onChange={handleChange} required className="w-full p-2 border rounded"></textarea>
      </div>
      <div className="mb-4">
        <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded bg-white">
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      <div className="mb-4 flex items-center">
        <input type="checkbox" name="isPublic" id="isPublic" checked={formData.isPublic} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
        <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">Publish to Community</label>
      </div>
      <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-green-300">
        {loading ? 'Saving...' : 'Save Entry'}
      </button>
    </form>
  );
};

export default CreateJournalEntryForm;