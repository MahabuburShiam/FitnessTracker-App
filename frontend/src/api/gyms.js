const API_URL = 'http://localhost:5000/api/gyms';

// Search for gyms by location
export const searchGyms = async (location, facilities, token) => {
  const queryParams = new URLSearchParams();
  if (location) {
    queryParams.append('location', location);
  }
  if (facilities) {
    queryParams.append('facilities', facilities);
  }
  const response = await fetch(`${API_URL}?${queryParams.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to search for gyms');
  }
  return response.json();
};

// Create a new gym profile for the logged-in gym owner
export const createGym = async (gymData, token) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(gymData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create gym');
  }
  return response.json();
};

// Fetch the gym owned by the currently authenticated user
export const getMyGym = async (token) => {
  const response = await fetch(`${API_URL}/mygym`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch owned gym');
  return response.json();
};