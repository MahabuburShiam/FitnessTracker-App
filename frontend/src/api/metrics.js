const API_URL = 'http://localhost:5000/api/metrics';

// Fetch all metrics for the logged-in user
export const getMyMetrics = async (token) => {
  const response = await fetch(`${API_URL}/my-metrics`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch metrics');
  }
  return response.json();
};

// Create a new metric entry
export const logMetric = async (metricData, token) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(metricData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to log metric');
  }
  return response.json();
};