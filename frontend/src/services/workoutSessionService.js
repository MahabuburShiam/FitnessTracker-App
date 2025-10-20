
import axios from 'axios';

const API_URL = '/api/sessions';

const createWorkoutSession = (token, sessionData) => {
  return axios.post(API_URL, sessionData, { headers: { Authorization: `Bearer ${token}` } });
};

const getWorkoutSessions = (token) => {
  return axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
};

const getWorkoutSession = (token, sessionId) => {
  return axios.get(`${API_URL}/${sessionId}`, { headers: { Authorization: `Bearer ${token}` } });
};

const updateWorkoutSession = (token, sessionId, sessionData) => {
  return axios.put(`${API_URL}/${sessionId}`, sessionData, { headers: { Authorization: `Bearer ${token}` } });
};

const deleteWorkoutSession = (token, sessionId) => {
  return axios.delete(`${API_URL}/${sessionId}`, { headers: { Authorization: `Bearer ${token}` } });
};

const workoutSessionService = {
  createWorkoutSession,
  getWorkoutSessions,
  getWorkoutSession,
  updateWorkoutSession,
  deleteWorkoutSession,
};

export default workoutSessionService;
