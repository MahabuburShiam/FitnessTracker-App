
const API_URL = '/api/gyms';

const getAllGyms = (token) => {
  return axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
};

const createGym = (token, gymData) => {
  return axios.post(API_URL, gymData, { headers: { Authorization: `Bearer ${token}` } });
};

const getGymById = (token, gymId) => {
  return axios.get(`${API_URL}/${gymId}`, { headers: { Authorization: `Bearer ${token}` } });
};

const updateGym = (token, gymId, gymData) => {
  return axios.put(`${API_URL}/${gymId}`, gymData, { headers: { Authorization: `Bearer ${token}` } });
};

const deleteGym = (token, gymId) => {
  return axios.delete(`${API_URL}/${gymId}`, { headers: { Authorization: `Bearer ${token}` } });
};

const rateGym = (token, gymId, rating) => {
  return axios.post(`${API_URL}/${gymId}/rate`, { rating }, { headers: { Authorization: `Bearer ${token}` } });
};

const getNearbyGyms = (token, lat, lon) => {
  return axios.get(`${API_URL}/nearby`, { params: { lat, lon }, headers: { Authorization: `Bearer ${token}` } });
};

const gymService = {
  getAllGyms,
  createGym,
  getGymById,
  updateGym,
  deleteGym,
  rateGym,
  getNearbyGyms,
};

export default gymService;
