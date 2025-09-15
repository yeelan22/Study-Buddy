import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const instance = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:5000/api',
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
