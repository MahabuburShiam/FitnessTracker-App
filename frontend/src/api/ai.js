const API_URL = 'http://localhost:5000/api/ai';

// Get an AI-powered suggestion
export const getAiSuggestion = async (prompt, token) => {
  const response = await fetch(`${API_URL}/suggestions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ prompt }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to get AI suggestion');
  }
  return response.json();
};