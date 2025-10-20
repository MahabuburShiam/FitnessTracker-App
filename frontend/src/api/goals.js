const API_URL = 'http://localhost:5000/api/goals';

// Fetch all goals for the logged-in user
export const getMyGoals = async (token) => {
  const response = await fetch(`${API_URL}/my-goals`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch goals');
  }
  return response.json();
};

// Create a new goal
export const createGoal = async (goalData, token) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(goalData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create goal');
  }
  return response.json();
};

// Update a goal (e.g., its current value or status)
export const updateGoal = async (goalId, updateData, token) => {
  const response = await fetch(`${API_URL}/${goalId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update goal');
  }
  return response.json();
};