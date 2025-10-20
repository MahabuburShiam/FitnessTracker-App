
import axios from 'axios';

const API_URL = '/api';

const createOrUpdateLog = (token, logData) => {
  return axios.post(API_URL, logData, { headers: { Authorization: `Bearer ${token}` } });
};

const getLogs = (token, startDate, endDate) => {
  return axios.get(API_URL, { params: { startDate, endDate }, headers: { Authorization: `Bearer ${token}` } });
};

const getLogByDate = (token, date) => {
  return axios.get(`${API_URL}/${date}`, { headers: { Authorization: `Bearer ${token}` } });
};

const getProgress = (token) => {
  return axios.get(`${API_URL}/progress/summary`, { headers: { Authorization: `Bearer ${token}` } });
};

const dailyLogService = {
  createOrUpdateLog,
  getLogs,
  getLogByDate,
  getProgress,
};

export default dailyLogService;
