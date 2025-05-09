// frontend-code-gen/src/services/api.js
import axios from 'axios';

// Set the base URL explicitly to your backend server
const API_URL = 'http://localhost:8080';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Set this based on your CORS setup
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user'); // Remove invalid data
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

// Authentication API calls
const authAPI = {
  register: async (userData) => {
    try {
      console.log('Making register API call with data:', userData);
      const response = await api.post('/api/auth/register', userData);
      console.log('Register API response:', response.data);
      
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('Register API error:', error.response?.data || error.message);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('Login API error:', error.response?.data || error.message);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },
};

// Project API calls
const projectAPI = {
  getAllProjects: async () => {
    const response = await api.get('/api/projects');
    return response.data;
  },

  getProjectById: async (id) => {
    const response = await api.get(`/api/projects/${id}`);
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await api.post('/api/projects', projectData);
    return response.data;
  },

  updateProject: async (id, projectData) => {
    const response = await api.put(`/api/projects/${id}`, projectData);
    return response.data;
  },

  deleteProject: async (id) => {
    const response = await api.delete(`/api/projects/${id}`);
    return response.data;
  },

  getProjectLogs: async (id) => {
    const response = await api.get(`/api/projects/${id}/logs`);
    return response.data;
  },

  generateCode: async (id) => {
    const response = await api.post(`/api/codegen/projects/${id}/generate`);
    return response.data;
  },

  getGenerationStatus: async (id) => {
    const response = await api.get(`/api/codegen/projects/${id}/status`);
    return response.data;
  },
};

// FlowiseAI API calls
const flowiseAPI = {
  generateDescription: async (data) => {
    const response = await api.post('/api/flowise/generate-description', data);
    return response.data;
  },

  generateEntities: async (data) => {
    const response = await api.post('/api/flowise/generate-entities', data);
    return response.data;
  },
};

export { authAPI, projectAPI, flowiseAPI };