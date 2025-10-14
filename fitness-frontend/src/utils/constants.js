// src/utils/constants.js
// Application constants

// User Types
export const USER_TYPES = {
  USER: 'user',
  TRAINER: 'trainer',
  GYM_OWNER: 'gym_owner',
  ADMIN: 'admin',
};

// Workout Intensities
export const WORKOUT_INTENSITIES = {
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high',
};

// Mood Levels
export const MOOD_LEVELS = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  AVERAGE: 'average',
  POOR: 'poor',
  TERRIBLE: 'terrible',
};

// Energy Levels
export const ENERGY_LEVELS = {
  VERY_HIGH: 'very_high',
  HIGH: 'high',
  MODERATE: 'moderate',
  LOW: 'low',
  VERY_LOW: 'very_low',
};

// Sleep Quality
export const SLEEP_QUALITY = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  FAIR: 'fair',
  POOR: 'poor',
};

// Workout Session Status
export const WORKOUT_STATUS = {
  PLANNED: 'planned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  SKIPPED: 'skipped',
  CANCELLED: 'cancelled',
};

// Activity Levels based on steps
export const ACTIVITY_LEVELS = {
  SEDENTARY: { min: 0, max: 4999, label: 'Sedentary' },
  LIGHT: { min: 5000, max: 7499, label: 'Light' },
  MODERATE: { min: 7500, max: 9999, label: 'Moderate' },
  ACTIVE: { min: 10000, max: 12499, label: 'Active' },
  VERY_ACTIVE: { min: 12500, max: Infinity, label: 'Very Active' },
};

// Daily Goals
export const DAILY_GOALS = {
  STEPS: 10000,
  WATER: 2.0, // liters
  MAX_CALORIES: 2500,
};

// Sleep Recommendations
export const SLEEP_RECOMMENDATIONS = {
  MIN_DURATION: 7,
  MAX_DURATION: 9,
  OPTIMAL_DURATION: { min: 7, max: 9 },
};

// BMI Categories
export const BMI_CATEGORIES = {
  UNDERWEIGHT: { min: 0, max: 18.4, label: 'Underweight' },
  NORMAL: { min: 18.5, max: 24.9, label: 'Normal weight' },
  OVERWEIGHT: { min: 25, max: 29.9, label: 'Overweight' },
  OBESITY: { min: 30, max: Infinity, label: 'Obesity' },
};

// Gym Amenities
export const GYM_AMENITIES = {
  CARDIO_EQUIPMENT: 'cardio_equipment',
  WEIGHT_EQUIPMENT: 'weight_equipment',
  POOL: 'pool',
  SAUNA: 'sauna',
  GROUP_CLASSES: 'group_classes',
  PERSONAL_TRAINING: 'personal_training',
  LOCKER_ROOMS: 'locker_rooms',
  SHOWERS: 'showers',
  PARKING: 'parking',
  WI_FI: 'wifi',
};

// Trainer Specializations
export const TRAINER_SPECIALIZATIONS = {
  STRENGTH_TRAINING: 'strength_training',
  CARDIO: 'cardio',
  YOGA: 'yoga',
  PILATES: 'pilates',
  NUTRITION: 'nutrition',
  WEIGHT_LOSS: 'weight_loss',
  MUSCLE_GAIN: 'muscle_gain',
  SENIOR_FITNESS: 'senior_fitness',
  PRE_POST_NATAL: 'pre_post_natal',
  REHABILITATION: 'rehabilitation',
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  DAILY_LOGS: '/daily-logs',
  WORKOUTS: '/workouts',
  SLEEP: '/sleep',
  GYMS: '/gyms',
  TRAINERS: '/trainers',
  MESSAGING: '/messaging',
  GOALS: '/goals',
  NOTIFICATIONS: '/notifications',
  AI_SUGGESTIONS: '/ai-suggestions',
  ADMIN: '/admin',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  API: 'YYYY-MM-DD',
  TIME: 'HH:mm',
};

// Gym and Trainer specific constants
export const GYM_FACILITIES = [
  'cardio_equipment',
  'weight_equipment', 
  'pool',
  'sauna',
  'group_classes',
  'personal_training',
  'locker_rooms',
  'showers',
  'parking',
  'wifi'
];

export const TRAINER_LANGUAGES = [
  'English',
  'Spanish', 
  'French',
  'German',
  'Chinese',
  'Hindi',
  'Arabic',
  'Portuguese',
  'Russian',
  'Japanese'
];

export const RATING_OPTIONS = [1, 2, 3, 4, 5];

export default {
  USER_TYPES,
  WORKOUT_INTENSITIES,
  MOOD_LEVELS,
  ENERGY_LEVELS,
  SLEEP_QUALITY,
  WORKOUT_STATUS,
  ACTIVITY_LEVELS,
  DAILY_GOALS,
  SLEEP_RECOMMENDATIONS,
  BMI_CATEGORIES,
  GYM_AMENITIES,
  TRAINER_SPECIALIZATIONS,
  API_ENDPOINTS,
  STORAGE_KEYS,
  DATE_FORMATS,
  GYM_FACILITIES,
  TRAINER_LANGUAGES,
  RATING_OPTIONS,
};