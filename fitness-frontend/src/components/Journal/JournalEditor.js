// src/components/Journal/JournalEditor.js
import React, { useState } from 'react';
import { journalAPI } from '../../services/api';
import './Journal.css';

const JournalEditor = ({ journal, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: journal?.title || '',
    content: journal?.content || '',
    category: journal?.category || 'fitness',
    tags: journal?.tags?.join(', ') || '',
    isPublished: journal?.isPublished || false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'fitness', label: 'Fitness' },
    { value: 'nutrition', label: 'Nutrition' },
    { value: 'mental_health', label: 'Mental Health' },
    { value: 'success_story', label: 'Success Story' },
    { value: 'tips', label: 'Tips & Advice' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const journalData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      let response;
      if (journal) {
        // Update existing journal
        // You might need to add an update endpoint
        response = await journalAPI.createJournal(journalData);
      } else {
        // Create new journal
        response = await journalAPI.createJournal(journalData);
      }

      onSave(response.journal);
    } catch (error) {
      alert('Error saving journal: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="journal-editor">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Enter journal title"
            required
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Content *</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            placeholder="Write your journal entry..."
            rows="10"
            required
          />
        </div>

        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
            placeholder="e.g., workout, nutrition, motivation"
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
            />
            Publish to community
          </label>
        </div>

        <div className="editor-actions">
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-save">
            {isSubmitting ? 'Saving...' : (journal ? 'Update' : 'Create')} Journal
          </button>
        </div>
      </form>
    </div>
  );
};

export default JournalEditor;