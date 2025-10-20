const API_URL = 'http://localhost:5000/api/workouts';

// Fetch all workout sessions for the logged-in user
export const getMySessions = async (token) => {
  const response = await fetch(`${API_URL}/my-sessions`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch workout sessions');
  }
  return response.json();
};

// Start a new workout session
export const startSession = async (sessionData, token) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(sessionData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to start session');
  }
  return response.json();
};

// Add an exercise to a specific workout session
export const addExercise = async (sessionId, exerciseData, token) => {
  const response = await fetch(`${API_URL}/${sessionId}/exercises`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(exerciseData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add exercise');
  }
  return response.json();
};