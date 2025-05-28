import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EntityCard from '../components/EntityCard';
import Loader from './LoadingSpinner';
import TechStackSelection from '../components/TechStackSelection';
import { useNavigate } from 'react-router-dom';

function EntityGenerationPage() {
  const navigate = useNavigate();
  const [entityData, setEntityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [refining, setRefining] = useState(false);
  const [error, setError] = useState('');
  const [selectedEntities, setSelectedEntities] = useState([]);
  const [showTechStack, setShowTechStack] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Custom entity form state
  const [showAddEntityForm, setShowAddEntityForm] = useState(false);
  const [customEntity, setCustomEntity] = useState({
    Entity_Name: '',
    Entity_Description: '',
    Fields: ['']
  });
  
  // Color Scheme (matching previous components)
  const colors = {
    primary: "#3B82F6",
    primaryDark: "#1D4ED8",
    primaryLight: "#93C5FD",
    secondary: "#10B981",
    secondaryDark: "#059669",
    secondaryLight: "#6EE7B7",
    background: "#F9FAFB",
    surface: "#FFFFFF",
    darkSurface: "#1F2937",
    textPrimary: "#111827",
    textSecondary: "#4B5563",
    textLight: "#9CA3AF",
    textOnDark: "#F3F4F6",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
    borderDefault: "#E5E7EB",
    borderFocus: "#93C5FD",
    borderDark: "#374151"
  };

  useEffect(() => {
    const fetchEntityData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/entity-data');

        if (response.data && Array.isArray(response.data.entities)) {
          setEntityData(response.data);
          // Initialize all entities as selected by default
          setSelectedEntities(response.data.entities.map((_, index) => index));
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
          })),
          Entity_Name: entity.Entity_Name,
          Entity_Description: entity.Entity_Description,
          Fields: entity.Fields
        }))
      } : null;

      setEntityData(transformedData);
      // Initialize all new entities as selected by default
      if (transformedData?.entities) {
        setSelectedEntities(transformedData.entities.map((_, index) => index));
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } catch (error) {
      console.error('Generation Error:', error);
      setError(error.message || 'Failed to generate entities');
    } finally {
      setGenerating(false);
    }
  };

  const handleRefineEntities = async () => {
    if (!entityData?.entities || entityData.entities.length === 0) {
      setError('No entities found to refine. Please generate entities first.');
      return;
    }

    setRefining(true);
    setError('');

    try {
      console.log('Sending refinement request...');
      const response = await axios.post('http://localhost:5000/api/refine-entities');
      
      console.log('Refinement response:', response.data);
      
      if (response.data.success && response.data.data) {
        const transformedData = {
          ...response.data.data,
          entities: response.data.data.entities.map(entity => ({
            name: entity.Entity_Name,
            description: entity.Entity_Description,
            fields: entity.Fields.map(fieldName => ({
              name: fieldName,
              type: 'string',
              description: ''
            })),
            Entity_Name: entity.Entity_Name,
            Entity_Description: entity.Entity_Description,
            Fields: entity.Fields
          }))
        };

        setEntityData(transformedData);
        // Initialize all refined entities as selected by default
        setSelectedEntities(transformedData.entities.map((_, index) => index));
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        throw new Error(response.data.error || 'Invalid response from server');
      }
    } catch (error) {
      console.error('Refinement Error:', error);
      
      let errorMessage = 'Failed to refine entities';
      
      if (error.response) {
        // Server responded with error status
        const serverError = error.response.data;
        if (serverError.error) {
          errorMessage = serverError.error;
          if (serverError.details) {
            errorMessage += `: ${serverError.details}`;
          }
        } else {
          errorMessage = `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check if the server is running.';
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setRefining(false);
    }
  };

  const handleAddCustomEntity = () => {
    if (!customEntity.Entity_Name.trim() || !customEntity.Entity_Description.trim()) {
      setError('Please provide entity name and description');
      return;
    }

    const filteredFields = customEntity.Fields.filter(field => field.trim() !== '');
    if (filteredFields.length === 0) {
      setError('Please provide at least one field');
      return;
    }

    const newEntity = {
      Entity_Name: customEntity.Entity_Name.trim(),
      Entity_Description: customEntity.Entity_Description.trim(),
      Fields: filteredFields,
      name: customEntity.Entity_Name.trim(),
      description: customEntity.Entity_Description.trim(),
      fields: filteredFields.map(fieldName => ({
        name: fieldName,
        type: 'string',
        description: ''
      })),
      isCustom: true
    };

    const updatedEntityData = {
      ...entityData,
      entities: [...(entityData?.entities || []), newEntity]
    };

    setEntityData(updatedEntityData);
    
    // Auto-select the new entity
    const newEntityIndex = updatedEntityData.entities.length - 1;
    setSelectedEntities(prev => [...prev, newEntityIndex]);
    
    // Reset form
    setCustomEntity({
      Entity_Name: '',
      Entity_Description: '',
      Fields: ['']
    });
    setShowAddEntityForm(false);
    setError('');
  };

  const handleCustomFieldChange = (index, value) => {
    const updatedFields = [...customEntity.Fields];
    updatedFields[index] = value;
    setCustomEntity(prev => ({ ...prev, Fields: updatedFields }));
  };

  const addCustomField = () => {
    setCustomEntity(prev => ({ ...prev, Fields: [...prev.Fields, ''] }));
  };

  const removeCustomField = (index) => {
    if (customEntity.Fields.length > 1) {
      const updatedFields = customEntity.Fields.filter((_, i) => i !== index);
      setCustomEntity(prev => ({ ...prev, Fields: updatedFields }));
    }
  };

  const toggleEntitySelection = (index) => {
    setSelectedEntities(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleTechStackSubmit = async (techStack) => {
    try {
      // Prepare the final project data with only selected entities
      const selectedEntitiesData = selectedEntities.map(index => {
        const entity = entityData.entities[index];
        return {
          Entity_Name: entity.Entity_Name || entity.name,
          Entity_Description: entity.Entity_Description || entity.description,
          Fields: entity.Fields || entity.fields.map(f => f.name || f)
        };
      });

      const projectData = {
        project_name: entityData.project_name,
        project_description: entityData.project_description,
        entities: selectedEntitiesData,
        stack: techStack
      };

      // Save the project data with only selected entities
      await axios.post('http://localhost:5000/api/save-final-entities', {
        project_name: entityData.project_name,
        project_description: entityData.project_description,
        entities: selectedEntitiesData
      });

      // Send to Flowise API
      const formData = new FormData();
      formData.append('files', new Blob([JSON.stringify(projectData)], { type: 'application/json' }), 'tech_stack.json');

      const flowiseResponse = await fetch(
        "http://localhost:3000/api/v1/prediction/342522aa-c0e8-48d3-9f56-ac90a04376ea",
        {
          method: "POST",
          body: formData
        }
      );

      const result = await flowiseResponse.json();
      console.log('Flowise response:', result);

      // Success message and navigate after a delay
      setError('');
      navigate('/code-preview');
    } catch (error) {
      console.error('Error saving project:', error);
      setError(error.message || 'Failed to save project configuration');
    }
  };

  const handleProceedToTechStack = async () => {
    if (selectedEntities.length === 0) {
      setError('Please select at least one entity to proceed');
      return;
    }
  
    try {
      // Prepare the selected entities data for final_entities.json format
      const selectedEntitiesData = selectedEntities.map(index => {
        const entity = entityData.entities[index];
        return {
          entity_name: entity.name || entity.Entity_Name,
          entity_description: entity.description || entity.Entity_Description,
          fields: entity.fields 
            ? entity.fields.map(field => field.name || field)
            : entity.Fields || []
        };
      });
  
      // Save the selected entities in final_entities.json format
      await axios.post('http://localhost:5000/api/save-final-entities', {
        project_name: entityData.project_name,
        project_description: entityData.project_description,
        entities: selectedEntitiesData
      });
  
      // Navigate to the tech stack selection page
      navigate('/tech-stack-selection');
    } catch (error) {
      console.error('Error saving selected entities:', error);
      setError('Failed to save selected entities. Please try again.');
    }
  };

  const filteredEntities = entityData?.entities?.filter(entity => {
    const searchLower = searchTerm.toLowerCase();
    const name = (entity.name || entity.Entity_Name || '').toLowerCase();
    const description = (entity.description || entity.Entity_Description || '').toLowerCase();
    
    return name.includes(searchLower) || description.includes(searchLower);
  });

  const handleSelectAll = () => {
    if (filteredEntities && filteredEntities.length > 0) {
      if (selectedEntities.length === entityData.entities.length) {
        // If all are selected, deselect all
        setSelectedEntities([]);
      } else {
        // Otherwise, select all
        setSelectedEntities(entityData.entities.map((_, index) => index));
      }
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: colors.background }}
      >
        <Loader text="Loading entity data..." />
      </div>
    );
  }

  if (showTechStack) {
    return (
      <TechStackSelection
        onBack={() => setShowTechStack(false)}
        onSubmit={handleTechStackSubmit}
        colors={colors}
      />
    );
  }

  return (
    <div 
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans"
      style={{ 
        fontFamily: "'Inter', sans-serif",
        background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.primaryLight}20 100%)`,
        color: colors.textPrimary 
      }}
    >
      {/* Progress tracker */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div 
              className="flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm"
              style={{ backgroundColor: colors.success }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <span className="text-sm font-medium">Project Setup</span>
            </div>
          </div>
          <div 
            className="flex-grow h-0.5 mx-4"
            style={{ backgroundColor: colors.primary }}
          ></div>
          <div className="flex items-center">
            <div 
              className="flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm"
              style={{ backgroundColor: colors.primary }}
            >
              2
            </div>
            <div className="ml-3">
              <span className="text-sm font-medium">Entity Generation</span>
            </div>
          </div>
          <div 
            className="flex-grow h-0.5 mx-4"
            style={{ backgroundColor: `${colors.textLight}40` }}
          ></div>
          <div className="flex items-center">
            <div 
              className="flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm"
              style={{ backgroundColor: `${colors.textLight}40` }}
            >
              3
            </div>
            <div className="ml-3">
              <span className="text-sm font-medium" style={{ color: colors.textLight }}>Tech Stack</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 
            className="text-3xl font-bold sm:text-4xl"
            style={{ color: colors.textPrimary }}
          >
            Entity Generation
          </h1>
          <p 
            className="mt-3 text-xl"
            style={{ color: colors.textSecondary }}
          >
            AI-generated database entities for your project
          </p>
        </div>

        {error && (
          <div 
            className="mb-6 p-4 rounded-lg border flex items-start animate-bounce-once"
            style={{ 
              backgroundColor: `${colors.error}10`, 
              borderColor: `${colors.error}30` 
            }}
          >
            <div className="flex-shrink-0">
              <svg 
                className="h-5 w-5" 
                style={{ color: colors.error }}
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm" style={{ color: colors.error }}>{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="ml-auto"
              style={{ color: colors.error }}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        <div 
          className="shadow overflow-hidden sm:rounded-lg transition-shadow duration-300 hover:shadow-lg"
          style={{ 
            backgroundColor: colors.surface,
            borderColor: colors.borderDefault,
            boxShadow: `0 10px 15px -3px ${colors.primary}15, 0 4px 6px -2px ${colors.primary}10`
          }}
        >
          <div 
            className="px-4 py-5 sm:px-6 border-b"
            style={{ borderColor: colors.borderDefault }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <h2 
                  className="text-lg leading-6 font-medium"
                  style={{ color: colors.textPrimary }}
                >
                  {entityData?.project_name || 'Untitled Project'}
                </h2>
                <p 
                  className="mt-1 max-w-2xl text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  {entityData?.project_description || 'No description available'}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleGenerateEntities}
                  disabled={generating || refining}
                  className="inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed transform hover:translate-y-px"
                  style={{ 
                    color: colors.surface,
                    backgroundColor: colors.primary,
                    borderColor: 'transparent',
                    boxShadow: `0 2px 5px -1px ${colors.primary}30`
                  }}
                  onMouseOver={!generating && !refining ? (e) => {
                    e.currentTarget.style.backgroundColor = colors.primaryDark;
                  } : undefined}
                  onMouseOut={!generating && !refining ? (e) => {
                    e.currentTarget.style.backgroundColor = colors.primary;
                  } : undefined}
                >
                  {generating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      {entityData?.entities?.length > 0 ? 'Regenerate Entities' : 'Generate Entities'}
                    </>
                  )}
                </button>
                
                {entityData?.entities?.length > 0 && (
                  <button
                    onClick={handleRefineEntities}
                    disabled={generating || refining}
                    className="inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed transform hover:translate-y-px"
                    style={{
                      color: colors.surface,
                      backgroundColor: colors.info,
                      borderColor: 'transparent',
                      boxShadow: `0 2px 5px -1px ${colors.info}30`
                    }}
                    onMouseOver={!generating && !refining ? (e) => {
                      e.currentTarget.style.backgroundColor = `${colors.info}DD`;
                    } : undefined}
                    onMouseOut={!generating && !refining ? (e) => {
                      e.currentTarget.style.backgroundColor = colors.info;
                    } : undefined}
                  >
                    {refining ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Refining...
                      </>
                    ) : (
                      <>
                        <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                          <path d="M232 120c0-13.255 10.745-24 24-24s24 10.745 24 24v48h40v-48c0-13.255 10.745-24 24-24s24 10.745 24 24v48h24c13.255 0 24 10.745 24 24s-10.745 24-24 24h-24v48c0 13.255-10.745 24-24 24s-24-10.745-24-24v-48h-40v48c0 13.255-10.745 24-24 24s-24-10.745-24-24v-48h-40v48c0 13.255-10.745 24-24 24s-24-10.745-24-24v-48h-24c-13.255 0-24-10.745-24-24s10.745-24 24-24h24v-48c0-13.255 10.745-24 24-24s24 10.745 24 24v48h40v-48zM80 344c0-13.255 10.745-24 24-24h304c13.255 0 24 10.745 24 24s-10.745 24-24 24H104c-13.255 0-24-10.745-24-24zm56 72c0-13.255 10.745-24 24-24h192c13.255 0 24 10.745 24 24 0 66.274-53.726 120-120 120s-120-53.726-120-120z" />
                          <circle cx="64" cy="120" r="16" fill="currentColor" />
                          <circle cx="128" cy="80" r="16" fill="currentColor" />
                          <circle cx="192" cy="40" r="16" fill="currentColor" />
                          <circle cx="256" cy="24" r="16" fill="currentColor" />
                          <circle cx="320" cy="40" r="16" fill="currentColor" />
                          <circle cx="384" cy="80" r="16" fill="currentColor" />
                          <circle cx="448" cy="120" r="16" fill="currentColor" />
                        </svg>
                        Refine Entities
                      </>
                    )}
                  </button>
                )}
                
                <button
                  onClick={() => setShowAddEntityForm(true)}
                  disabled={generating || refining}
                  className="inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed transform hover:translate-y-px"
                  style={{ 
                    color: colors.surface,
                    backgroundColor: colors.warning,
                    borderColor: 'transparent',
                    boxShadow: `0 2px 5px -1px ${colors.warning}30`
                  }}
                  onMouseOver={!generating && !refining ? (e) => {
                    e.currentTarget.style.backgroundColor = `${colors.warning}DD`;
                  } : undefined}
                  onMouseOut={!generating && !refining ? (e) => {
                    e.currentTarget.style.backgroundColor = colors.warning;
                  } : undefined}
                >
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Custom Entity
                </button>
              </div>
            </div>
          </div>

          {/* Custom Entity Form Modal */}
          {showAddEntityForm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
                    Add Custom Entity
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Entity Name</label>
                      <input
                        type="text"
                        value={customEntity.Entity_Name}
                        onChange={(e) => setCustomEntity(prev => ({ ...prev, Entity_Name: e.target.value }))}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g., User"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Entity Description</label>
                      <textarea
                        value={customEntity.Entity_Description}
                        onChange={(e) => setCustomEntity(prev => ({ ...prev, Entity_Description: e.target.value }))}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        rows="3"
                        placeholder="Describe what this entity represents..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fields</label>
                      {customEntity.Fields.map((field, index) => (
                        <div key={index} className="flex mt-2">
                          <input
                            type="text"
                            value={field}
                            onChange={(e) => handleCustomFieldChange(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder={`Field ${index + 1}`}
                          />
                          {customEntity.Fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeCustomField(index)}
                              className="ml-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                              −
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addCustomField}
                        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                      >
                        + Add Field
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => {
                        setShowAddEntityForm(false);
                        setCustomEntity({ Entity_Name: '', Entity_Description: '', Fields: [''] });
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddCustomEntity}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Add Entity
                   </button>
                 </div>
               </div>
             </div>
           </div>
         )}

         {entityData?.entities?.length > 0 && (
           <div className="px-4 py-5 sm:px-6 border-b" style={{ borderColor: colors.borderDefault }}>
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
               <div className="flex-grow">
                 <div className="relative">
                   <div 
                     className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                     style={{ color: colors.textLight }}
                   >
                     <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                     </svg>
                   </div>
                   <input
                     type="text"
                     placeholder="Search entities..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="block w-full pl-10 pr-3 py-2 rounded-md transition-all duration-200"
                     style={{ 
                       backgroundColor: `${colors.background}`,
                       borderColor: colors.borderDefault,
                       color: colors.textPrimary
                     }}
                     onFocus={(e) => {
                       e.target.style.boxShadow = `0 0 0 3px ${colors.primary}30`;
                       e.target.style.borderColor = colors.primary;
                     }}
                     onBlur={(e) => {
                       e.target.style.boxShadow = 'none';
                       e.target.style.borderColor = colors.borderDefault;
                     }}
                   />
                 </div>
               </div>
               <div className="flex items-center gap-2">
                 <button
                   onClick={handleSelectAll}
                   className="inline-flex items-center text-sm font-medium px-3 py-1 rounded transition-colors duration-200"
                   style={{ 
                     backgroundColor: `${colors.primary}10`,
                     color: colors.primary
                   }}
                   onMouseOver={(e) => {
                     e.currentTarget.style.backgroundColor = `${colors.primary}20`;
                   }}
                   onMouseOut={(e) => {
                     e.currentTarget.style.backgroundColor = `${colors.primary}10`;
                   }}
                 >
                   {selectedEntities.length === entityData.entities.length 
                     ? 'Deselect All' 
                     : 'Select All'}
                 </button>
                 <div 
                   className="text-sm"
                   style={{ color: colors.textSecondary }}
                 >
                   {selectedEntities.length} of {entityData.entities.length} selected
                 </div>
               </div>
             </div>
           </div>
         )}

         <div className="px-4 py-5 sm:p-6">
           {entityData?.entities?.length > 0 ? (
             <>
               {filteredEntities.length > 0 ? (
                 <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                   {filteredEntities.map((entity, index) => {
                     const originalIndex = entityData.entities.indexOf(entity);
                     return (
                       <EntityCard 
                         key={originalIndex} 
                         entity={entity} 
                         selected={selectedEntities.includes(originalIndex)}
                         onToggleSelection={toggleEntitySelection}
                         index={originalIndex}
                         colors={colors}
                       />
                     );
                   })}
                 </div>
               ) : (
                 <div 
                   className="text-center py-12 rounded-lg"
                   style={{ backgroundColor: `${colors.background}50` }}
                 >
                   <svg 
                     className="mx-auto h-12 w-12" 
                     style={{ color: colors.textLight }}
                     fill="none" 
                     stroke="currentColor" 
                     viewBox="0 0 24 24"
                   >
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                   <h3 
                     className="mt-2 text-sm font-medium"
                     style={{ color: colors.textPrimary }}
                   >
                     No matching entities
                   </h3>
                   <p 
                     className="mt-1 text-sm"
                     style={{ color: colors.textSecondary }}
                   >
                     Try adjusting your search term or clear it to see all entities.
                   </p>
                   <div className="mt-6">
                     <button
                       onClick={() => setSearchTerm('')}
                       className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm"
                       style={{ 
                         backgroundColor: colors.surface,
                         color: colors.primary,
                         borderColor: colors.borderDefault
                       }}
                     >
                       Clear Search
                     </button>
                   </div>
                 </div>
               )}
             </>
           ) : (
             <div 
               className="text-center py-12 rounded-lg bg-white"
               style={{ backgroundColor: colors.surface }}
             >
               <svg 
                 className="mx-auto h-12 w-12" 
                 style={{ color: colors.textLight }}
                 fill="none" 
                 stroke="currentColor" 
                 viewBox="0 0 24 24"
               >
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
               </svg>
               <h3 
                 className="mt-2 text-sm font-medium"
                 style={{ color: colors.textPrimary }}
               >
                 No entities yet
               </h3>
               <p 
                 className="mt-1 text-sm max-w-md mx-auto"
                 style={{ color: colors.textSecondary }}
               >
                 Get started by generating entities or adding custom ones based on your project description.
               </p>
               <div className="mt-6 flex gap-3 justify-center">
                 <button
                   onClick={handleGenerateEntities}
                   disabled={generating || refining}
                   className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-all duration-300 transform hover:translate-y-px disabled:opacity-75 disabled:cursor-not-allowed"
                   style={{ 
                     backgroundColor: colors.primary,
                     color: colors.surface
                   }}
                   onMouseOver={!generating && !refining ? (e) => {
                     e.currentTarget.style.backgroundColor = colors.primaryDark;
                   } : undefined}
                   onMouseOut={!generating && !refining ? (e) => {
                     e.currentTarget.style.backgroundColor = colors.primary;
                   } : undefined}
                 >
                   {generating ? (
                     <>
                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                       Generating...
                     </>
                   ) : (
                     <>
                       <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                       </svg>
                       Generate Entities
                     </>
                   )}
                 </button>
                 <button
                   onClick={() => setShowAddEntityForm(true)}
                   disabled={generating || refining}
                   className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-all duration-300 transform hover:translate-y-px disabled:opacity-75 disabled:cursor-not-allowed"
                   style={{ 
                     backgroundColor: colors.warning,
                     color: colors.surface
                   }}
                   onMouseOver={!generating && !refining ? (e) => {
                     e.currentTarget.style.backgroundColor = `${colors.warning}DD`;
                   } : undefined}
                   onMouseOut={!generating && !refining ? (e) => {
                     e.currentTarget.style.backgroundColor = colors.warning;
                   } : undefined}
                 >
                   <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                   </svg>
                   Add Custom Entity
                 </button>
               </div>
             </div>
           )}
         </div>
       </div>

       {entityData?.entities?.length > 0 && (
         <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
           <button 
             onClick={() => navigate('/project-startup')} 
             className="mb-4 sm:mb-0 inline-flex items-center text-sm font-medium transition-colors duration-200"
             style={{ color: colors.primary }}
             onMouseOver={(e) => {
               e.currentTarget.style.color = colors.primaryDark;
             }}
             onMouseOut={(e) => {
               e.currentTarget.style.color = colors.primary;
             }}
           >
             <svg className="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
               <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
             </svg>
             Back to Project Setup
           </button>

           <button
             onClick={handleProceedToTechStack}
             disabled={selectedEntities.length === 0}
             className="inline-flex items-center justify-center px-6 py-3 border text-base font-medium rounded-lg shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:translate-y-px"
             style={{ 
               color: colors.surface,
               backgroundColor: colors.secondary,
               borderColor: 'transparent',
               boxShadow: `0 4px 6px -1px ${colors.secondary}30, 0 2px 4px -1px ${colors.secondary}20`
             }}
             onMouseOver={selectedEntities.length > 0 ? (e) => {
               e.currentTarget.style.backgroundColor = colors.secondaryDark;
               e.currentTarget.style.boxShadow = `0 6px 8px -1px ${colors.secondary}40, 0 3px 6px -1px ${colors.secondary}30`;
             } : undefined}
             onMouseOut={selectedEntities.length > 0 ? (e) => {
               e.currentTarget.style.backgroundColor = colors.secondary;
               e.currentTarget.style.boxShadow = `0 4px 6px -1px ${colors.secondary}30, 0 2px 4px -1px ${colors.secondary}20`;
             } : undefined}
           >
             Proceed to Tech Stack Selection
             <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
               <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
             </svg>
           </button>
         </div>
       )}
     </div>

     {/* Floating help button */}
     <div 
       className="fixed bottom-4 right-4 p-3 rounded-full shadow-lg z-20 cursor-pointer transition-transform duration-300 hover:scale-110"
       style={{ 
         backgroundColor: colors.primary,
         color: colors.surface,
         boxShadow: `0 10px 15px -3px ${colors.primary}30, 0 4px 6px -2px ${colors.primary}20`
       }}
       onClick={() => {
         window.open('https://docs.flowiseai.com/entity-guide', '_blank');
       }}
     >
       <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
       </svg>
     </div>

     {/* Success confetti effect */}
     {showConfetti && (
       <div className="fixed inset-0 pointer-events-none z-50">
         <div className="absolute inset-0 flex items-center justify-center">
           <div className="confetti-container">
             {Array.from({ length: 100 }).map((_, index) => {
               const size = Math.random() * 10 + 5;
               const blur = Math.random() * 2;
               const x = (Math.random() - 0.5) * window.innerWidth;
               const y = (Math.random() - 0.5) * window.innerHeight;
               const rotation = Math.random() * 360;
               const duration = Math.random() * 3 + 2;
               const delay = Math.random() * 0.5;
               
               // Choose a random color from our color scheme
               const colorOptions = [
                 colors.primary,
                 colors.secondary,
                 colors.success,
                 colors.warning,
                 colors.info,
                 colors.primaryLight,
                 colors.secondaryLight
               ];
               const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
               
               return (
                 <div
                   key={index}
                   className="absolute"
                   style={{
                     width: `${size}px`,
                     height: `${size}px`,
                     backgroundColor: color,
                     borderRadius: Math.random() > 0.5 ? '50%' : '0',
                     filter: `blur(${blur}px)`,
                     transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
                     opacity: 0,
                     animation: `confetti ${duration}s ease-out ${delay}s forwards`
                   }}
                 />
               );
             })}
           </div>
         </div>
       </div>
     )}

     {/* Add a style tag for the confetti animation */}
     <style jsx>{`
       @keyframes confetti {
         0% {
           transform: translate(0, 0) rotate(0deg);
           opacity: 0;
         }
         10% {
           opacity: 1;
         }
         100% {
           transform: translate(var(--x, 100px), calc(var(--y, 100px) + 500px)) rotate(calc(var(--r, 0) + 360deg));
           opacity: 0;
         }
       }
     `}</style>
   </div>
 );
}

export default EntityGenerationPage;