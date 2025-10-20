const API_URL = 'http://localhost:5000/api/messages';

// Fetch all conversations for the logged-in user
export const getMyConversations = async (token) => {
  const response = await fetch(`${API_URL}/conversations`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch conversations');
  return response.json();
};

// Fetch a specific conversation with another user
export const getConversationWithUser = async (userId, token) => {
  const response = await fetch(`${API_URL}/conversations/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch conversation');
  return response.json();
};

// Send a message to a user
export const sendMessage = async (recipientId, content, token) => {
  const response = await fetch(`${API_URL}/conversations/${recipientId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to send message');
  }
  return response.json();
};