// src/components/project/ProjectForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../../services/projectService';
import { useProject } from '../../context/ProjectContext';
import Button from '../common/Button';
import Input from '../common/Input';

const ProjectForm = () => {
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { refreshProjects } = useProject();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const newProject = await createProject({ project_name: projectName });
      
      await refreshProjects();
      navigate(`/projects/${newProject._id}`);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDescription = async () => {
    // This will be handled by the backend as part of create project
    // The function is here for UI purposes
    if (!projectName) {
      setError('Please enter a project name first');
      return;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <Input
          label="Project Name"
          name="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
          required
        />
        
        <div className="flex space-x-4 mt-6">
          <Button type="primary" disabled={loading || !projectName}>
            {loading ? 'Creating...' : 'Create Project'}
          </Button>
          
          <Button 
            type="secondary" 
            onClick={handleGenerateDescription}
            disabled={loading || !projectName}
          >
            Generate Description
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;