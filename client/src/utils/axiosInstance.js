import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://backend-study-buddy-production.up.railway.app' || 'http://localhost:5000/api',
});

// Automatically attach token if exists
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // ✅ stored manually in userStore
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
