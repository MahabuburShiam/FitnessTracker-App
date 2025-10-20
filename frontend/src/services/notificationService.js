
import axios from 'axios';

const API_URL = '/api/notifications';

const getNotifications = (token) => {
  return axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
};

const notificationService = {
  getNotifications,
};

export default notificationService;
