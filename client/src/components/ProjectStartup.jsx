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

  // Color Scheme (matching the homepage)
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
    // Try to load existing data if available
    axios.get('http://localhost:5000/api/entity-data')
      .then(response => {
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.background }}>
        <Loader text="Loading your project..." />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans"
      style={{ 
        fontFamily: "'Inter', sans-serif", 
        background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.primaryLight}20 100%)`,
        color: colors.textPrimary
      }}
    >
      {/* Progress tracker */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div 
              className="flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm"
              style={{ backgroundColor: colors.primary }}
            >
              1
            </div>
            <div className="ml-3">
              <span className="text-sm font-medium">Project Setup</span>
            </div>
          </div>
          <div 
            className="flex-grow h-0.5 mx-4"
            style={{ backgroundColor: `${colors.primary}40` }}
          ></div>
          <div className="flex items-center">
            <div 
              className="flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm"
              style={{ backgroundColor: `${colors.textLight}40` }}
            >
              2
            </div>
            <div className="ml-3">
              <span className="text-sm font-medium" style={{ color: colors.textLight }}>Entity Generation</span>
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
              <span className="text-sm font-medium" style={{ color: colors.textLight }}>Code Generation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 
            className="text-3xl font-bold sm:text-4xl"
            style={{ color: colors.textPrimary }}
          >
            Project Setup
          </h1>
          <p 
            className="mt-3 text-xl"
            style={{ color: colors.textSecondary }}
          >
            Define your project details to get started with CodePulse
          </p>
        </div>

        {error && (
          <div 
            className="mb-6 p-4 rounded-lg border animate-bounce-once"
            style={{ 
              backgroundColor: `${colors.error}10`, 
              borderColor: `${colors.error}30`
            }}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5" style={{ color: colors.error }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium" style={{ color: colors.error }}>{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div 
          className="rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:shadow-xl"
          style={{ 
            backgroundColor: colors.surface,
            borderColor: colors.borderDefault,
            boxShadow: `0 10px 25px -5px ${colors.primary}15, 0 10px 10px -5px ${colors.primary}10`
          }}
        >
          <div className="p-6 sm:p-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium" style={{ color: colors.textPrimary }}>
                  Project Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="projectName"
                    className="block w-full px-4 py-3 rounded-md border transition-all duration-200"
                    style={{ 
                      borderColor: colors.borderDefault,
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                      color: colors.textPrimary
                    }}
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="My Awesome Project"
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${colors.primary}30`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.borderDefault;
                      e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label htmlFor="projectDescription" className="block text-sm font-medium" style={{ color: colors.textPrimary }}>
                    Project Description
                  </label>
                  <div className="flex items-center">
                    <span className="text-xs" style={{ color: colors.textSecondary }}>AI-Enhanced</span>
                    <div className="ml-2 relative">
                      <svg 
                        className="h-4 w-4 cursor-pointer" 
                        style={{ color: colors.info }}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div 
                        className="absolute hidden group-hover:block w-64 bg-white rounded-md shadow-lg p-3 z-10 right-0 text-xs"
                        style={{ color: colors.textSecondary }}
                      >
                        Let our AI help you refine your project description.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-1 relative">
                  <textarea
                    id="projectDescription"
                    rows={8}
                    className="block w-full px-4 py-3 rounded-md border transition-all duration-200"
                    style={{ 
                      borderColor: colors.borderDefault,
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                      color: colors.textPrimary,
                      fontFamily: "'Inter', sans-serif",
                      resize: "vertical",
                      lineHeight: "1.5"
                    }}
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe your project goals, requirements, and any specific details... The more detail you provide, the better the AI can help you generate your application."
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${colors.primary}30`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.borderDefault;
                      e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
                    }}
                  />
                  
                  {/* Character count */}
                  <div 
                    className="absolute right-3 bottom-3 text-xs"
                    style={{ color: colors.textLight }}
                  >
                    {projectDescription.length} characters
                  </div>
                </div>
                <p 
                  className="mt-2 text-sm flex items-center"
                  style={{ color: colors.textSecondary }}
                >
                  <svg 
                    className="h-4 w-4 mr-1" 
                    style={{ color: colors.primary }}
                    fill="currentColor" 
                    viewBox="0 0 20 20" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Be as detailed as possible for better AI generation results
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h3 className="text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Project Description Example
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  "I need an e-commerce platform for a small business selling handmade jewelry. It should include product listings with categories, a shopping cart, secure checkout with multiple payment options, user accounts, order tracking, and an admin dashboard to manage inventory and orders. The design should be mobile-responsive with a modern, elegant aesthetic that showcases product photography."
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:px-8 sm:py-6 sm:flex sm:flex-row-reverse" style={{ backgroundColor: `${colors.background}` }}>
            <button
              onClick={handleSaveAndNext}
              disabled={isSaving}
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 rounded-lg text-base font-medium transition-all duration-300 sm:ml-3 disabled:opacity-75 disabled:cursor-not-allowed transform hover:translate-y-px"
              style={{ 
                backgroundColor: colors.primary, 
                color: colors.surface, 
                boxShadow: `0 4px 6px -1px ${colors.primary}30, 0 2px 4px -1px ${colors.primary}20`
              }}
              onMouseOver={!isSaving ? (e) => {
                e.currentTarget.style.backgroundColor = colors.primaryDark;
                e.currentTarget.style.boxShadow = `0 6px 8px -1px ${colors.primary}40, 0 3px 6px -1px ${colors.primary}30`;
              } : undefined}
              onMouseOut={!isSaving ? (e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
                e.currentTarget.style.boxShadow = `0 4px 6px -1px ${colors.primary}30, 0 2px 4px -1px ${colors.primary}20`;
              } : undefined}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  Save & Continue 
                  <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full mt-3 sm:mt-0 sm:w-auto inline-flex justify-center items-center px-6 py-3 rounded-lg text-base font-medium transition-all duration-300 border sm:mr-3 disabled:opacity-75 disabled:cursor-not-allowed transform hover:translate-y-px"
              style={{ 
                color: colors.primary, 
                borderColor: colors.borderDefault,
                backgroundColor: colors.surface
              }}
              onMouseOver={!isGenerating ? (e) => {
                e.currentTarget.style.backgroundColor = `${colors.primary}10`;
                e.currentTarget.style.borderColor = colors.primary;
              } : undefined}
              onMouseOut={!isGenerating ? (e) => {
                e.currentTarget.style.backgroundColor = colors.surface;
                e.currentTarget.style.borderColor = colors.borderDefault;
              } : undefined}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" style={{ color: colors.primary }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enhancing with AI...
                </>
              ) : (
                <>
                  <svg className="mr-2 w-5 h-5" style={{ color: colors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Enhance with AI
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center text-sm font-medium transition-colors duration-200"
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
            Back to Home
          </button>
          
          <div className="text-sm" style={{ color: colors.textLight }}>
            Step 1 of 3
          </div>
        </div>
      </div>

      {/* Tips Panel (floating) */}
      <div
        className="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-xs hidden md:block"
        style={{ 
          backgroundColor: colors.surface,
          borderLeft: `4px solid ${colors.secondary}`,
          boxShadow: `0 10px 25px -5px ${colors.secondary}20, 0 10px 10px -5px ${colors.secondary}10`
        }}
      >
        <div className="flex items-start">
          <div
            className="flex-shrink-0 h-6 w-6 mr-2"
            style={{ color: colors.secondary }}
          >
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium" style={{ color: colors.textPrimary }}>Tip: Let AI Help</h4>
            <p className="mt-1 text-xs" style={{ color: colors.textSecondary }}>
              Start with a basic description and click "Enhance with AI" to let our AI help you create a comprehensive project plan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectStartupPage;