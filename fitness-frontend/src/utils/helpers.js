// Utility functions for API handling

// Handle API errors consistently
export const handleAPIError = (error, fallbackMessage = 'Something went wrong') => {
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

// Debounce function for search inputs
export const debounce = (func, wait) => {
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

// Format API parameters
export const formatParams = (params) => {
  const formatted = {};
  
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      formatted[key] = params[key];
    }
  });
  
  return formatted;
};

// Upload file helper
export const uploadFile = async (file, endpoint) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};

// Cache management
export const cacheManager = {
  set: (key, data, ttl = 5 * 60 * 1000) => { // 5 minutes default
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

// ===== NEW ADDITIONS FOR JOURNAL SYSTEM =====

// Journal specific utilities
export const formatJournalDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatCommentDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getCategoryLabel = (category) => {
  const categories = {
    fitness: 'Fitness',
    nutrition: 'Nutrition',
    mental_health: 'Mental Health',
    success_story: 'Success Story',
    tips: 'Tips & Advice'
  };
  return categories[category] || category;
};

export const validateJournalContent = (title, content) => {
  const errors = [];
  
  if (!title || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  }
  
  if (!content || content.trim().length < 10) {
    errors.push('Content must be at least 10 characters long');
  }
  
  if (title && title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }
  
  return errors;
};

export const parseTags = (tagsString) => {
  if (!tagsString) return [];
  return tagsString.split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
    .slice(0, 10); // Limit to 10 tags
};

export const calculateReadTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export const getRatingColor = (rating) => {
  if (rating >= 4) return '#28a745';
  if (rating >= 3) return '#ffc107';
  if (rating >= 2) return '#fd7e14';
  return '#dc3545';
};

export const shouldShowLoadMore = (currentCount, totalItems, pageSize) => {
  return currentCount < totalItems && currentCount >= pageSize;
};

// Journal content formatting
export const formatJournalContent = (content) => {
  return content.split('\n').map((paragraph, index) => 
    paragraph.trim() ? `<p key=${index}>${paragraph}</p>` : '<br/>'
  ).join('');
};

// Search and filter helpers
export const buildJournalSearchParams = (searchTerm, category, page = 1, limit = 10) => {
  const params = {
    page,
    limit
  };
  
  if (searchTerm && searchTerm.trim()) {
    params.search = searchTerm.trim();
  }
  
  if (category && category.trim()) {
    params.category = category.trim();
  }
  
  return params;
};

// Cache keys for journal system
export const JOURNAL_CACHE_KEYS = {
  USER_JOURNALS: 'user_journals',
  COMMUNITY_JOURNALS: 'community_journals',
  JOURNAL_COMMENTS: (journalId) => `journal_comments_${journalId}`,
  JOURNAL_DETAIL: (journalId) => `journal_detail_${journalId}`,
  JOURNAL_SEARCH: (params) => `journal_search_${JSON.stringify(params)}`
};

// Export all journal utilities
export const journalUtils = {
  formatJournalDate,
  formatCommentDate,
  getCategoryLabel,
  validateJournalContent,
  parseTags,
  calculateReadTime,
  getRatingColor,
  shouldShowLoadMore,
  formatJournalContent,
  buildJournalSearchParams,
  JOURNAL_CACHE_KEYS
};