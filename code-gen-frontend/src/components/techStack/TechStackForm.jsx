// src/components/techStack/TechStackForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTechStack } from '../../services/projectService';
import Button from '../common/Button';

const TechStackForm = ({ projectId }) => {
  const [techStack, setTechStack] = useState({
    frontend: 'React with Tailwind CSS',
    backend: 'Node.js with Express.js',
    database: 'MongoDB',
    ai: 'Flowise AI'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTechStack(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      await addTechStack({
        projectId,
        ...techStack
      });
      
      navigate(`/projects/${projectId}/code`);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to add tech stack');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Select Tech Stack</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Frontend
          </label>
          <select
            name="frontend"
            value={techStack.frontend}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="React with Tailwind CSS">React with Tailwind CSS</option>
            <option value="Vue.js">Vue.js</option>
            <option value="Angular">Angular</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Backend
          </label>
          <select
            name="backend"
            value={techStack.backend}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Node.js with Express.js">Node.js with Express.js</option>
            <option value="Python with Flask">Python with Flask</option>
            <option value="Python with Django">Python with Django</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Database
          </label>
          <select
            name="database"
            value={techStack.database}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="MongoDB">MongoDB</option>
            <option value="PostgreSQL">PostgreSQL</option>
            <option value="MySQL">MySQL</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            AI
          </label>
          <select
            name="ai"
            value={techStack.ai}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Flowise AI">Flowise AI</option>
          </select>
        </div>
        
        <Button type="primary" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Code'}
        </Button>
      </form>
    </div>
  );
};

export default TechStackForm;