// src/services/api.js
import axios from 'axios';

// Use a production environment variable, fallback to localhost for development
// REACT_APP_API_BASE_URL will be set in Netlify environment variables
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE,
});

// Add token to every request if exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const registerUser = (formData) => api.post('/auth/register', formData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);

// User Actions
export const scanQr = (cafeId) => api.post('/user/scan', { cafeId });
export const sendRating = ({ cafeId, rating, comment }) =>
    api.post('/user/rate', { cafeId, rating, comment });

// Data Fetching
export const fetchCafes = () => api.get('/cafes');
export const fetchBaristas = (cafeId) => api.get(`/cafes/${cafeId}/baristas`);

export default api;