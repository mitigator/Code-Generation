import React, { useState } from 'react';

const frontendOptions = [
  { id: 'react', name: 'React' },
  { id: 'angular', name: 'Angular' },
  { id: 'vue', name: 'Vue.js' },
  { id: 'nextjs', name: 'Next.js' },
  { id: 'svelte', name: 'Svelte' },
  { id: 'html-css', name: 'HTML/CSS' },
  { id: 'tailwind', name: 'Tailwind CSS' }
];

const backendOptions = [
  { id: 'nodejs', name: 'Node.js' },
  { id: 'express', name: 'Express.js' },
  { id: 'springboot', name: 'Spring Boot' },
  { id: 'django', name: 'Django' },
  { id: 'flask', name: 'Flask' },
  { id: 'golang', name: 'Go' },
  { id: 'laravel', name: 'Laravel' },
  { id: 'aspnet', name: 'ASP.NET' }
];

const databaseOptions = [
  { id: 'mongodb', name: 'MongoDB' },
  { id: 'mysql', name: 'MySQL' },
  { id: 'postgresql', name: 'PostgreSQL' },
  { id: 'sqlserver', name: 'SQL Server' },
  { id: 'sqlite', name: 'SQLite' },
  { id: 'firebase', name: 'Firebase' }
];

const authenticationOptions = [
  { id: 'jwt', name: 'JWT' },
  { id: 'oauth', name: 'OAuth' },
  { id: 'firebase-auth', name: 'Firebase Auth' },
  { id: 'session', name: 'Session-based' }
];

const deploymentOptions = [
  { id: 'docker', name: 'Docker' },
  { id: 'heroku', name: 'Heroku' },
  { id: 'aws', name: 'AWS' },
  { id: 'azure', name: 'Azure' },
  { id: 'gcp', name: 'Google Cloud' }
];

function TechStackSelection({ onBack, onSubmit }) {
  const [frontend, setFrontend] = useState([]);
  const [backend, setBackend] = useState([]);
  const [database, setDatabase] = useState('');
  const [authentication, setAuthentication] = useState('');
  const [deployment, setDeployment] = useState('');

  const handleFrontendChange = (optionId) => {
    setFrontend(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId) 
        : [...prev, optionId]
    );
  };

  const handleBackendChange = (optionId) => {
    setBackend(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId) 
        : [...prev, optionId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const techStack = {
      frontend: frontendOptions.filter(opt => frontend.includes(opt.id)).map(opt => opt.name),
      backend: backendOptions.filter(opt => backend.includes(opt.id)).map(opt => opt.name),
      database: databaseOptions.find(opt => opt.id === database)?.name || '',
      additional_config: {
        authentication: authenticationOptions.find(opt => opt.id === authentication)?.name || '',
        deployment: deploymentOptions.find(opt => opt.id === deployment)?.name || ''
      }
    };
    onSubmit(techStack);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Select Your Tech Stack
          </h1>
          <p className="mt-3 text-xl text-gray-600">
            Choose the technologies for your project
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6 space-y-8">
            {/* Frontend Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Frontend Technologies</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {frontendOptions.map(option => (
                  <div key={option.id} className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id={`frontend-${option.id}`}
                        name="frontend"
                        type="checkbox"
                        checked={frontend.includes(option.id)}
                        onChange={() => handleFrontendChange(option.id)}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor={`frontend-${option.id}`} className="font-medium text-gray-700">
                        {option.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Backend Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Backend Technologies</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {backendOptions.map(option => (
                  <div key={option.id} className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id={`backend-${option.id}`}
                        name="backend"
                        type="checkbox"
                        checked={backend.includes(option.id)}
                        onChange={() => handleBackendChange(option.id)}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor={`backend-${option.id}`} className="font-medium text-gray-700">
                        {option.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Database Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Database</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {databaseOptions.map(option => (
                  <div key={option.id} className="flex items-center">
                    <input
                      id={`database-${option.id}`}
                      name="database"
                      type="radio"
                      checked={database === option.id}
                      onChange={() => setDatabase(option.id)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label htmlFor={`database-${option.id}`} className="ml-3 block text-sm font-medium text-gray-700">
                      {option.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Authentication Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Authentication</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {authenticationOptions.map(option => (
                  <div key={option.id} className="flex items-center">
                    <input
                      id={`auth-${option.id}`}
                      name="authentication"
                      type="radio"
                      checked={authentication === option.id}
                      onChange={() => setAuthentication(option.id)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label htmlFor={`auth-${option.id}`} className="ml-3 block text-sm font-medium text-gray-700">
                      {option.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Deployment Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Deployment</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {deploymentOptions.map(option => (
                  <div key={option.id} className="flex items-center">
                    <input
                      id={`deploy-${option.id}`}
                      name="deployment"
                      type="radio"
                      checked={deployment === option.id}
                      onChange={() => setDeployment(option.id)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label htmlFor={`deploy-${option.id}`} className="ml-3 block text-sm font-medium text-gray-700">
                      {option.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              onClick={onBack}
              className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Generate Project Structure
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TechStackSelection;