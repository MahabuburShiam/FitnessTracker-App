// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Generic request function
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle unauthorized requests
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Authentication required');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Utility functions
const handleAPIError = (error, fallbackMessage = 'Something went wrong') => {
  console.error('API Error:', error);
  
  if (error.message.includes('Network Error')) {
    return 'Network error: Please check your internet connection';
  }
  
  if (error.message.includes('401')) {
    return 'Session expired. Please log in again.';
  }
  
  if (error.message.includes('404')) {
    return 'Resource not found';
  }
  
  if (error.message.includes('500')) {
    return 'Server error. Please try again later.';
  }
  
  return error.message || fallbackMessage;
};

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const formatParams = (params) => {
  const formatted = {};
  
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      formatted[key] = params[key];
    }
  });
  
  return formatted;
};

// Cache management
const cacheManager = {
  set: (key, data, ttl = 5 * 60 * 1000) => {
    const item = {
      data,
      expiry: Date.now() + ttl,
    };
    localStorage.setItem(`cache_${key}`, JSON.stringify(item));
  },
  
  get: (key) => {
    const itemStr = localStorage.getItem(`cache_${key}`);
    if (!itemStr) return null;
    
    const item = JSON.parse(itemStr);
    if (Date.now() > item.expiry) {
      localStorage.removeItem(`cache_${key}`);
      return null;
    }
    
    return item.data;
  },
  
  remove: (key) => {
    localStorage.removeItem(`cache_${key}`);
  },
  
  clear: () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    });
  },
};

// Retry wrapper for API calls
const withRetry = (apiFunction, maxRetries = 3) => {
  return async (...args) => {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await apiFunction(...args);
      } catch (error) {
        lastError = error;
        
        // Don't retry for these errors
        if (error.message.includes('401') || error.message.includes('404')) {
          break;
        }
        
        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    throw lastError;
  };
};

// Journal Cache Keys
const JOURNAL_CACHE_KEYS = {
  USER_JOURNALS: 'user_journals',
  COMMUNITY_JOURNALS: 'community_journals',
  JOURNAL_SEARCH: (params) => `journal_search_${JSON.stringify(params)}`,
  JOURNAL_COMMENTS: (journalId) => `journal_comments_${journalId}`,
  JOURNAL_DETAIL: (journalId) => `journal_detail_${journalId}`,
};

// Enhanced Journal APIs
const journalAPI = {
  createJournal: async (journalData) => {
    try {
      const response = await request('/journals/journals', {
        method: 'POST',
        body: journalData,
      });
      cacheManager.remove(JOURNAL_CACHE_KEYS.USER_JOURNALS);
      cacheManager.remove(JOURNAL_CACHE_KEYS.COMMUNITY_JOURNALS);
      return response;
    } catch (error) {
      throw new Error(handleAPIError(error, 'Failed to create journal'));
    }
  },

  getJournals: async (params = {}) => {
    const cacheKey = JOURNAL_CACHE_KEYS.JOURNAL_SEARCH(params);
    
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      return { journals: cached, fromCache: true };
    }

    try {
      const queryParams = new URLSearchParams(formatParams(params)).toString();
      const response = await request(`/journals/journals?${queryParams}`);
      
      cacheManager.set(cacheKey, response.journals, 2 * 60 * 1000);
      return response;
    } catch (error) {
      throw new Error(handleAPIError(error, 'Failed to fetch journals'));
    }
  },

  getUserJournals: async () => {
    const cacheKey = JOURNAL_CACHE_KEYS.USER_JOURNALS;
    
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      return { journals: cached, fromCache: true };
    }

    try {
      const response = await request('/journals/my-journals');
      cacheManager.set(cacheKey, response.journals, 2 * 60 * 1000);
      return response;
    } catch (error) {
      throw new Error(handleAPIError(error, 'Failed to fetch user journals'));
    }
  },

  addComment: async (journalId, commentData) => {
    try {
      const response = await request(`/journals/journals/${journalId}/comments`, {
        method: 'POST',
        body: commentData,
      });
      cacheManager.remove(JOURNAL_CACHE_KEYS.JOURNAL_COMMENTS(journalId));
      cacheManager.remove(JOURNAL_CACHE_KEYS.COMMUNITY_JOURNALS);
      return response;
    } catch (error) {
      throw new Error(handleAPIError(error, 'Failed to add comment'));
    }
  },

  rateJournal: async (journalId, rating) => {
    try {
      const response = await request(`/journals/journals/${journalId}/rate`, {
        method: 'POST',
        body: { rating },
      });
      cacheManager.remove(JOURNAL_CACHE_KEYS.COMMUNITY_JOURNALS);
      cacheManager.remove(JOURNAL_CACHE_KEYS.USER_JOURNALS);
      return response;
    } catch (error) {
      throw new Error(handleAPIError(error, 'Failed to rate journal'));
    }
  },

  getJournalComments: async (journalId) => {
    const cacheKey = JOURNAL_CACHE_KEYS.JOURNAL_COMMENTS(journalId);
    
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      return { comments: cached, fromCache: true };
    }

    try {
      // Note: You might need to add this endpoint to your backend
      // For now, we'll use the journals endpoint and filter
      const response = await request(`/journals/journals/${journalId}`);
      const comments = response.journal?.comments || [];
      cacheManager.set(cacheKey, comments, 5 * 60 * 1000);
      return { comments };
    } catch (error) {
      throw new Error(handleAPIError(error, 'Failed to fetch comments'));
    }
  },

  getJournalDetail: async (journalId) => {
    const cacheKey = JOURNAL_CACHE_KEYS.JOURNAL_DETAIL(journalId);
    
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      return { journal: cached, fromCache: true };
    }

    try {
      // Note: You might need to add this endpoint to your backend
      // For now, we'll simulate it
      const response = await request(`/journals/journals`);
      const journal = response.journals?.find(j => j.id === journalId);
      if (journal) {
        cacheManager.set(cacheKey, journal, 5 * 60 * 1000);
        return { journal };
      } else {
        throw new Error('Journal not found');
      }
    } catch (error) {
      throw new Error(handleAPIError(error, 'Failed to fetch journal details'));
    }
  },

  updateJournal: async (journalId, updateData) => {
    try {
      // Note: You might need to add this endpoint to your backend
      // For now, we'll simulate with POST
      const response = await request(`/journals/journals/${journalId}`, {
        method: 'POST',
        body: updateData,
      });
      cacheManager.remove(JOURNAL_CACHE_KEYS.USER_JOURNALS);
      cacheManager.remove(JOURNAL_CACHE_KEYS.COMMUNITY_JOURNALS);
      cacheManager.remove(JOURNAL_CACHE_KEYS.JOURNAL_DETAIL(journalId));
      return response;
    } catch (error) {
      throw new Error(handleAPIError(error, 'Failed to update journal'));
    }
  },

  deleteJournal: async (journalId) => {
    try {
      // Note: You might need to add this endpoint to your backend
      // For now, we'll simulate with POST
      const response = await request(`/journals/journals/${journalId}`, {
        method: 'DELETE',
      });
      cacheManager.remove(JOURNAL_CACHE_KEYS.USER_JOURNALS);
      cacheManager.remove(JOURNAL_CACHE_KEYS.COMMUNITY_JOURNALS);
      cacheManager.remove(JOURNAL_CACHE_KEYS.JOURNAL_DETAIL(journalId));
      return response;
    } catch (error) {
      throw new Error(handleAPIError(error, 'Failed to delete journal'));
    }
  }
};

// Debounced journal search
const debouncedJournalSearch = debounce(async (params, callback) => {
  try {
    const result = await journalAPI.getJournals(params);
    callback(result, null);
  } catch (error) {
    callback(null, error);
  }
}, 300);

// Enhanced Journal APIs with retry capability
const journalAPIWithRetry = {
  createJournal: withRetry(journalAPI.createJournal),
  getJournals: withRetry(journalAPI.getJournals),
  getUserJournals: withRetry(journalAPI.getUserJournals),
  addComment: withRetry(journalAPI.addComment),
  rateJournal: withRetry(journalAPI.rateJournal),
  getJournalComments: withRetry(journalAPI.getJournalComments),
  getJournalDetail: withRetry(journalAPI.getJournalDetail),
  updateJournal: withRetry(journalAPI.updateJournal),
  deleteJournal: withRetry(journalAPI.deleteJournal)
};

// Auth API
const authAPI = {
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: credentials,
  }),

  register: (userData) => request('/auth/register', {
    method: 'POST',
    body: userData,
  }),

  getProfile: () => request('/auth/profile'),

  updateProfile: (profileData) => request('/auth/profile', {
    method: 'PUT',
    body: profileData,
  }),

  changePassword: (passwordData) => request('/auth/change-password', {
    method: 'PUT',
    body: passwordData,
  }),
};

// Daily Logs API
const dailyLogsAPI = {
  createOrUpdate: (logData) => request('/daily-logs', {
    method: 'POST',
    body: logData,
  }),

  getLogs: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return request(`/daily-logs?${queryParams}`);
  },

  getLogByDate: (date) => request(`/daily-logs/${date}`),

  getProgress: (days = 30) => request(`/daily-logs/progress?days=${days}`),
};

// Workout Sessions API
const workoutSessionsAPI = {
  create: (sessionData) => request('/workouts/sessions', {
    method: 'POST',
    body: sessionData,
  }),

  getAll: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return request(`/workouts/sessions?${queryParams}`);
  },

  getById: (sessionId) => request(`/workouts/sessions/${sessionId}`),

  update: (sessionId, updateData) => request(`/workouts/sessions/${sessionId}`, {
    method: 'PUT',
    body: updateData,
  }),

  delete: (sessionId) => request(`/workouts/sessions/${sessionId}`, {
    method: 'DELETE',
  }),
};

// Sleep API
const sleepAPI = {
  create: (sleepData) => request('/sleep', {
    method: 'POST',
    body: sleepData,
  }),

  getAll: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return request(`/sleep?${queryParams}`);
  },

  update: (logId, updateData) => request(`/sleep/${logId}`, {
    method: 'PUT',
    body: updateData,
  }),

  getAnalysis: (period = 'week') => request(`/sleep/analysis?period=${period}`),
};

// Gym API
const gymAPI = {
  create: (gymData) => request('/gyms/gyms', {
    method: 'POST',
    body: gymData,
  }),

  getNearby: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return request(`/gyms/gyms/nearby?${queryParams}`);
  },

  rate: (gymId, ratingData) => request(`/gyms/gyms/${gymId}/rate`, {
    method: 'POST',
    body: ratingData,
  }),

  getById: (gymId) => request(`/gyms/gyms/${gymId}`),
};

// Trainer API
const trainerAPI = {
  createProfile: (profileData) => request('/trainers/trainer/profile', {
    method: 'POST',
    body: profileData,
  }),

  getAll: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return request(`/trainers/trainers?${queryParams}`);
  },

  rate: (trainerId, ratingData) => request(`/trainers/trainers/${trainerId}/rate`, {
    method: 'POST',
    body: ratingData,
  }),

  getProfile: (trainerId) => request(`/trainers/trainers/${trainerId}`),
};

// Messaging API
const messagingAPI = {
  createConversation: (conversationData) => request('/messaging/conversations', {
    method: 'POST',
    body: conversationData,
  }),

  getConversations: () => request('/messaging/conversations'),

  getDirectChat: (userId) => request(`/messaging/conversations/direct/${userId}`),

  getMessages: (conversationId) => request(`/messaging/conversations/${conversationId}/messages`),

  sendMessage: (conversationId, messageData) => request(`/messaging/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: messageData,
  }),
};

// Goals API
const goalsAPI = {
  create: (goalData) => request('/goals/goals', {
    method: 'POST',
    body: goalData,
  }),

  getAll: () => request('/goals/goals'),

  update: (goalId, updateData) => request(`/goals/goals/${goalId}`, {
    method: 'PUT',
    body: updateData,
  }),

  delete: (goalId) => request(`/goals/goals/${goalId}`, {
    method: 'DELETE',
  }),
};

// Notifications API
const notificationsAPI = {
  getAll: () => request('/notifications/notifications'),
};

// AI Suggestions API
const aiSuggestionsAPI = {
  getSuggestions: () => request('/ai-suggestions/ai-suggestions'),
};

// Admin API
const adminAPI = {
  getUsers: () => request('/admin/users'),
  deleteUser: (userId) => request(`/admin/users/${userId}`, {
    method: 'DELETE',
  }),
  getStatistics: () => request('/admin/statistics'),
};

// Health check
const healthAPI = {
  check: () => request('/health'),
};

// Export all APIs as named exports
export {
  authAPI,
  dailyLogsAPI,
  workoutSessionsAPI,
  sleepAPI,
  gymAPI,
  trainerAPI,
  messagingAPI,
  goalsAPI,
  notificationsAPI,
  aiSuggestionsAPI,
  adminAPI,
  healthAPI,
  journalAPI,
  journalAPIWithRetry,
  debouncedJournalSearch,
  handleAPIError,
  debounce,
  formatParams,
  cacheManager,
  withRetry,
};

// Export default object for convenience
export default {
  auth: authAPI,
  dailyLogs: dailyLogsAPI,
  workouts: workoutSessionsAPI,
  sleep: sleepAPI,
  gyms: gymAPI,
  trainers: trainerAPI,
  messaging: messagingAPI,
  goals: goalsAPI,
  notifications: notificationsAPI,
  ai: aiSuggestionsAPI,
  admin: adminAPI,
  health: healthAPI,
  
  // NEW JOURNAL EXPORTS
  journal: journalAPI,
  journalWithRetry: journalAPIWithRetry,
  debouncedJournalSearch,
  
  // Utility exports
  handleAPIError,
  debounce,
  formatParams,
  cacheManager,
  withRetry,
};