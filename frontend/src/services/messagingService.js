
import axios from 'axios';

const API_URL = '/api/conversations';

const createConversation = (token, participantIds) => {
  return axios.post(API_URL, { participantIds }, { headers: { Authorization: `Bearer ${token}` } });
};

const getConversations = (token) => {
  return axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
};

const findOrCreateDirectConversation = (token, userId) => {
  return axios.get(`${API_URL}/direct/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
};

const getMessages = (token, conversationId) => {
  return axios.get(`${API_URL}/${conversationId}/messages`, { headers: { Authorization: `Bearer ${token}` } });
};

const sendMessage = (token, conversationId, messageData) => {
  return axios.post(`${API_URL}/${conversationId}/messages`, messageData, { headers: { Authorization: `Bearer ${token}` } });
};

const messagingService = {
  createConversation,
  getConversations,
  findOrCreateDirectConversation,
  getMessages,
  sendMessage,
};

export default messagingService;
