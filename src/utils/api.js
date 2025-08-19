import axios from 'axios';

const api = axios.create({
  baseURL: 'https://leave-management-backend-3-u3sk.onrender.com/',  // your backend base URL
});

// Add a request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
