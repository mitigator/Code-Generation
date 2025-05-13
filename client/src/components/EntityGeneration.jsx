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
        
        if (response.data && Array.isArray(response.data.entities)) {
          setEntityData(response.data);
        } else {
          throw new Error('Invalid data structure from API');
        }
      } catch (error) {
        console.error('Fetch Error:', error);
        setError(error.response?.status === 404 
          ? 'No existing entities found' 
          : error.message || 'Failed to fetch entities');
      } finally {
        setLoading(false);
      }
    };

    fetchEntityData();
  }, []);

  const handleGenerateEntities = async () => {
    setGenerating(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/generate-entities');
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader text="Loading entity data..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Entity Generation
          </h1>
          <p className="mt-3 text-xl text-gray-600">
            AI-generated database entities for your project
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button 
                onClick={() => setError('')}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  {entityData?.project_name || 'Untitled Project'}
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {entityData?.project_description || 'No description available'}
                </p>
              </div>
              <button
                onClick={handleGenerateEntities}
                disabled={generating}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : entityData ? 'Regenerate Entities' : 'Generate Entities'}
              </button>
            </div>
          </div>

          <div className="px-4 py-5 sm:p-6">
            {entityData?.entities?.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {entityData.entities.map((entity, index) => (
                  <EntityCard key={index} entity={entity} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No entities</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by generating your first set of entities.
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleGenerateEntities}
                    disabled={generating}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {generating ? 'Generating...' : 'Generate Entities'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EntityGenerationPage;