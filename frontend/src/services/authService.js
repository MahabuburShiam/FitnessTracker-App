
import axios from 'axios';

const API_URL = '/api/auth';

const register = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

const login = (userData) => {
  return axios.post(`${API_URL}/login`, userData);
};

const getProfile = (token) => {
  return axios.get(`${API_URL}/profile`, { headers: { Authorization: `Bearer ${token}` } });
};

const updateProfile = (token, userData) => {
  return axios.put(`${API_URL}/profile`, userData, { headers: { Authorization: `Bearer ${token}` } });
};

const changePassword = (token, passwordData) => {
  return axios.put(`${API_URL}/change-password`, passwordData, { headers: { Authorization: `Bearer ${token}` } });
};

const authService = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
};

export default authService;
