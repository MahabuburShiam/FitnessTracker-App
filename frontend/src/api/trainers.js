const API_URL = 'http://localhost:5000/api/trainers';

// Create a new trainer profile for the logged-in user
export const createTrainerProfile = async (profileData, token) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create trainer profile');
  }
  return response.json();
};

// Fetch the profile of the currently authenticated trainer
export const getMyTrainerProfile = async (token) => {
  const response = await fetch(`${API_URL}/myprofile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch trainer profile');
  return response.json();
};

// Fetch all trainer profiles for discovery
export const getAllTrainers = async (token, filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.specialization) {
    queryParams.append('specialization', filters.specialization);
  }
  if (filters.maxRate) {
    queryParams.append('maxRate', filters.maxRate);
  }
  const queryString = queryParams.toString();

  const response = await fetch(`${API_URL}${queryString ? `?${queryString}` : ''}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch trainers');
  return response.json();
};