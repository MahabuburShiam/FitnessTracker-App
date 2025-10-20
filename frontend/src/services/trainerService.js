
const API_URL = '/api/trainers';

const getAllTrainers = (token) => {
  return axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
};

const getMyTrainerProfile = (token) => {
  return axios.get(`${API_URL}/profile`, { headers: { Authorization: `Bearer ${token}` } });
};

const createOrUpdateTrainerProfile = (token, profileData) => {
  return axios.post(`${API_URL}/profile`, profileData, { headers: { Authorization: `Bearer ${token}` } });
};

const rateTrainer = (token, trainerId, rating) => {
  return axios.post(`${API_URL}/${trainerId}/rate`, { rating }, { headers: { Authorization: `Bearer ${token}` } });
};

const trainerService = {
  getAllTrainers,
  getMyTrainerProfile,
  createOrUpdateTrainerProfile,
  rateTrainer,
};

export default trainerService;
