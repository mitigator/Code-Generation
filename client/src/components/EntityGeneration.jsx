import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EntityCard from '../components/EntityCard';
import Loader from './LoadingSpinner';

function EntityGenerationPage() {
  const [entityData, setEntityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Try to fetch existing entity data
    axios.get('http://localhost:5000/api/entity-data')
      .then(response => {
        console.log('Fetched entity data:', response.data); 
        setEntityData(response.data);
        setLoading(false);
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          // No entity data exists yet, set loading to false
          setLoading(false);
        } else {
          console.error('Error fetching entity data:', error);
          setError('Failed to fetch entity data');
          setLoading(false);
        }
      });
  }, []);

  const handleGenerateEntities = async () => {
    setGenerating(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/generate-entities');
      setEntityData(response.data.data);
    } catch (error) {
      console.error('Error generating entities:', error);
      setError('Failed to generate entities. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <Loader text="Loading entity data..." />
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-3">Entity Generation</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {!entityData && !generating ? (
        <div className="entity-generation-prompt">
          <p>No entities have been generated yet. Would you like to generate entities based on your project description?</p>
          <button 
            className="btn btn-primary"
            onClick={handleGenerateEntities}
          >
            Generate Entities
          </button>
        </div>
      ) : generating ? (
        <Loader text="Generating entities based on your project description..." />
      ) : (
        <div className="entity-results">
          <div className="project-info">
            <h2>{entityData.project_name}</h2>
            <p>{entityData.project_description}</p>
          </div>
          
          <h3 className="entities-heading">Generated Entities</h3>
          
          {entityData.entities.length > 0 ? (
            <div className="entities-container">
              {entityData.entities.map((entity, index) => (
                <EntityCard key={index} entity={entity} />
              ))}
            </div>
          ) : (
            <p>No entities were generated. Try updating your project description for better results.</p>
          )}
          
          <div className="actions-container">
            <button 
              className="btn btn-secondary"
              onClick={handleGenerateEntities}
              disabled={generating}
            >
              Regenerate Entities
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EntityGenerationPage;