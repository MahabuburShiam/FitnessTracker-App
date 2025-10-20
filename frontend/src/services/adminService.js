
import axios from 'axios';

const API_URL = '/api/admin';

const deleteUser = (token, userId) => {
  return axios.delete(`${API_URL}/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
};

const getStatistics = (token) => {
  return axios.get(`${API_URL}/statistics`, { headers: { Authorization: `Bearer ${token}` } });
};

const adminService = {
  deleteUser,
  getStatistics,
};

export default adminService;
