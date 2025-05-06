import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import { processDescription } from '../utils/api';

function DescriptionPage() {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [refinedDescription, setRefinedDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateDescription = async () => {
    if (!projectName || !projectDescription) {
      alert('Please enter both project name and description');
      return;
    }

    setLoading(true);
    try {
      const result = await processDescription(projectName, projectDescription, 'generate');
      setRefinedDescription(result.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert('Error generating description. Please try again.');
    }
  };

  const handleNext = () => {
    // Save the project data to session storage
    const projectData = {
      project_name: projectName,
      project_description: refinedDescription || projectDescription
    };
    sessionStorage.setItem('projectData', JSON.stringify(projectData));
    navigate('/entity-generation');
  };

  return (
    <div className="card">
      <Header title="Project Description" />
      
      <div>
        <label htmlFor="projectName">Project Name:</label>
        <input
          type="text"
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
        />
      </div>
      
      <div>
        <label htmlFor="projectDescription">Project Description:</label>
        <textarea
          id="projectDescription"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          rows="6"
          placeholder="Enter project description"
        ></textarea>
      </div>
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <button onClick={handleGenerateDescription}>Generate/Refine Description</button>
          <button 
            onClick={handleNext}
            disabled={!projectName}
            style={{ marginLeft: '10px' }}
            className="secondary"
          >
            Next
          </button>
        </>
      )}
      
      {refinedDescription && (
        <div style={{ marginTop: '20px' }}>
          <h3>Refined Description:</h3>
          <div className="card" style={{ backgroundColor: '#f0f8ff' }}>
            <p>{refinedDescription}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DescriptionPage;