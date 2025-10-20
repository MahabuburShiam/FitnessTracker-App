
const API_URL = '/api/journals';

const getJournals = (token) => {
  return axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
};

const createJournal = (journalData, token) => {
  return axios.post(API_URL, journalData, { headers: { Authorization: `Bearer ${token}` } });
};

const addComment = (token, journalId, commentData) => {
  return axios.post(`${API_URL}/${journalId}/comments`, commentData, { headers: { Authorization: `Bearer ${token}` } });
};

const rateJournal = (token, journalId, rating) => {
  return axios.post(`${API_URL}/${journalId}/rate`, { rating }, { headers: { Authorization: `Bearer ${token}` } });
};

const journalService = {
  getJournals,
  createJournal,
  addComment,
  rateJournal,
};

export default journalService;
