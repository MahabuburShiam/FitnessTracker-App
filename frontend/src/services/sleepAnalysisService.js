
import axios from 'axios';

const API_URL = '/api/sleep-analysis';

const getSleepAnalysis = (token) => {
  return axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
};

const sleepAnalysisService = {
  getSleepAnalysis,
};

export default sleepAnalysisService;
