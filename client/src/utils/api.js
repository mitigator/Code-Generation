import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const processDescription = async (projectName, projectDescription, action) => {
  try {
    const formData = new FormData();
    formData.append('projectName', projectName);
    formData.append('projectDescription', projectDescription);
    formData.append('action', action);

    const response = await axios.post(`${API_URL}/description`, formData);
    return response.data;
  } catch (error) {
    console.error('Error processing description:', error);
    throw error;
  }
};

export const generateEntities = async (projectData) => {
  try {
    const formData = new FormData();
    formData.append('projectData', JSON.stringify(projectData));

    const response = await axios.post(`${API_URL}/generate-entities`, formData);
    return response.data;
  } catch (error) {
    console.error('Error generating entities:', error);
    throw error;
  }
};

export const refineEntities = async (entityData) => {
  try {
    const formData = new FormData();
    formData.append('entityData', JSON.stringify(entityData));

    const response = await axios.post(`${API_URL}/refine-entities`, formData);
    return response.data;
  } catch (error) {
    console.error('Error refining entities:', error);
    throw error;
  }
};