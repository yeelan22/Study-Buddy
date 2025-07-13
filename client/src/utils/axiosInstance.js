import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5001/api',
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
