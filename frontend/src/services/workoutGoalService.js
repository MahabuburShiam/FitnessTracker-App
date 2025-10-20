
import axios from 'axios';

const API_URL = '/api/goals';

const createWorkoutGoal = (token, goalData) => {
  return axios.post(API_URL, goalData, { headers: { Authorization: `Bearer ${token}` } });
};

const getWorkoutGoals = (token, status) => {
  return axios.get(API_URL, { params: { status }, headers: { Authorization: `Bearer ${token}` } });
};

const updateWorkoutGoal = (token, goalId, goalData) => {
  return axios.put(`${API_URL}/${goalId}`, goalData, { headers: { Authorization: `Bearer ${token}` } });
};

const deleteWorkoutGoal = (token, goalId) => {
  return axios.delete(`${API_URL}/${goalId}`, { headers: { Authorization: `Bearer ${token}` } });
};

const workoutGoalService = {
  createWorkoutGoal,
  getWorkoutGoals,
  updateWorkoutGoal,
  deleteWorkoutGoal,
};

export default workoutGoalService;
