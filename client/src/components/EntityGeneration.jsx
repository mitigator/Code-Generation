import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EntityCard from '../components/EntityCard';
import Loader from './LoadingSpinner';
import TechStackSelection from '../components/TechStackSelection';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../services/ThemeContext';
import { themes } from '../assets/template';

function EntityGenerationPage() {
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const [entityData, setEntityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [refining, setRefining] = useState(false);
  const [error, setError] = useState('');
  const [selectedEntities, setSelectedEntities] = useState([]);
  const [rejectedEntities, setRejectedEntities] = useState([]);
  const [showTechStack, setShowTechStack] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Initializing...');
  const [showRejectedSection, setShowRejectedSection] = useState(false);
  
  // Custom entity form state
  const [showAddEntityForm, setShowAddEntityForm] = useState(false);
  const [customEntity, setCustomEntity] = useState({
    Entity_Name: '',
    Entity_Description: '',
    Fields: ['']
  });
  
  // Get current theme colors
  const colors = themes[currentTheme].colors;

  // Helper function to introduce delay
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Enhanced fetch with retry logic
  const fetchWithRetry = async (url, options = {}, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await axios(url, options);
        return response;
      } catch (error) {
        console.log(`Attempt ${attempt} failed:`, error.message);
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        const waitTime = Math.pow(2, attempt) * 1000;
        setLoadingMessage(`Connection failed. Retrying in ${waitTime/1000}s... (${attempt}/${maxRetries})`);
        await delay(waitTime);
      }
    }
  };

  // Generate entities with retry logic
  const generateEntitiesWithRetry = async (maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        setLoadingMessage(`Generating entities... (Attempt ${attempt}/${maxRetries})`);
        
        const response = await axios.post('http://localhost:5000/api/generate-entities', {}, {
          timeout: 30000 // 30 second timeout
        });
        
        return response;
      } catch (error) {
        console.log(`Generation attempt ${attempt} failed:`, error.message);
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Wait before retrying
        const waitTime = Math.pow(2, attempt) * 1000;
        setLoadingMessage(`Generation failed. Retrying in ${waitTime/1000}s... (${attempt}/${maxRetries})`);
        await delay(waitTime);
      }
    }
  };

  // Main initialization function
  useEffect(() => {
    let isMounted = true;

    const initializePage = async () => {
      try {
        setInitializing(true);
        setLoading(true);
        setLoadingMessage('Checking for existing entities...');
        
        // First, try to fetch existing entity data
        try {
          const response = await fetchWithRetry({
            method: 'GET',
            url: 'http://localhost:5000/api/entity-data',
            timeout: 10000
          });
          
          if (response.data && Array.isArray(response.data.entities) && response.data.entities.length > 0) {
            if (isMounted) {
              setLoadingMessage('Loading existing entities...');
              await delay(500); // Small delay for better UX
              
              setEntityData(response.data);
              setSelectedEntities(response.data.entities.map((_, index) => index));
              setRejectedEntities([]);
              setInitializing(false);
              setLoading(false);
              return;
            }
          }
        } catch (fetchError) {
          console.log('No existing entities found, will generate new ones');
          setLoadingMessage('No existing entities found. Generating new ones...');
        }

        // If no existing data or fetch failed, generate entities
        if (isMounted) {
          const generateResponse = await generateEntitiesWithRetry();
          
          if (generateResponse.data?.data) {
            const transformedData = {
              ...generateResponse.data.data,
              entities: generateResponse.data.data.entities.map(entity => ({
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

            if (isMounted) {
              setLoadingMessage('Finalizing entities...');
              await delay(500);
              
              setEntityData(transformedData);
              setSelectedEntities(transformedData.entities.map((_, index) => index));
              setRejectedEntities([]);
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 3000);
            }
          } else {
            throw new Error('Invalid response structure from generation API');
          }
        }
      } catch (error) {
        console.error('Initialization Error:', error);
        
        if (isMounted) {
          // Instead of showing error immediately, try one more time after a longer delay
          if (retryCount < 2) {
            setRetryCount(prev => prev + 1);
            setLoadingMessage(`Initialization failed. Retrying in 5 seconds... (${retryCount + 1}/3)`);
            await delay(5000);
            
            if (isMounted) {
              // Recursive retry
              initializePage();
              return;
            }
          }
          
          // Final failure - redirect back to project setup
          setLoadingMessage('Failed to initialize. Redirecting to project setup...');
          await delay(2000);
          
          if (isMounted) {
            navigate('/project-startup', { 
              state: { 
                error: 'Failed to load entity generation. Please try again.' 
              }
            });
          }
        }
      } finally {
        if (isMounted) {
          setInitializing(false);
          setLoading(false);
        }
      }
    };

    initializePage();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [navigate, retryCount]);

  const handleGenerateEntities = async () => {
    setGenerating(true);
    setError('');

    try {
      const response = await generateEntitiesWithRetry();
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
      if (transformedData?.entities) {
        setSelectedEntities(transformedData.entities.map((_, index) => index));
        setRejectedEntities([]);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } catch (error) {
      console.error('Generation Error:', error);
      setError('Failed to generate entities. Please try again.');
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
      const response = await fetchWithRetry({
        method: 'POST',
        url: 'http://localhost:5000/api/refine-entities',
        timeout: 30000
      });
      
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
        setSelectedEntities(transformedData.entities.map((_, index) => index));
        setRejectedEntities([]);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        throw new Error(response.data.error || 'Invalid response from server');
      }
    } catch (error) {
      console.error('Refinement Error:', error);
      setError('Failed to refine entities. Please try again.');
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
    
    const newEntityIndex = updatedEntityData.entities.length - 1;
    setSelectedEntities(prev => [...prev, newEntityIndex]);
    
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

  // Modified toggle function to handle rejected entities
  const toggleEntitySelection = (index) => {
    setSelectedEntities(prev => {
      const isCurrentlySelected = prev.includes(index);
      
      if (isCurrentlySelected) {
        // Entity is being deselected - add to rejected
        setRejectedEntities(rejectedPrev => {
          if (!rejectedPrev.includes(index)) {
            return [...rejectedPrev, index];
          }
          return rejectedPrev;
        });
        return prev.filter(i => i !== index);
      } else {
        // Entity is being selected - remove from rejected
        setRejectedEntities(rejectedPrev => rejectedPrev.filter(i => i !== index));
        return [...prev, index];
      }
    });
  };

  // Function to restore entity from rejected list
  const restoreEntityFromRejected = (index) => {
    setRejectedEntities(prev => prev.filter(i => i !== index));
    setSelectedEntities(prev => [...prev, index]);
  };

  // Function to permanently remove from rejected list
  const removeFromRejected = (index) => {
    setRejectedEntities(prev => prev.filter(i => i !== index));
  };

  const handleTechStackSubmit = async (techStack) => {
    try {
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

      await axios.post('http://localhost:5000/api/save-final-entities', {
        project_name: entityData.project_name,
        project_description: entityData.project_description,
        entities: selectedEntitiesData
      });

      navigate('/tech-stack-selection');
    } catch (error) {
      console.error('Error saving selected entities:', error);
      setError('Failed to save selected entities. Please try again.');
    }
  };

  const handleProceedToTechStack = async () => {
    if (selectedEntities.length === 0) {
      setError('Please select at least one entity to proceed');
      return;
    }
  
    try {
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
  
      await axios.post('http://localhost:5000/api/save-final-entities', {
        project_name: entityData.project_name,
        project_description: entityData.project_description,
        entities: selectedEntitiesData
      });
  
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
        // If all are selected, deselect all and move to rejected
        const allIndices = entityData.entities.map((_, index) => index);
        setSelectedEntities([]);
        setRejectedEntities(allIndices);
      } else {
        // Otherwise, select all and clear rejected
        setSelectedEntities(entityData.entities.map((_, index) => index));
        setRejectedEntities([]);
      }
    }
  };

  // Show loading screen while initializing
  if (initializing || loading) {
    return (
      <div 
        className="min-h-screen flex flex-col font-sans"
        style={{ 
          fontFamily: "'Inter', sans-serif",
          background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.primaryLight}30 100%)` 
        }}
      >
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader text={loadingMessage} />
            <div className="mt-4 max-w-md mx-auto">
              <div 
                className="text-sm px-4 py-2 rounded-lg"
                style={{ 
                  backgroundColor: `${colors.info}10`,
                  color: colors.textSecondary
                }}
              >
                <div className="flex items-center justify-center mb-2">
                  <svg className="animate-spin h-4 w-4 mr-2" style={{ color: colors.info }} fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span style={{ color: colors.info }}>Setting up your entities...</span>
                </div>
                <p className="text-xs">
                  This may take a few moments. We're ensuring everything is ready for you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Only render main content when entities are ready
  if (!entityData?.entities || entityData.entities.length === 0) {
    return (
      <div 
        className="min-h-screen flex flex-col font-sans"
        style={{ 
          fontFamily: "'Inter', sans-serif",
          background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.primaryLight}30 100%)` 
        }}
      >
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div 
              className="p-6 rounded-lg shadow-lg"
              style={{ 
                backgroundColor: colors.surface,
                border: `1px solid ${colors.borderDefault}`
              }}
            >
              <svg 
                className="mx-auto h-12 w-12 mb-4" 
                style={{ color: colors.warning }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 
                className="text-lg font-medium mb-2"
                style={{ color: colors.textPrimary }}
              >
                Setup Required
              </h3>
              <p 
                className="text-sm mb-4"
                style={{ color: colors.textSecondary }}
              >
                Unable to load or generate entities. Please return to project setup to configure your project properly.
              </p>
              <button
                onClick={() => navigate('/project-startup')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                style={{ 
                  backgroundColor: colors.primary,
                  color: colors.surface
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primaryDark;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary;
                }}
              >
                <svg className="mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Project Setup
              </button>
            </div>
          </div>
        </div>
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
      className="min-h-screen flex flex-col font-sans"
      style={{ 
        fontFamily: "'Inter', sans-serif",
        background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.primaryLight}20 100%)`,
        color: colors.textPrimary 
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        {/* Progress tracker */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6" style={{ backgroundColor: colors.surface, border: `1px solid ${colors.borderDefault}` }}>
            <div className="flex items-center justify-between">
              {[
                { id: 1, name: 'Project Setup', current: false, completed: true },
                { id: 2, name: 'Entity Generation', current: true, completed: false },
                { id: 3, name: 'TechStack Selection', current: false, completed: false },
                { id: 4, name: 'Folder Scaffolding', current: false, completed: false },
                { id: 5, name: 'Code Generation', current: false, completed: false },
                { id: 6, name: 'Code Refinement', current: false, completed: false }
              ].map((step, stepIdx) => (
                <React.Fragment key={step.id}>
                  <div className="flex items-center">
                    <div 
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-200 ${
                        step.completed || step.current ? 'text-white' : 'text-gray-500'
                      }`}
                      style={{ 
                        backgroundColor: step.completed 
                          ? colors.success 
                          : step.current 
                            ? colors.primary 
                            : `${colors.textLight}40`
                      }}
                    >
                      {step.completed ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        step.id
                      )}
                    </div>
                    <div className="ml-3 hidden sm:block">
                      <span 
                        className={`text-sm font-medium ${
                          step.completed || step.current ? '' : 'opacity-50'
                        }`}
                        style={{ 
                          color: step.completed || step.current ? colors.textPrimary : colors.textLight 
                        }}
                      >
                        {step.name}
                      </span>
                      {step.current && (
                        <div className="flex items-center mt-1">
                          <div className="flex space-x-1">
                            <div 
                              className="w-2 h-2 rounded-full animate-pulse"
                              style={{ backgroundColor: colors.primary }}
                            ></div>
                            <div 
                              className="w-2 h-2 rounded-full animate-pulse"
                              style={{ 
                                backgroundColor: colors.primary,
                                animationDelay: '0.2s'
                              }}
                            ></div>
                            <div 
                              className="w-2 h-2 rounded-full animate-pulse"
                              style={{ 
                                backgroundColor: colors.primary,
                                animationDelay: '0.4s'
                              }}
                            ></div>
                          </div>
                          <span 
                            className="ml-2 text-xs"
                            style={{ color: colors.primary }}
                          >
                            In Progress
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {stepIdx < 5 && (
                    <div className="flex-1 mx-2 sm:mx-4">
                      <div 
                        className="h-0.5 rounded-full transition-all duration-300"
                        style={{ 
                          backgroundColor: step.completed 
                            ? colors.success 
                            : step.current 
                              ? `${colors.primary}50`
                              : `${colors.textLight}30`
                        }}
                      ></div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            {/* Mobile view - show only current step prominently */}
            <div className="sm:hidden mt-4 text-center">
              <div 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: `${colors.primary}15`,
                  color: colors.primary
                }}
              >
                Step 2 of 6: Entity Generation
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
              className="mb-6 p-4 rounded-lg border flex items-start"
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
                        Regenerate Entities
                      </>
                    )}
                  </button>
                  
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
                        <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Refine Entities
                      </>
                    )}
                  </button>
                  
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
              <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                <div className="relative mx-auto p-6 border w-11/12 max-w-md shadow-lg rounded-lg" style={{ backgroundColor: colors.surface }}>
                  <div>
                    <h3 className="text-lg font-medium text-center mb-4" style={{ color: colors.textPrimary }}>
                      Add Custom Entity
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium" style={{ color: colors.textPrimary }}>Entity Name</label>
                        <input
                          type="text"
                          value={customEntity.Entity_Name}
                          onChange={(e) => setCustomEntity(prev => ({ ...prev, Entity_Name: e.target.value }))}
                          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none transition-all duration-200"
                          style={{ 
                            borderColor: colors.borderDefault,
                            backgroundColor: colors.background,
                            color: colors.textPrimary
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = colors.primary;
                            e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = colors.borderDefault;
                            e.target.style.boxShadow = 'none';
                          }}
                          placeholder="e.g., User"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium" style={{ color: colors.textPrimary }}>Entity Description</label>
                        <textarea
                          value={customEntity.Entity_Description}
                          onChange={(e) => setCustomEntity(prev => ({ ...prev, Entity_Description: e.target.value }))}
                          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none transition-all duration-200"
                          style={{ 
                            borderColor: colors.borderDefault,
                            backgroundColor: colors.background,
                            color: colors.textPrimary
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = colors.primary;
                            e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = colors.borderDefault;
                            e.target.style.boxShadow = 'none';
                          }}
                          rows="3"
                          placeholder="Describe what this entity represents..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium" style={{ color: colors.textPrimary }}>Fields</label>
                        {customEntity.Fields.map((field, index) => (
                          <div key={index} className="flex mt-2">
                            <input
                              type="text"
                              value={field}
                              onChange={(e) => handleCustomFieldChange(index, e.target.value)}
                              className="flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none transition-all duration-200"
                              style={{ 
                                borderColor: colors.borderDefault,
                                backgroundColor: colors.background,
                                color: colors.textPrimary
                              }}
                              onFocus={(e) => {
                                e.target.style.borderColor = colors.primary;
                                e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = colors.borderDefault;
                                e.target.style.boxShadow = 'none';
                              }}
                              placeholder={`Field ${index + 1}`}
                            />
                            {customEntity.Fields.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeCustomField(index)}
                                className="ml-2 px-3 py-2 text-white rounded-md transition-colors duration-200"
                                style={{ backgroundColor: colors.error }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.backgroundColor = `${colors.error}DD`;
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.backgroundColor = colors.error;
                                }}
                              >
                                −
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addCustomField}
                          className="mt-2 px-3 py-1 text-white rounded-md text-sm transition-colors duration-200"
                          style={{ backgroundColor: colors.primary }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = colors.primaryDark;
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = colors.primary;
                          }}
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
                        className="px-4 py-2 rounded-md transition-colors duration-200"
                        style={{ 
                          backgroundColor: colors.borderDefault,
                          color: colors.textSecondary
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = colors.borderFocus;
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = colors.borderDefault;
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddCustomEntity}
                        className="px-4 py-2 text-white rounded-md transition-colors duration-200"
                        style={{ backgroundColor: colors.primary }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = colors.primaryDark;
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = colors.primary;
                        }}
                      >
                        Add Entity
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                        backgroundColor: colors.background,
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
                  
                  {/* Rejected Entities Toggle Button */}
                  {rejectedEntities.length > 0 && (
                    <button
                      onClick={() => setShowRejectedSection(!showRejectedSection)}
                      className="inline-flex items-center text-sm font-medium px-3 py-1 rounded transition-colors duration-200"
                      style={{ 
                        backgroundColor: `${colors.error}10`,
                        color: colors.error
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = `${colors.error}20`;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = `${colors.error}10`;
                      }}
                    >
                      <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      {showRejectedSection ? 'Hide' : 'Show'} Rejected ({rejectedEntities.length})
                    </button>
                  )}
                  
                  <div 
                    className="text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    {selectedEntities.length} of {entityData.entities.length} selected
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-5 sm:p-6">
              {entityData?.entities?.length > 0 ? (
                <>
                  {/* Selected Entities Section */}
                  {filteredEntities.length > 0 ? (
                    <div>
                      <h3 className="text-lg font-medium mb-4" style={{ color: colors.textPrimary }}>
                        Selected Entities ({selectedEntities.length})
                      </h3>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                        {filteredEntities.map((entity, index) => {
                          const originalIndex = entityData.entities.indexOf(entity);
                          return selectedEntities.includes(originalIndex) ? (
                            <EntityCard 
                              key={originalIndex} 
                              entity={entity} 
                              selected={true}
                              onToggleSelection={toggleEntitySelection}
                              index={originalIndex}
                              colors={colors}
                            />
                          ) : null;
                        })}
                      </div>
                    </div>
                  ) : null}

                  {/* Rejected Entities Section */}
                  {rejectedEntities.length > 0 && showRejectedSection && (
                    <div className="border-t pt-6" style={{ borderColor: colors.borderDefault }}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium" style={{ color: colors.error }}>
                          Rejected Entities ({rejectedEntities.length})
                        </h3>
                        <button
                          onClick={() => {
                            // Restore all rejected entities
                            setSelectedEntities(prev => [...prev, ...rejectedEntities]);
                            setRejectedEntities([]);
                          }}
                          className="text-sm px-3 py-1 rounded transition-colors duration-200"
                          style={{ 
                            backgroundColor: `${colors.success}10`,
                            color: colors.success
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = `${colors.success}20`;
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = `${colors.success}10`;
                          }}
                        >
                          Restore All
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {rejectedEntities.map(entityIndex => {
                          const entity = entityData.entities[entityIndex];
                          return (
                            <div key={entityIndex} className="relative">
                              <div 
                                className="opacity-60 transform scale-95"
                                style={{ filter: 'grayscale(50%)' }}
                              >
                                <EntityCard 
                                  entity={entity} 
                                  selected={false}
                                  onToggleSelection={() => {}} // Disable normal toggle
                                  index={entityIndex}
                                  colors={colors}
                                  isRejected={true}
                                />
                              </div>
                              {/* Overlay with restore/remove buttons */}
                              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => restoreEntityFromRejected(entityIndex)}
                                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors duration-200"
                                  >
                                    <svg className="inline w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                    </svg>
                                    Restore
                                  </button>
                                  <button
                                    onClick={() => removeFromRejected(entityIndex)}
                                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors duration-200"
                                  >
                                    <svg className="inline w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M9 2a1 1 0 000 2H7a1 1 0 000 2v9a2 2 0 002 2h6a2 2 0 002-2V6a1 1 0 100-2h-2a1 1 0 100-2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* No matching entities message */}
                  {filteredEntities.length === 0 && searchTerm && (
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 115.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
      </main>

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