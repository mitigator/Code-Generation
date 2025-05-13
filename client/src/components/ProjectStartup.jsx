import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from './LoadingSpinner';

function ProjectStartupPage() {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to load existing data if available
    axios.get('http://localhost:5000/api/entity-data')
      .then(response => {
        // If entity data exists, pre-fill the form
        setProjectName(response.data.project_name);
        setProjectDescription(response.data.project_description);
      })
      .catch(() => {
        // No existing data or error, continue with empty form
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleGenerate = async () => {
    if (!projectName || !projectDescription) {
      setError('Please fill in both fields');
      return;
    }
    
    setError('');
    setIsGenerating(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/description-generation', {
        project_name: projectName,
        project_description: projectDescription
      });
      
      // Update the description with the generated text
      setProjectDescription(response.data.text);
    } catch (error) {
      console.error('Error generating description:', error);
      setError('Failed to generate description. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAndNext = async () => {
    if (!projectName || !projectDescription) {
      setError('Please fill in both fields');
      return;
    }
    
    setError('');
    setIsSaving(true);
    
    try {
      await axios.post('http://localhost:5000/api/save-project', {
        project_name: projectName,
        project_description: projectDescription
      });
      
      // Navigate to the next page
      navigate('/entity-generation');
    } catch (error) {
      console.error('Error saving project:', error);
      setError('Failed to save project. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-5">
        <Loader text="Loading project data..." />
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-3">Project Startup</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="projectName">Project Name</label>
        <input
          type="text"
          className="form-control"
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="projectDescription">Project Description</label>
        <textarea
          className="form-control"
          id="projectDescription"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          placeholder="Enter project description"
          rows="5"
        ></textarea>
      </div>
      
      <div className="btn-container">
        <button 
          className="btn btn-secondary"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Description Generation/Refinement'}
          {isGenerating && <span className="loading"></span>}
        </button>
        
        <button 
          className="btn btn-primary"
          onClick={handleSaveAndNext}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save and Next Step'}
          {isSaving && <span className="loading"></span>}
        </button>
      </div>
    </div>
  );
}

export default ProjectStartupPage;