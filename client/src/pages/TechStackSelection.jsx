import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Loader from '../components/LoadingSpinner';

const techOptions = {
    backend: ['Express.js', 'Django', 'Spring Boot', 'Laravel', 'Flask'],
    frontend: ['React', 'Angular', 'Vue.js', 'Svelte', 'Next.js'],
    database: ['MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Firebase'],
    authentication: ['JWT', 'OAuth', 'Firebase Auth', 'Passport.js', 'Session']
  };
  
 

  function TechStackSelection() {
    const navigate = useNavigate();
    const [selectedStack, setSelectedStack] = useState({
      backend: [],
      frontend: [],
      database: '',
      authentication: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  
    const handleTechSelect = (category, value) => {
      if (category === 'database' || category === 'authentication') {
        setSelectedStack(prev => ({
          ...prev,
          [category]: value
        }));
      } else {
        setSelectedStack(prev => ({
          ...prev,
          [category]: prev[category].includes(value)
            ? prev[category].filter(item => item !== value)
            : [...prev[category], value]
        }));
      }
    };
  
    const handleFinalizeProject = async () => {
      if (!selectedStack.database || !selectedStack.authentication) {
        setError('Please select a database and authentication method');
        return;
      }
  
      setLoading(true);
      setError('');
  
      try {
        // Update the final_entities.json with the tech stack
        await axios.post('http://localhost:5000/api/finalize-project', {
          stack: {
            backend: selectedStack.backend,
            frontend: selectedStack.frontend,
            database: selectedStack.database
          },
          additional_config: {
            authentication: selectedStack.authentication,
            deployment: 'Docker' // Default value
          }
        });
  
        // Navigate to the final confirmation page
        navigate('/project-confirmation');
      } catch (error) {
        console.error('Error finalizing project:', error);
        setError('Failed to save project configuration. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Tech Stack Selection</h1>
            <p className="mt-3 text-xl text-gray-600">Choose the technologies for your project</p>
          </div>
  
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
  
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Backend Technologies */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Backend Technologies</h3>
                <div className="space-y-2">
                  {techOptions.backend.map(tech => (
                    <div key={tech} className="flex items-center">
                      <input
                        id={`backend-${tech}`}
                        name="backend"
                        type="checkbox"
                        checked={selectedStack.backend.includes(tech)}
                        onChange={() => handleTechSelect('backend', tech)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                      <label htmlFor={`backend-${tech}`} className="ml-3 block text-sm font-medium text-gray-700">
                        {tech}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Frontend Technologies */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Frontend Technologies</h3>
                <div className="space-y-2">
                  {techOptions.frontend.map(tech => (
                    <div key={tech} className="flex items-center">
                      <input
                        id={`frontend-${tech}`}
                        name="frontend"
                        type="checkbox"
                        checked={selectedStack.frontend.includes(tech)}
                        onChange={() => handleTechSelect('frontend', tech)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                      <label htmlFor={`frontend-${tech}`} className="ml-3 block text-sm font-medium text-gray-700">
                        {tech}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Database */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Database</h3>
                <div className="space-y-2">
                  {techOptions.database.map(db => (
                    <div key={db} className="flex items-center">
                      <input
                        id={`database-${db}`}
                        name="database"
                        type="radio"
                        checked={selectedStack.database === db}
                        onChange={() => handleTechSelect('database', db)}
                        className="h-4 w-4 text-indigo-600 border-gray-300"
                      />
                      <label htmlFor={`database-${db}`} className="ml-3 block text-sm font-medium text-gray-700">
                        {db}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Authentication */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Authentication</h3>
                <div className="space-y-2">
                  {techOptions.authentication.map(auth => (
                    <div key={auth} className="flex items-center">
                      <input
                        id={`auth-${auth}`}
                        name="authentication"
                        type="radio"
                        checked={selectedStack.authentication === auth}
                        onChange={() => handleTechSelect('authentication', auth)}
                        className="h-4 w-4 text-indigo-600 border-gray-300"
                      />
                      <label htmlFor={`auth-${auth}`} className="ml-3 block text-sm font-medium text-gray-700">
                        {auth}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
  
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleFinalizeProject}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : 'Finalize Project'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default TechStackSelection;