// Axios instance with base URL and auth token interceptor
import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Automatically attach JWT token to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('foodie_user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;
