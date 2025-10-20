const API_URL = 'http://localhost:5000/api/journal';

// Fetch all journal entries for the logged-in user
export const getMyEntries = async (token) => {
  const response = await fetch(`${API_URL}/my-entries`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch journal entries');
  }
  return response.json();
};

// Create a new journal entry
export const createEntry = async (entryData, token) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(entryData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create entry');
  }
  return response.json();
};

// Fetch all published journal entries for the community feed
export const getPublicEntries = async (token) => {
  const response = await fetch(`${API_URL}/public`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch public journal entries');
  }
  return response.json();
};

// Update an entry, e.g., to publish it
export const updateEntry = async (entryId, updateData, token) => {
  const response = await fetch(`${API_URL}/${entryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });
  if (!response.ok) {
    throw new Error('Failed to update entry');
  }
  return response.json();
};

// Add a comment to a journal entry
export const addComment = async (entryId, commentData, token) => {
  const response = await fetch(`${API_URL}/${entryId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(commentData),
  });
  if (!response.ok) {
    throw new Error('Failed to add comment');
  }
  return response.json();
};

// Add or update a rating for a journal entry
export const addRating = async (entryId, ratingData, token) => {
  const response = await fetch(`${API_URL}/${entryId}/rate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(ratingData),
  });
  if (!response.ok) {
    throw new Error('Failed to add rating');
  }
  return response.json();
};