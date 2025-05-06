import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import EntityDisplay from '../components/EntityDisplay';
import { generateEntities } from '../utils/api';

function EntityGenerationPage() {
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null);
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve project data from session storage
    const storedData = sessionStorage.getItem('projectData');
    if (!storedData) {
      alert('No project data found. Please start from the beginning.');
      navigate('/description');
      return;
    }

    const parsedData = JSON.parse(storedData);
    setProjectData(parsedData);
    
    // Automatically generate entities when the component mounts
    handleGenerateEntities(parsedData);
  }, [navigate]);

  const handleGenerateEntities = async (data) => {
    setLoading(true);
    try {
      const result = await generateEntities(data || projectData);
      setEntities(result.data);
      
      // Store the entities in session storage for refinement
      sessionStorage.setItem('generatedEntities', JSON.stringify(result.data));
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert('Error generating entities. Please try again.');
    }
  };

  const handleRefinement = () => {
    navigate('/entity-refinement');
  };

  if (!projectData && !loading) {
    return (
      <div className="card">
        <Header title="Entity Generation" />
        <p>No project data available. Please go back to the description page.</p>
        <button onClick={() => navigate('/description')}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="card">
      <Header title="Entity Generation" />
      
      {projectData && (
        <div>
          <h3>Project Information:</h3>
          <p><strong>Name:</strong> {projectData.project_name}</p>
          <p><strong>Description:</strong> {projectData.project_description}</p>
        </div>
      )}
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div style={{ marginTop: '20px' }}>
            <EntityDisplay entities={entities} />
          </div>
          
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => handleGenerateEntities()}>Regenerate Entities</button>
            <button onClick={handleRefinement} className="secondary">Refine Entities</button>
          </div>
        </>
      )}
    </div>
  );
}

export default EntityGenerationPage;