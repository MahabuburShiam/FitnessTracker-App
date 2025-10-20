
import axios from 'axios';

const API_URL = '/api/ai-suggestions';

const getAISuggestions = (token) => {
  return axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
};

const aiSuggestionService = {
  getAISuggestions,
};

export default aiSuggestionService;
