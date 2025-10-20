const API_URL = 'http://localhost:5000/api/notifications';

// Fetch all notifications for the logged-in user
export const getMyNotifications = async (token) => {
  const response = await fetch(API_URL, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }
  return response.json();
};

// Mark all notifications as read
export const markAllAsRead = async (token) => {
  const response = await fetch(`${API_URL}/read`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to mark notifications as read');
  }
  return response.json();
};