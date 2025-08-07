export const API_CONFIG = {
  BASE_URL: 'http://192.168.68.54:3001/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  PROFILE: {
    CREATE: '/profile',
    GET_ME: '/profile/me',
    UPDATE_ME: '/profile/me',
    SEARCH: '/profile/search',
  },
  UPLOAD: {
    PROFILE_PICTURE: '/upload/profile-picture',
  },
}; 