// src/services/projectService.js
import api from './api';

export const createProject = async (projectData) => {
  const response = await api.post('/projects', projectData);
  return response.data;
};

export const getProject = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const getAllProjects = async () => {
  const response = await api.get('/projects');
  return response.data;
};

export const addTechStack = async (techStackData) => {
  const response = await api.post('/techstack', techStackData);
  return response.data;
};

export const generateCode = async (projectId) => {
  const response = await api.post(`/projects/${projectId}/generate`);
  return response.data;
};