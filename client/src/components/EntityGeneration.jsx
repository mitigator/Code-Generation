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
    const fetchEntityData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/entity-data');
        console.log('API Response:', response.data);
        
        // Validate response structure
        if (response.data && Array.isArray(response.data.entities)) {
          setEntityData(response.data);
        } else {
          throw new Error('Invalid data structure from API');
        }
      } catch (error) {
        console.error('Fetch Error:', error);
        if (error.response?.status === 404) {
          setError('No existing entities found');
        } else {
          setError(error.message || 'Failed to fetch entities');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEntityData();
  }, []);

  // In your EntityGenerationPage.js
const handleGenerateEntities = async () => {
  setGenerating(true);
  setError('');
  
  try {
    const response = await axios.post('http://localhost:5000/api/generate-entities');
    console.log('Generation Response:', response.data);
    
    // Transform the data in the frontend
    const transformedData = response.data.data ? {
      ...response.data.data,
      entities: response.data.data.entities.map(entity => ({
        name: entity.Entity_Name,
        description: entity.Entity_Description,
        fields: entity.Fields.map(fieldName => ({
          name: fieldName,
          type: 'string',
          description: ''
        }))
      }))
    } : null;
    
    setEntityData(transformedData);
  } catch (error) {
    console.error('Generation Error:', error);
    setError(error.message || 'Failed to generate entities');
  } finally {
    setGenerating(false);
  }
};

  if (loading) {
    return <Loader text="Loading entity data..." />;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-3">Entity Generation</h1>
      
      {error && (
        <div className="alert alert-danger">
          {error}
          <button className="btn btn-sm btn-link" onClick={() => setError('')}>
            Dismiss
          </button>
        </div>
      )}
      
      <div className="card">
        <div className="card-body">
          {!entityData ? (
            <div className="text-center py-4">
              <p>No entities available. Generate your first set of entities.</p>
              <button 
                className="btn btn-primary"
                onClick={handleGenerateEntities}
                disabled={generating}
              >
                {generating ? 'Generating...' : 'Generate Entities'}
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h2>{entityData.project_name || 'Untitled Project'}</h2>
                <p className="text-muted">
                  {entityData.project_description || 'No description available'}
                </p>
              </div>
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Entities</h3>
                <button
                  className="btn btn-outline-secondary"
                  onClick={handleGenerateEntities}
                  disabled={generating}
                >
                  {generating ? 'Regenerating...' : 'Regenerate'}
                </button>
              </div>
              
              {entityData.entities?.length > 0 ? (
                <div className="row">
                  {entityData.entities.map((entity, index) => (
                    <div key={index} className="col-md-6 col-lg-4 mb-4">
                      <EntityCard entity={entity} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="alert alert-info">
                  No entities generated. Try regenerating with more detailed project information.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EntityGenerationPage;